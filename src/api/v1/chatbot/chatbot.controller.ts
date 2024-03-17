import httpStatus from 'http-status';
import { Result } from 'src/common/result';
import logger from 'src/lib/logger';
import ChatbotService from './chatbot.service';

export default class ChatbotController {
    message = async (req, res, next) => {
        const message = req.body?.message;
        let result;
        let response;

        try {
            result = await new ChatbotService().message(message);
            response = Result.ok<JSON>(result).toJson();
        } catch (e: any) {
            logger.err(JSON.stringify(e));
            logger.error(e);

            response = Result.fail<Error>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    };
}
