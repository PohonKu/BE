import { Request, Response } from "express";
import {authService} from "../services/auth.service";
import {sendSuccess, sendError} from "../utils/response.util";
import { send } from "node:process";


class AuthController {
    async register(req: Request, res: Response){
        try{
            const {email, fullName, password, phone} = req.body;
            const result = await authService.register({
                email,
                fullName,
                password,
                phone,
            });
            sendSuccess(res, 'Register success', result, 201)

        } catch (error: any){
            sendError (res, error.message, 500);
        }
    }

    async login (req: Request, res: Response){
        try{
            const {email, password} = req.body;
            const result  = await authService.login(email, password);
            sendSuccess (res, 'Login Success', result);
        } catch (error: any){
            sendError (res, error.message, 500);
        }
    }

    async logout(req: Request, res: Response) {
        sendSuccess(res, 'Logout successful');
    }

    

}

export const authController = new AuthController();
