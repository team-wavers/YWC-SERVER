import { createClient } from 'redis';
import env from '../../../env';
export default class RankService {
    getRank = async (rankOffset: number) => {
        const client = createClient({
            socket: { port: env.redis.port, host: env.redis.host },
            password: env.redis.password,
        });
        await client.connect();
        const rankList = await client.zRangeWithScores('rank', 0, rankOffset);
        await client.disconnect();
        return rankList;
    };
    setRank = async (storeName: string) => {
        const client = createClient({
            socket: { port: env.redis.port, host: env.redis.host },
            password: env.redis.password,
        });
        await client.connect();
        const storeScore = await client.zScore('rank', storeName);
        await client.zAdd('rank', {
            score: storeScore + 1,
            value: storeName,
        });
        await client.disconnect();
    };
}
