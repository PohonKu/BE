import bcrypt from 'bcryptjs'
import { hash } from 'node:crypto'

export const hashPassword = async (password: string): Promise <string>=>{
    return bcrypt.hash(password, 10);
};

export const comparePassword = async (
    password: string,
    hash : string
): Promise <boolean> =>{
    return bcrypt.compare(password, hash)
}