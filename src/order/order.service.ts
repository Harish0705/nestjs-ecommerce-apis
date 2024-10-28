import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { ItemDTO } from './dtos/item.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<OrderDocument>,
  ) {}

  async createOrder(
    userId: string,
    itemDTO: ItemDTO,
    subTotalPrice: number,
    totalPrice: number,
  ): Promise<Order> {
    const newOrder = await this.orderModel.create({
      userId,
      items: [{ ...itemDTO, subTotalPrice }],
      totalPrice,
    });
    return newOrder;
  }

  async getOrder(userId: string): Promise<OrderDocument> {
    const order = await this.orderModel.findOne({ userId });
    return order;
  }

  private recalculateOrder(order: OrderDocument) {
    order.totalPrice = 0;
    order.items.forEach((item) => {
      order.totalPrice += item.quantity * item.price;
    });
  }

  async addItemToOrder(userId: string, itemDTO: ItemDTO): Promise<Order> {
    const { productId, quantity, price } = itemDTO;
    const subTotalPrice = quantity * price;

    const order = await this.getOrder(userId);

    if (order) {
      const itemIndex = order.items.findIndex(
        (item) => item.productId == productId,
      );

      if (itemIndex > -1) {
        const item = order.items[itemIndex];
        item.quantity = Number(item.quantity) + Number(quantity);
        item.subTotalPrice = item.quantity * item.price;

        order.items[itemIndex] = item;
        this.recalculateOrder(order);
        return order.save();
      } else {
        order.items.push({ ...itemDTO, subTotalPrice });
        this.recalculateOrder(order);
        return order.save();
      }
    } else {
      const newOrder = await this.createOrder(
        userId,
        itemDTO,
        subTotalPrice,
        price,
      );
      return newOrder;
    }
  }

  async removeItemFromOrder(userId: string, productId: string): Promise<any> {
    const order = await this.getOrder(userId);

    const itemIndex = order.items.findIndex(
      (item) => item.productId == productId,
    );

    if (itemIndex > -1) {
      order.items.splice(itemIndex, 1);
      return order.save();
    }
  }

  async deleteOrder(userId: string): Promise<Order> {
    const deletedOrder = await this.orderModel.findOneAndDelete({ userId });
    return deletedOrder;
  }
}
