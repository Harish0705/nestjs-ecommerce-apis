import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Item } from './item.schema';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  userId: string;

  @Prop()
  items: Item[];

  @Prop()
  totalPrice: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
