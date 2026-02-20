import { snap } from '../config/midtrans';
import prisma from '../config/database';
import { orderRepository } from '../repository/order.repository';
import { generateSerialNumber } from '../utils/order.util';


class PaymentService {
    async createPayment(orderId: string, userId: string) {
    const order = await orderRepository.findById(orderId);

    if (!order) throw new Error('Order tidak ditemukan');
    if (order.userId !== userId) throw new Error('Akses ditolak');
    if (order.paymentStatus === 'PAID') {
      throw new Error('Order sudah dibayar');
    }
    if (order.paymentStatus === 'FAILED') {
      throw new Error('Order sudah dibatalkan');
    }

    // Jika sudah ada snapToken, return yang lama
    // Supaya tidak buat transaksi baru di Midtrans
    if (order.snapToken) {
      return {
        snapToken: order.snapToken,
        orderId: order.id,
        orderNumber: order.orderNumber,
        totalAmount: Number(order.totalAmount),
      };
    }

    const item = order.orderItems;
    if (!item) throw new Error('Order item tidak ditemukan');

    // Buat parameter untuk Midtrans
    const parameter = {
      transaction_details: {
        order_id: order.orderNumber,  // harus unik di Midtrans
        gross_amount: Number(order.totalAmount),
      },
      item_details: [{
        id: item.speciesId,
        name: `Adopsi Pohon ${item.species.name}`,
        price: Number(item.priceAtPurchase),
        quantity: 1,
      }],
      customer_details: {
        first_name: order.user.fullName,
        email: order.user.email,
        phone: order.user.phone || '',
      },
      expiry: {
        unit: 'hours',
        duration: 24,
      }
    };

    // Request ke Midtrans → dapat snapToken
    const transaction = await snap.createTransaction(parameter);

    // Simpan snapToken ke database
    await orderRepository.saveSnapToken(order.id, transaction.token);

    return {
      snapToken: transaction.token,
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalAmount: Number(order.totalAmount),
    };
  }



  async handleWebhook(notification: any) {
    const orderNumber = notification.order_id;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;
    const paymentType = notification.payment_type;

    console.log(`📩 Webhook: ${orderNumber} → ${transactionStatus}`);

    // Cari order
    const order = await orderRepository.findByOrderNumber(orderNumber);
    if (!order) throw new Error('Order tidak ditemukan');

    // Idempotent - skip jika sudah diproses
    if (order.paymentStatus === 'PAID') {
      console.log('⚠️ Sudah PAID, skip');
      return { message: 'Already processed' };
    }

    const item = order.orderItems;
    if (!item) throw new Error('Order item tidak ditemukan');

    // Tentukan status pembayaran
    let paymentStatus = 'PENDING';
    if (transactionStatus === 'capture') {
      paymentStatus = fraudStatus === 'accept' ? 'PAID' : 'PENDING';
    } else if (transactionStatus === 'settlement') {
      paymentStatus = 'PAID';
    } else if (['cancel', 'deny', 'expire'].includes(transactionStatus)) {
      paymentStatus = 'FAILED';
    }

    // Proses dalam transaction
    await prisma.$transaction(async (tx) => {

      // Update status order
      await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus,
          paymentMethod: paymentType || null,
        }
      });

      // ========================
      // JIKA BERHASIL BAYAR
      // ========================
      if (paymentStatus === 'PAID') {

        // 1. Kurangi reservedStock
        await tx.treeSpecies.update({
          where: { id: item.speciesId },
          data: {
            reservedStok: { decrement: 1 }
            // availableStock tidak dikembalikan (sudah terjual)
          }
        });

        // 2. Generate serial number unik
        const serialNumber = await generateSerialNumber(
          tx,
          item.species.name,
          item.speciesId
        );

        // 3. Buat pohon BARU di tabel trees
        const newTree = await tx.tree.create({
          data: {
            speciesId: item.speciesId,
            serialNumber,
            status: 'SOLD',
            // latitude, longitude, plantedAt diisi admin nanti
          }
        });

        // 4. Buat adopsi dengan treeId pohon baru
        await tx.adoption.create({
          data: {
            userId: order.userId,
            orderId: order.id,
            speciesId: item.speciesId,
            treeId: newTree.id,      // ← pohon yang baru dibuat
            nameOnTag: item.nameOnTag,
          }
        });

        console.log(`✅ Pohon baru dibuat: ${serialNumber}`);
        console.log(`✅ Adopsi dibuat untuk user: ${order.userId}`);
      }

      // ========================
      // JIKA GAGAL BAYAR
      // ========================
      if (paymentStatus === 'FAILED') {

        // Kembalikan stok ke available
        await tx.treeSpecies.update({
          where: { id: item.speciesId },
          data: {
            availabelStok: { increment: 1 },
            reservedStok:  { decrement: 1 },
          }
        });

        // Tidak ada pohon dibuat
        // Tidak ada adopsi dibuat
        console.log(`❌ Order gagal, stok dikembalikan`);
      }
    });

    return { orderNumber, paymentStatus };
  }
}

export const paymentService = new PaymentService();