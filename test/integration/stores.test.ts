import { describe, it, before, after } from 'mocha';
import chai from 'chai';
import chaiSubset from 'chai-subset';
import chaiLike from 'chai-like';
import chaiThings from 'chai-things';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import cache from 'memory-cache';

import { app } from '../../src/app';
import env from '../../src/env';

import logger from '../../src/lib/logger';
import ApiCodes from '../../src/common/api.codes';
import ApiMessages from '../../src/common/api.messages';
import { Store } from '../../src/models/store.model';

chai.use(chaiSubset);
chai.use(chaiLike);
chai.use(chaiThings);

const expect = chai.expect;

const responseSuccessKeys = ['code', 'message', 'result'];
const responseFailKeys = ['code', 'message', 'detail'];

describe(`/v1/stores API Test`, async() => {
    before(async () => {
        try {
            logger.init({
                console: false,
                debug: true,
                log: true,
                error: true,
                info: true,
                fatal: true,
                sql: true,
                net: true,
            });
            logger.debug(`[ ${env.mode.value} ] =========================================`);
        } catch (e) {
            console.log(e);
        }
    });

    describe(`Stores 조회`, () => {
        it (`파라미터 없이 조회할 경우`, async() => {
            const res = await request(app)
                .get('/v1/stores')
                .set('Accept', 'application/json');

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.message).to.equal(ApiMessages.OK);
            expect(res.body.result).to.be.a('object');
            expect(res.body.result.rows).to.be.a('array');
			expect(res.body.result.rows.length).to.equal(15); // default size 15

			cache.put('store_name', res.body.result.rows[0].name);
			cache.put('store_latitude', res.body.result.rows[0].latitude);
			cache.put('store_longitude', res.body.result.rows[0].longitude);
        });

        it (`page, size를 지정할 경우`, async() => {
            const res = await request(app)
                .get('/v1/stores')
                .set('Accept', 'application/json')
				.query({
					page: 1,
					size: 10
				});

				expect(res.body).to.have.keys(responseSuccessKeys);
				expect(res.body.code).to.equal(ApiCodes.OK);
				expect(res.body.message).to.equal(ApiMessages.OK);
				expect(res.body.result).to.be.a('object');
				expect(res.body.result.rows).to.be.a('array');
				expect(res.body.result.rows.length).to.equal(10); // set size 10
        });

        it (`가맹점 명을 검색하는 경우`, async() => {
			const storeName = cache.get('store_name');

			const res = await request(app)
			.get('/v1/stores')
			.set('Accept', 'application/json')
			.query({
				q: storeName
			});

			expect(res.body).to.have.keys(responseSuccessKeys);
			expect(res.body.code).to.equal(ApiCodes.OK);
			expect(res.body.message).to.equal(ApiMessages.OK);
			expect(res.body.result).to.be.a('object');
			expect(res.body.result.rows).to.be.a('array');
			expect(res.body.result.rows.length).to.equal(1);
			expect(res.body.result.rows[0].name).to.equal(storeName);
        });
    });

	describe(`위치기반 Stores 조회`, () => {
        it (`유효한 위도, 경도가 주어진 경우`, async() => {
			const latitude = cache.get('store_latitude');
			const longitude = cache.get('store_longitude');
            const res = await request(app)
                .get('/v1/stores/nearby')
                .set('Accept', 'application/json')
				.query({
					latitude,
					longitude
				});

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.message).to.equal(ApiMessages.OK);
            expect(res.body.result).to.be.a('object');
            expect(res.body.result.rows).to.be.a('array');
        });

        it (`위도, 경도가 주어지지 않은 경우`, async() => {
            const res = await request(app)
                .get('/v1/stores/nearby')
                .set('Accept', 'application/json');

				expect(res.body).to.have.keys(responseFailKeys);
				expect(res.body.code).to.equal(ApiCodes.BAD_REQUEST);
				expect(res.body.message).to.equal(ApiMessages.BAD_REQUEST);
				expect(res.body.result).to.be.a('object');
        });

    });
});
