import ApiError from "src/common/api.error";
import ApiCodes from "src/common/api.codes";
import ApiMessages from "src/common/api.messages";
import AuthRepository from "./auth.repository";
import { assertNotNull, assertTrue } from "src/lib/utils";
import { CookieOptions } from "express";

export default class AuthService {
    public adminLogin = async (password) => {
        assertNotNull(
            password,
            new ApiError(ApiCodes.BAD_REQUEST, ApiMessages.BAD_REQUEST, {
                message: "password are required",
            })
        );

        const isAdminPasswordValid = await new AuthRepository().findByPassword(
            password
        );

        assertTrue(
            isAdminPasswordValid,
            new ApiError(ApiCodes.UNAUTHORIZED, ApiMessages.UNAUTHORIZED, {
                message: "Invalid password",
            })
        );

        return this.generateToken();
    };

    public getCookieOptions = (): CookieOptions => {
        const cookieOptions: CookieOptions = {
            httpOnly: true,
            maxAge: 1000 * 60 * 30,
        };
        return cookieOptions;
    };

    private generateToken = async () => {
        const token = {
            role: "admin",
        };
        return token;
    };
}
