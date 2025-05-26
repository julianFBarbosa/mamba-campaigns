import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { softDelete } from './prisma.extensions';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
    this.$extends(softDelete);
    console.log('onModuleInit');
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.warn('Database Disconnected');
    } catch (err) {
      Logger.error('PrismaService', err.stack, 'hooks');
    }
  }
}
