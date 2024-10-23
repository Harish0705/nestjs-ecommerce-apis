import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User, UserDocument } from '../user/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload.interface';
import { Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async logIn(
    authCredentialsDto: AuthCredentialsDto,
    res: Response,
  ): Promise<void> {
    const { email, password } = authCredentialsDto;
    if (!email || !password)
      throw new BadRequestException('Please provide the required fields');
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid user credentials');
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      throw new UnauthorizedException('Incorrect password');
    const payload: JwtPayload = { userId: user._id, email };
    const accessToken: string = await this.jwtService.sign(payload);
    const accessTokenExpiryTime = 1000 * 60 * 60 * 1;
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + accessTokenExpiryTime),
      secure: process.env.NODE_ENV === 'production',
      signed: true,
    });
  }

  async logOut(res: Response): Promise<void> {
    res.cookie('accessToken', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }
}
