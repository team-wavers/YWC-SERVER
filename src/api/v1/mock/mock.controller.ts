import logger from '../../../lib/logger';
import httpStatus from 'http-status';
import MockService from './mock.service';
import { Result } from '../../../common/result';

export default class MockController {
    storeList = async (req, res, next) => {
        const page = req.query?.page ? parseInt(req.query.page, 10) : 1;
        const size = req.query?.size ? parseInt(req.query?.size, 10) : 15;
        let result;
        let response;

        try {
            result = await new MockService().list(page, size);
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
