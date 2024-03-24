import env from '../../../env';
import { createClient } from 'redis';

export default class RankService {
    getRank = async (rankOffset: number) => {
        const client = createClient({
            url: `redis://${env.redis.username}:${env.redis.password}@${env.redis.host}:${env.redis.port}/0`,
        });
        await client.connect();
        const rankList = await client.zRangeWithScores('rank', 0, rankOffset, {
            REV: true,
        });
        return rankList;
    };
    setRank = async (storeName: string) => {
        const client = createClient({
            url: `redis://${env.redis.username}:${env.redis.password}@${env.redis.host}:${env.redis.port}/0`,
        });
        await client.connect();
        const storeScore = await client.zScore('rank', storeName);
        await client.zAdd('rank', {
            score: storeScore + 1,
            value: storeName,
        });
    };
}
