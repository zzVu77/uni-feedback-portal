import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Kích hoạt middleware để đọc cookie
  app.use(cookieParser());

  // Cấu hình CORS để cho phép trình duyệt gửi cookie
  app.enableCors({
    origin: 'http://localhost:3000', // <-- Thay bằng URL của frontend của bạn
    credentials: true, // <-- Dòng này là BẮT BUỘC
  });

  const config = new DocumentBuilder()
    .setTitle('Uni Portal Feedback API')
    .setDescription('The Uni Portal Feedback API documentation')
    .setVersion('0.1')
    .addBearerAuth()
    .build();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
    },
  });
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
