import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './schemas/order.schema';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
