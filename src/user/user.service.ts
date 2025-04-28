import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/types/user';
import { RegisterDTO } from './register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from 'src/auth/login.dto';
import { Payload } from 'src/types/payload';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(RegisterDTO: RegisterDTO) {
    const { email, name, password } = RegisterDTO;
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
    }

    //const createdUser = new this.userModel(RegisterDTO);
    //await createdUser.save();

    const createdUser = new this.userModel({
      email: email,
      name: name,
      password: password,
      attempt: 0,
      isDeleted: false,
      updatedAt: new Date().getTime(),
      createdAt: new Date().getTime(),
    });

    await createdUser.save();
    return this.sanitizeUser(createdUser);
  }

  async findByPayload(payload: Payload) {
    const { email } = payload;
    return await this.userModel.findOne({ email });
  }

  async findByLogin(UserDTO: LoginDTO) {
    const { email, password } = UserDTO;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
    }
    if (await bcrypt.compare(password, user.password)) {
      return this.sanitizeUser(user);
    } else {
      // check if user is locked
      if (user.isDeleted) {
        throw new HttpException(
          'accound has been locked',
          HttpStatus.BAD_REQUEST,
        );
      }

      var now = new Date(Date.now() + 5 * 60 * 1000).getTime();
      if (user.attempt == 3 && user.updatedAt <= now) {
        console.log(
          `check with 3 attempts are being made within 5 minutes and lock user`,
        );
        // lock user
        await this.userModel.findByIdAndUpdate(user.id, {
          isDeleted: true,
          updatedAt: new Date().getTime(),
        });

        throw new HttpException(
          'has reached maximum of 3 attempts within 5 minutes',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (user.id != null) {
        console.log(
          `user ${user.id} has ${user.attempt} attempt with wrong password`,
        );
        await this.userModel.findByIdAndUpdate(user.id, {
          attempt: user.attempt + 1,
          updatedAt: new Date().getTime(),
        });
      }

      throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
    }
  }

  sanitizeUser(user: User) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    return sanitized;
  }
}
