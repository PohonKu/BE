import { userRepository } from "../repository/user.repository";
import { hashPassword, comparePassword } from "../utils/password.util";
import { generateToken, generateRefreshToken, verifyRefreshToken, verifyToken } from "../utils/jwt.util";


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
        })

        const accestToken = generateToken({
            userId: user.id
        })

        const refresToken = generateRefreshToken({
            userId : user.id
        })

        return {user, accestToken, refresToken};
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

        const accestToken = generateToken({
            userId: user.id
        });

        const refresToken = generateRefreshToken({
            userId: user.id
        })

        return {user, accestToken, refresToken}
    }

    
}


export const authService = new AuthServices();