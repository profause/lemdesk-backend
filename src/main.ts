import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    cors: true
  });
  app.enableCors(); // protection
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
