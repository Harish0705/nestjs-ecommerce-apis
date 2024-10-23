import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { email, password, role } = authCredentialsDto;
    if (!email || !password)
      throw new BadRequestException('Please provide the required fields');
    // check if the email adready exists
    const isEmailAlreadyUsed = await this.userModel.findOne({ email });
    if (isEmailAlreadyUsed) {
      throw new BadRequestException(
        'Email already in use. Please provide another email',
      );
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await this.userModel.create({
      email,
      password: hashedPassword,
      role,
    });

    try {
      await user.save();
    } catch (error) {
      const errorMessage = error.message;
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async findUser(userId: string): Promise<User | undefined> {
    const user = await this.userModel
      .findOne({ _id: userId })
      .select('-password');
    return user;
  }
}
