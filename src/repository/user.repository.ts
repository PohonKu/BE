import { string } from 'zod';
import prisma from '../prisma/prisma';
import { User } from '@prisma/client';

type GoogleUser = {
  fullName: string;
  email: string;
  avatarUrl?: string | null;
};

class UserRepository {
    async createData(data: {
        email : string;
        fullName : string;
        passwordHash? : string;
        phone? : string;
        googleId?: string;
        avatarUrl?: string;
        authProvider?: string;
        isVerifiedEmail? : boolean;
    }) : Promise<User> {
        return prisma.user.create({ data });  
    }

    async connectGoogleAccount(
        userId: string,
        googleId: string,
        avatarUrl?: string, 
    ): Promise<User>{
        return prisma.user.update({
            where: {id: userId},
            data: {
                googleId,
                avatarUrl,
                isVerifiedEmail: true,
            }
        })
    }

    async findByGoogleId(googleId: string): Promise<User | null>{
        return prisma.user.findUnique({where: {googleId} })
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

    async findProfile(googleId: string) :Promise<GoogleUser | null>{
        return prisma.user.findUnique({
            where: {googleId},
            select: { fullName: true, email: true, avatarUrl: true }
        })
    }

    

 



}

export const userRepository = new UserRepository();
