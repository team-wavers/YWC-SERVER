import { CookieOptions } from "express";

export default class AuthRepository {
    public findByPassword = async (password: string): Promise<boolean> => {
        if (process.env.ADMIN_PASSWORD === password) {
            return true;
        }
        return false;
    };
}
