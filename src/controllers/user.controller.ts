import { Request, Response } from 'express';
import { userRepository } from '../repository/user.repository';
import { sendSuccess, sendError } from '../utils/response.util';
import { error } from 'node:console';

class UserController{
    async getProfile(req: Request, res: Response){
        try{
            const userId = (req.user as any).id;
            const user = await userRepository.findById(userId);

            if (!user) {
                return sendError(res, 'User not found', 404);
            }

            const {passwordHash, ...userWithoutPassword} = user;
            sendSuccess(res, 'Profile retrieved successfully', userWithoutPassword);
        } catch(error: any){
            sendError(res, error.message);
        }
    }

    async updateProfile(req: Request, res: Response){
        try{
            const userId = (req.user as any).id;
            const {fullName, phone} = req.body;
            const updateUser = await userRepository.update(userId,{
                fullName,
                phone
            } );

            const { passwordHash, ...userWithoutPassword } = updateUser;
            sendSuccess(res, 'Profile updated successfully', userWithoutPassword);
        } catch (error: any){
            sendError(res, error.message);
        }
    }

}

export const userController = new UserController();



{/**
import { Request, Response } from 'express';
import express from 'express';
import prisma from '../prisma/prisma';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.get('/users', async (req: Request, res: Response) => {
    try {
    console.log('Fetching users...');
    const users = await prisma.user.findMany();
    console.log('Users fetched:', users);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error); // ← ini penting!
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.post('/users', async(req, res)=>{
    try{
        const { email, fullName, password, phone, role } = req.body;
        if (!email || !fullName || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email, full name, and password are required'
            });
        }
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({
            success: false,
            message: 'Email already registered'
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
        data: {
            email,
            fullName,
            passwordHash,
            phone: phone || null,
            role: role || 'USER'
        },
        select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
            role: true,
            createdAt: true
        }
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: newUser
        });
    } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
    
});







export default router;
 */}