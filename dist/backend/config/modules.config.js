"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmModuleAsyncOptions = void 0;
const config_1 = require("@nestjs/config");
exports.typeOrmModuleAsyncOptions = {
    imports: [config_1.ConfigModule],
    inject: [config_1.ConfigService],
    useFactory: async (configService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: false,
    }),
};
