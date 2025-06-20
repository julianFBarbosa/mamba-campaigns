import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RouterModule } from '@nestjs/core';
import { V1Module } from './v1/v1.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    // API versioning with path-based approach
    RouterModule.register([
      {
        path: 'api/v1',
        module: V1Module,
      },
    ]),
    V1Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
