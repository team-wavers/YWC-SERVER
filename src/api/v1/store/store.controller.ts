import logger from '../../../lib/logger';
import httpStatus from 'http-status';
import StoreService from './store.service';
import { Result } from '../../../common/result';

export default class StoreController {
    list = async (req, res, next) => {
        const q = req.query?.q;
        const page = req.query?.page ? parseInt(req.query.page, 10) : 1;
        const size = req.query?.size ? parseInt(req.query?.size, 10) : 15;
        let result;
        let response;

        try {
            if (q) {
                result = await new StoreService().search(q, page, size);
                response = Result.ok<JSON>(result).toJson();
            } else {
                result = await new StoreService().list(page, size);
                response = Result.ok<JSON>(result).toJson();
            }
        } catch (e: any) {
            logger.err(JSON.stringify(e));
            logger.error(e);

            response = Result.fail<Error>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    };

    nearbyList = async (req, res, next) => {
        const longitude = req.query?.longitude;
        const latitude = req.query?.latitude;
        const distance = req.query?.distance ? parseInt(req.query?.distance, 10) : 1000;
        let result;
        let response;

        try {
            result = await new StoreService().nearbyList({longitude, latitude, distance});
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
