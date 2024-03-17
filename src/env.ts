import * as dotenv from 'dotenv';
import * as path from 'path';

import * as pkg from '../package.json';
import {
    getOsEnv,
    getOsEnvBool,
    getOsEnvNumber,
    getOsEnvNumberOptional,
    getOsEnvOptional,
    normalizePort,
} from './lib/env';
import appRoot from 'app-root-path';
import fs from 'fs';
import * as process from 'process';

/**
 * Load .env file or for tests the .env.test file.
 */
const postfix = () => {
    const envs = [['prod'], ['dev']];
    const env = process.env.NODE_ENV?.toLowerCase();

    if (!env) return '';

    let result = '.' + env;
    // return true 는 break
    // return false 는 continue
    envs.some((e) => {
        const key = e[0];
        const found = env.includes(key);
        if (found) result = '.' + (e.length > 1 ? e[1] : key);

        return found;
    });

    return result;
};

const config = { path: path.join(appRoot.path, `.env${postfix()}`) };

(() => {
    try {
        if (fs.existsSync(config.path)) {
            //file exists
        } else {
            console.error(JSON.stringify(config));
            process.exit(1);
        }
    } catch (err) {
        console.error(JSON.stringify(config), err);
        process.exit(1);
    }
})();

dotenv.config(config);

/**
 * Environment variables
 */
const env = {
    config: config,
    mode: {
        prod: process.env.NODE_ENV?.toLowerCase().includes('prod'),
        dev: process.env.NODE_ENV?.toLowerCase().includes('dev'),
        test: process.env.NODE_ENV?.toLowerCase().includes('test'),
        value: process.env.NODE_ENV?.toLowerCase(),
    },
    mysql: {
        host: getOsEnv('MYSQL_HOST'),
        port: getOsEnv('MYSQL_PORT'),
        username: getOsEnv('MYSQL_USERNAME'),
        password: getOsEnv('MYSQL_PASSWORD'),
        schema: getOsEnv('MYSQL_SCHEMA'),
    },
    admin: {
        password: getOsEnv('ADMIN_PASSWORD'),
    },
    app: {
        name: getOsEnv('APP_NAME'),
        version: pkg.version,
        description: pkg.description,
        port: normalizePort(process.env.APP_PORT),
        cors: {
            origins:
                getOsEnvOptional('APP_CORS_ORIGINS') ||
                getOsEnvOptional('APP_WEB_URL'),
        },
        web: {
            url: getOsEnvOptional('APP_WEB_URL'),
        },
        cookie: {
            domain: getOsEnvOptional('COOKIE_DOMAIN'),
        },
        gptapi: {
            key: getOsEnvOptional('OPENAI_API_KEY'),
        },
    },
};

export default env;
