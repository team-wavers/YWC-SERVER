import httpStatus from 'http-status';
import { Result } from 'src/common/result';
import logger from 'src/lib/logger';
import rankService from './rank.service';

export default class RankController {
    getRank = async (req, res, next) => {
        const rankOffset = req.body?.rankOffset;
        let result;
        let response;

        try {
            result = await new rankService().getRank(rankOffset);
            response = Result.ok<JSON>(result).toJson();
        } catch (e: any) {
            logger.err(JSON.stringify(e));
            logger.error(e);

            response = Result.fail<Error>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    };

    setRank = async (req, res, next) => {
        const storeName = req.body?.storeName;
        let result;
        let response;

        try {
            result = await new rankService().setRank(storeName);
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
