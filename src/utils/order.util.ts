export const generateOrderNumber = (): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth()+1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();

    return `ORD-${year}${month}${day}-${random}`;
    //contoh : ORD-20260217-A3B2
}

export const generateSerialNumber = async (
    tx: any,
    speciesName: string,
    speciesId: string
): Promise<string> =>{
    const prefix = speciesName.substring(0, 2).toUpperCase();

    const year = new Date().getFullYear();
    // Hitung total pohon species ini yang sudah ada
    const count = await tx.tree.count({
        where: { speciesId }
    });

    const number = String(count + 1).padStart(4, '0');

    return `${prefix}-${year}-${number}`;
    // Contoh: JT-2026-0001
}