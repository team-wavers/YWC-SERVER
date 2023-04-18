import { Router } from 'express';
import httpStatus from 'http-status';
import ApiMessages from './common/api.messages';
import * as v1 from './api/v1/v1.router';

export const router = Router();
export const path = '';

/**
 * API version에 독립적인 Route path
 */
router.get('/healthCheck', function (req, res) {
    res.status(httpStatus.OK).json({ result: ApiMessages.OK });
});

router.use(v1.path, v1.router);
