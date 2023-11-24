import { Result } from "../../src/common/result";
import logger from "./logger";
import httpStatus from "http-status";
import ApiError from "src/common/api.error";
import ApiCodes from "src/common/api.codes";
import ApiMessages from "src/common/api.messages";

export default function verifyCookie(req, res, next) {
    try {
        const token = req.cookies.admin?.role;

        if (!token) {
            throw new ApiError(ApiCodes.OK, ApiMessages.NOT_FOUND, {
                message: "Token not found",
            });
        }

        if (!isTokenValid(token)) {
            throw new ApiError(ApiCodes.OK, ApiMessages.UNAUTHORIZED, {
                message: "Invalid token",
            });
        }

        next();
    } catch (e) {
        logger.err(JSON.stringify(e));
        logger.error(e);

        const response = Result.fail<Error>(e).toJson();
        res.status(httpStatus.OK).json(response);
    }
}

function isTokenValid(token) {
    return token === "admin";
}
