import { userRepository } from "../repository/user.repository";
import { hashPassword, comparePassword } from "../utils/password.util";
import { generateToken, generateRefreshToken, verifyRefreshToken, verifyToken } from "../utils/jwt.util";
import { User } from "@prisma/client";


class AuthServices {
    async register(data:{
        email: string,
        fullName: string,
        password: string,
        phone?: string
    }){
        const existingUser = await userRepository.findByEmail(data.email)
        if(existingUser) throw new Error ('Email already registered')

        const passwordHash = await hashPassword(data.password);

        const user = await userRepository.createData({
            email: data.email,
            fullName: data.fullName,
            passwordHash, 
            phone : data.phone,
            authProvider: 'LOCAL',
        })

        const tokens = this.generateTokens(user);

        return {
            user: this.sanitizeUser(user),
            ...tokens,
            };
        }

    async login (email: string, password: string){
        const user = await userRepository.findByEmail(email);

        if(!user || !user.passwordHash) {
            throw new Error('invalid account (email or password)')
        }

        const inValid = await comparePassword(password, user.passwordHash);

        if(!inValid){
            throw new Error('Invalid Password, please try again!')
        }

        const tokens = this.generateTokens(user);

        return {
        user: this.sanitizeUser(user),
        ...tokens,
        };
    }

    async googleLogin(user: User){
        const token = this.generateTokens(user);

        return {
            user: this.sanitizeUser(user),
            ...token
        }
    }

    async findProfile(googleId: string){
        const profile = await userRepository.findByGoogleId(googleId)
        return profile;
    }

    async refreshAccesToken(refreshToken: string){
        const {verifyRefreshToken} = await import('../utils/jwt.util');

        try{
            const decode = verifyRefreshToken(refreshToken)
            const user = await userRepository.findById(decode.userId);

            if(!user){
                throw new Error('user tidak ditemukan')
            }

            const accestToken = generateToken({
                userId: user.id,
                email: user.email,
                role: user.role,
            })

            return {accestToken}
        } catch(error){
            throw new Error('refres token tidak valid')
        }
    }

    private generateTokens(user: User){
        const accessToken = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role
        })

        const refreshToken = generateRefreshToken({
            userId: user.id
        })

        return {accessToken, refreshToken}
    }

    private sanitizeUser(user: User){
        const {passwordHash, googleId, ...sanitizeUser} = user as any;
        return sanitizeUser;
    }



    
}


export const authService = new AuthServices();