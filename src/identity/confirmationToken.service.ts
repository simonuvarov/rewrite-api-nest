import { Injectable } from '@nestjs/common';
import ms from 'ms';
import { RedisService } from 'nestjs-redis';
import { v4 as uuid } from 'uuid';

interface GenerateProps {
  data: any;
}

@Injectable()
export class ConfirmationTokenService {
  private readonly prefix = 'token';

  constructor(private redisService: RedisService) {}

  async generate(props: GenerateProps) {
    const redisClient = this.redisService.getClient();
    const token = uuid();
    const key = `${this.prefix}:${token}`;

    await redisClient.set(key, this.serialize(props.data), 'PX', ms('2h'));

    return token;
  }

  async exists(token: string) {
    const redisClient = this.redisService.getClient();
    const key = `${this.prefix}:${token}`;

    const exists = await redisClient.exists(key);

    return !!exists;
  }

  async get(token: string) {
    const redisClient = this.redisService.getClient();
    const key = `${this.prefix}:${token}`;

    const data = await redisClient.get(key);

    return this.deserialize(data);
  }

  async delete(token: string) {
    const redisClient = this.redisService.getClient();
    const key = `${this.prefix}:${token}`;
    await redisClient.del(key);
  }

  private serialize(data: any): string {
    return JSON.stringify(data);
  }

  private deserialize(s: string): any {
    return JSON.parse(s);
  }
}
