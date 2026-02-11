import prisma from '../prisma/prisma';
import { User } from '@prisma/client';

class UserRepository {
    async createData(data: {
        email : string;
        fullName : string;
        passwordHash? : string;
        phone? : string;
        isVerified? : boolean;
    }) : Promise<User> {
        return prisma.user.create({ data });  
    }

    async findById(id: string) : Promise<User | null> {
        return prisma.user.findUnique({ where: { id } });
    }

    async findByEmail(email: string) : Promise<User | null>{
        return prisma.user.findUnique({where: {email}});
    }

    async update(id: string, data: Partial<User>) : Promise<User> {
        return prisma.user.update({
            where: { id },
            data
        });
    }

    async delete(id: string) : Promise<User> {
        return prisma.user.delete({ where: { id } });
    }


}

export const userRepository = new UserRepository();
