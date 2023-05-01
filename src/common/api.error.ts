import tid from 'cls-rtracer';
import fs from 'fs';
import appRoot from 'app-root-path';
import path from 'path';
import * as os from 'os';
import env from '../env';
import context from 'express-http-context';
import ApiHeaders from './api.headers';
import { prune } from '../lib/utils';

export default class ApiError extends Error {
    public detail;
    public tid;
    public version;
    public build;
    public hostname;
    public __line__;
    public __function__;
    public __file__;

    public constructor(public code: number, msg?: string, detail?: any) {
        const message = msg;
        super(message);

        const errResponse = context.get(ApiHeaders.DEBUG_RESPONSE_ERROR_LEVEL);
        const isVerbose = errResponse ? errResponse?.includes('verbose') : !env.mode.prod;

        this.code = code;
        this.detail = isVerbose ? {
            ...detail, ...{
                path: detail?.req?.path,
                method: detail?.req?.method,
                param: detail?.req?.param,
                query: detail?.req?.query,
                body: detail?.req?.body,
            },
        } : detail;

        const data = fs.readFileSync(path.join(appRoot.path, 'package.json'), { encoding: 'utf8', flag: 'r' });
        const pkg = JSON.parse(data);

        const e = detail?.error || new Error();
        const frame = e.stack.split("\n")[2]; // change to 3 for grandparent func
        this.tid = tid.id();
        this.version = pkg.version;
        this.build = pkg.build;
        this.hostname = os.hostname();
        this.detail = prune(this.detail);
        this.__line__ = frame.split(":").reverse()[1];
        this.__file__ = frame.split(':')[0].split('/').reverse()[0];
        this.__function__= frame.split(" ")[5];
    }
}
