import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import tracer from 'cls-rtracer';
import * as Api from './app.router';
import logger from './lib/logger';
import env from './env';
import * as mysql from './lib/mysql';
import * as requestIp from 'request-ip';
import { version } from '../package.json';

export const app = express();

function getOrigins() {
    const origins = env.app.cors.origins?.split(',') || [];
    logger.log('origins:', JSON.stringify(origins));
    return origins;
}

// https://1004lucifer.blogspot.com/2019/04/axios-response-headers-content.html
app.use(
    cors({
        origin: env.mode.prod ? getOrigins() : '*',
        exposedHeaders: ['Content-Disposition'],
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());
app.use(requestIp.mw());
app.use(tracer.expressMiddleware());
app.use((req, res, next) => {
    res.on('finish', () => {
        // console.log(`[${req.method}] ${req.originalUrl} [FINISHED]`)
    });

    res.on('close', () => {
        // console.log(`[${req.method}] ${req.originalUrl} [CLOSED]`)
    });

    next();
});
app.use(Api.path, Api.router);


app.listen(env.app.port, async function appMain() {
    logger.init({
        log: true,
        sql: true,
        net: true,
        debug: !env.mode.prod,
        error: true,
        fatal: true,
        console: false,
    });

    logger.log(`[ v${version}, ${env.mode.value}, ${JSON.stringify(env.config)} ] =========================================`);

    await mysql.connect();

    logger.log(`----------------------------------------------------------------------------`);
    logger.log(`🚀 App listening on the port ${env.app.port}`);
    logger.log(`============================================================================`);

    console.log(`${new Date().toISOString()} [ v${version}, ${env.mode.value} ] =================================== READY !!!`);
});
