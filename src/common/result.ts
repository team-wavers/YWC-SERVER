import ApiCode from "./api.codes";
import ApiMessages from "./api.messages";
import env from '../env';
import context from 'express-http-context';
import ApiHeaders from './api.headers';

export class Result<T> {
    public isSuccess: boolean;
    public error: any;
    private readonly _value: T;

    private constructor (isSuccess: boolean, error?: string, value?: T) {
        if (isSuccess && error) {
            throw new Error(`InvalidOperation: A result cannot be successful and contain an error`);
        }
        if (!isSuccess && !error) {
            throw new Error(`InvalidOperation: A failing result needs to contain an error message`);
        }

        this.isSuccess = isSuccess;
        this.error = error;
        this._value = value;

        Object.freeze(this);
    }

    public getValue () : T {
        return this._value;
    }

    get json(): any {
        const error = this.error;
        const errResponse = context.get(ApiHeaders.DEBUG_RESPONSE_ERROR_LEVEL);
        const showDetail = errResponse ? errResponse?.includes('verbose') : !env.mode.prod;

        if (showDetail && this.error && !this.isSuccess) {
            const detail = error?.detail;
            this.error.detail = { ...detail, ...{
                    location: error?.__file__ && `${error?.__file__}:${error?.__line__} (${error?.__function__})`,
                    trace: error?.stack,
                    version: error?.version,
                    build: error?.build,
                    hostname: error?.hostname,
                    tid: error?.tid
                }}
        }

        return this.isSuccess ? {
            code: ApiCode.OK,
            message: ApiMessages.OK,
            result: this._value
        } : {
            code: this.error?.code || ApiCode.INTERNAL_SERVER_ERROR,
            message: error?.message,
            detail: showDetail? error?.detail : undefined,
        };
    }

    public toJson(): any {
        return this.json;
    }

    public static ok<U> (value?: U) : Result<U> {
        return new Result<U>(true, null, value);
    }

    public static fail<U> (error: any): Result<U> {
        return new Result<U>(false, error);
    }

    public static combine (results: Result<any>[]) : Result<any> {
        for (const result of results) {
            if (!result.isSuccess) return result;
        }
        return Result.ok<any>();
    }
}
