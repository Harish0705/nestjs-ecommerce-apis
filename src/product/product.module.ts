import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './schemas/product.schema';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]), // Setup the mongoose module to use the product schema
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
