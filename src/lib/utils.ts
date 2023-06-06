import short from 'short-uuid';
import logger from './logger';
import { Model } from 'sequelize';

export const generateRandomString = (length: number): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; ++i) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
};

export const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
}

export const uuid = (): string => {
    const translator = short();
    return translator.generate();
}

export const propertiesToArray = obj => {
    const isObject = val =>
        val && typeof val === 'object' && !Array.isArray(val);

    const addDelimiter = (a, b) =>
        a ? `${a}.${b}` : b;

    const paths = (obj = {}, head = '') => {
        return Object.entries(obj)
            .reduce((product, [key, value]) =>
            {
                const fullPath = addDelimiter(head, key)
                return isObject(value) ?
                    product.concat(paths(value, fullPath))
                    : product.concat(fullPath)
            }, []);
    }

    return paths(obj);
};

/**
 *
 * https://stackoverflow.com/questions/15690706/recursively-looping-through-an-object-to-build-a-property-list/53620876#53620876
 *
 * @param obj
 * @param stack
 */
export const iterate = (obj, stack) => {
    logger.log(`obj: ${JSON.stringify(obj)}, stack: ${JSON.stringify(stack)}`);

    const item = {};
    for (const property in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, property)) continue;

        const value = obj[property];
        if (typeof value != "object") {
            logger.log(property + "," + obj[property] + "," + stack);
            item[property] = value;
        } else {
            iterate(obj[property], stack?.length > 0 ? `${stack}.${property}` : `${property}`);
        }
    }
};

export const getPlainObject = (obj) => {
    let result = {...obj};
    try {
        // Sequelize Model을 plain 처리
        if (obj instanceof Model) result = obj.get({ plain: true });
    } catch (e) {
        logger.error(e);
    }

    return result;
}

export const getParsedValue = (value) => {
    let result;
    try {
        // value가 JSON string인 경우
        result = JSON.parse(value);
    } catch (e) {
        result = value;
    }

    return result;
}

export const removeSensitiveValues = (obj, depth = 1) => {
    if (depth > 10) return obj;

    const result = getPlainObject(obj);
    for (const property in result) {
        if (!Object.prototype.hasOwnProperty.call(result, property)) continue;

        const value = typeof result[property] === 'string' ? getParsedValue(result[property]) : result[property];
        if (typeof value === "object") {
            result[property] = removeSensitiveValues(value, depth + 1);
        } else if (typeof value === 'string') {
            if (['source', 'target'].includes(property?.toLowerCase()) || property?.toLowerCase().includes('password')) {
                result[property] = undefined;
            }
        }
    }
    return result;
};

export const securedStringify = (obj) => {
    let target;

    // Sequelize Model을 plain 처리
    if (obj instanceof Model) target = {...obj.get({ plain: true })};
    else target = {...obj};

    return JSON.stringify(removeSensitiveValues(target));
}

/**
 * Object에서 undefined 와 null 항목을 제거
 *
 * @param obj
 */
export const prune = (obj: any) => {
    if (!obj) return {};

    const result = {...obj};
    Object.keys(result).forEach((key) => (result[key] === undefined || result[key] === null) && delete result[key]);
    return result;
};

export const str2Date = (str: string, defaultValue = new Date()): Date => {
    let date;
    try {
        date = str ? new Date(str) : defaultValue;
    } catch (err) {
        date = defaultValue;
        logger.err(JSON.stringify(err));
        logger.error(err);
    }

    return date;
}

export const isValidId = (id: number): boolean => {
    return (id !== undefined) && (id !== null) && !isNaN(id);
};

export const parseIntSafe = (data: any): number => {
    if (data === undefined) return data;

    let result = data;
    try {
        result = parseInt(data, 10);
    } catch (e) {
        logger.err(JSON.stringify(e));
        logger.error(e);
    }

    return result;
};

export const assertNotNull = (value, error: Error) => {
    if (value) return;
    if (error instanceof Error) throw error;
}

export const assertTrue = (value: boolean, error: Error) => {
    if (value === true) return;
    if (error instanceof Error) throw error;
}

