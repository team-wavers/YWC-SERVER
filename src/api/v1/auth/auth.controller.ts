import logger from "../../../../src/lib/logger";
import httpStatus from "http-status";
import AuthService from "./auth.service";
import { Result } from "../../../../src/common/result";

export default class AuthController {
    adminSignIn = async (req, res, next) => {
        const password = req.body?.password;
        const cookieOptions = new AuthService().createCookieOptions();
        let result;
        let response;

        try {
            result = await new AuthService().adminSignIn(password);
            response = Result.ok<JSON>().toJson();
        } catch (e: any) {
            logger.err(JSON.stringify(e));
            logger.error(e);

            response = Result.fail<Error>(e).toJson();
        }
        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK)
            .cookie("admin", result, cookieOptions)
            .json(response);
    };

    adminSignOut = async (req, res, next) => {
        const cookieOptions = new AuthService().expireCookieOptions();
        let result;
        let response;

        try {
            response = Result.ok<JSON>().toJson();
        } catch (e: any) {
            logger.err(JSON.stringify(e));
            logger.error(e);

            response = Result.fail<Error>(e).toJson();
        }
        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK)
            .cookie("admin", "", cookieOptions)
            .json(response);
    };
}
