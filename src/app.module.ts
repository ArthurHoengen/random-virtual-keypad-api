import { Module } from '@nestjs/common';
import { PersonModule } from './modules/person/person.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleAsyncOptions } from '../config/modules.config';
import { ConfigModule } from '@nestjs/config';
import { DigitModule } from './modules/tiles/digit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: 'config/.env' }),
    TypeOrmModule.forRootAsync(typeOrmModuleAsyncOptions),
    PersonModule,
    DigitModule,
  ],
})
export class AppModule {}
