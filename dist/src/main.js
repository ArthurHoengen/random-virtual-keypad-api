"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const package_json_1 = require("../package.json");
const cors = require("cors");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('/api');
    app.use(cors());
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Teclado Virtual BackEnd')
        .setDescription('Teclado Virtual API')
        .setVersion(package_json_1.version)
        .addBearerAuth()
        .addSecurityRequirements('bearer')
        .setExternalDoc('/api-json', '/api-json')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config, {
        extraModels: [],
    });
    const CustomOptions = {
        customfavIcon: 'https://nestjs.com/img/logo-small.svg',
        customSiteTitle: 'Teclado Virtual',
    };
    swagger_1.SwaggerModule.setup('api', app, document, CustomOptions);
    await app.listen(8080);
}
bootstrap();
