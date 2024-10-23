import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // setting CORS for specific origin
  /* const corsOptions = {
    origin: 'http://test-taskmanagement.com',
    optionsSuccessStatus: 200,
  }; */
  app.use(helmet());
  // app.enableCors(corsOptions);
  app.use(cookieParser(process.env.JWT_SECRET));
  await app.listen(5000);
}
bootstrap();
