import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Delete,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrderService } from './order.service';
import { ItemDTO } from './dtos/item.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('/')
  async addItemToOrder(@Request() req, @Body() itemDTO: ItemDTO) {
    const userId = req.user.userId;
    const cart = await this.orderService.addItemToOrder(userId, itemDTO);
    return cart;
  }

  @Delete('/')
  async removeItemFromOrder(@Request() req, @Body() { productId }) {
    const userId = req.user.userId;
    const cart = await this.orderService.removeItemFromOrder(userId, productId);
    if (!cart) throw new NotFoundException('Item does not exist');
    return cart;
  }

  @Delete('/:id')
  async deleteOrder(@Param('id') userId: string) {
    const cart = await this.orderService.deleteOrder(userId);
    if (!cart) throw new NotFoundException('Cart does not exist');
    return cart;
  }
}
