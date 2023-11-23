import { Result } from "../../src/common/result";
import logger from "./logger";
import httpStatus from "http-status";

function verifyCookie(req, res, next) {
    if (!req.cookies.admin) {
        return handleAuthError(res, "Admin cookie not found");
    }

    const { token } = req.cookies.admin;

    if (!token) {
        return handleAuthError(res, "Token not found");
    }

    if (token.role !== "admin") {
        return handleAuthError(res, "Invalid token");
    }
    next();
}

function handleAuthError(res, message) {
    const error = new Error(message);
    const response = Result.fail<Error>(error).toJson();

    logger.err(JSON.stringify(error));
    logger.error(error);

    res.status(httpStatus.UNAUTHORIZED).json(response);
}
