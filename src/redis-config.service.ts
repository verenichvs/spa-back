import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisConfigService {
  getRedisConfig() {
    return {
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    };
  }
}
