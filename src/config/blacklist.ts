import expressJwtBlacklist from 'express-jwt-blacklist';
import redis from 'redis';
import redisConfig from './redis/index';

const client = redis.createClient(redisConfig);

client.on('connect', () => {
    console.log('Connected to Redis');
    expressJwtBlacklist.configure({
        tokenId: 'jti',
        store: {
            type: 'redis',
            client: client,
            keyPrefix: 'jwtBlacklistProd:'
        }
    });
}).on('error', (err) => {
    console.error('Error connecting to Redis', err);
});

export default expressJwtBlacklist;
