import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRepository } from '@auth/repository/auth.repository';
import { RegisterDTO } from '@auth/dto/register.dto';
import { Auth } from '@auth/entity/auth.entity';
import * as bcrypt from 'bcrypt';
import { Producer } from '@auth/shared/queue/producer.service';
import { Channel } from 'amqplib';
import { ConfigService } from '@nestjs/config';
import { SignInDTO } from '@auth/dto/sigin.dto';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '@auth/config/payload/jwt.payload';
import { ForgotPasswordDTO } from '@auth/dto/forgot-password.dto';
import { ResetPasswordDTO } from '@auth/dto/reset-password.dto';
import { ChangedPasswordDTO } from '@auth/dto/changed-password.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(AuthRepository) private authRepository: AuthRepository,
    private producer: Producer,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async findUserByEmail(email: string): Promise<Auth> {
    const user = await this.authRepository.findOneBy({ email });

    return user;
  }

  async register(registerDto: RegisterDTO): Promise<string> {
    const user = await this.findUserByEmail(registerDto.email);

    if (user) throw new RpcException('User already exists');

    const salt = bcrypt.genSaltSync(12, 'a');

    const createdUser = this.authRepository.create({
      full_name: registerDto.full_name,
      email: registerDto.email,
      password: bcrypt.hashSync(registerDto.password, salt),
      phone_number: registerDto.phone_number,
      role: registerDto.role,
    });

    await this.authRepository.save(createdUser);

    const messageDetail = {
      full_name: createdUser.full_name,
      email: createdUser.email,
      phone_number: createdUser.phone_number,
      created_at: createdUser.created_at,
      updated_at: createdUser.updated_at,
      role: createdUser.role,
      type: 'auth',
    };

    const channel: Channel = await this.producer.connect();

    await this.producer.publishExchangeMessage(
      channel,
      'created-user',
      'user',
      JSON.stringify(messageDetail),
      'direct',
    );

    return 'User created successfully';
  }

  async login(sigInDto: SignInDTO): Promise<any> {
    const user = await this.findUserByEmail(sigInDto.email);

    if (!user) throw new RpcException('Email does not exists');

    const isMatch = await bcrypt.compare(sigInDto.password, user.password);

    if (!isMatch) throw new RpcException('Password is incorrect');

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES'),
    });

    return { user, token };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDTO): Promise<string> {
    const user = await this.findUserByEmail(forgotPasswordDto.email);

    if (!user) throw new RpcException('Email does not exists');

    const tokenEmail = this.jwtService.sign(
      { email: user.email },
      {
        secret: this.configService.get<string>('SECRET_EMAIL'),
        expiresIn: '15m',
      },
    );
    const urlClient = this.configService.get<string>('CLIENT_URL');
    const url = `${urlClient}/reset-password/${tokenEmail}`;

    const messageDetail = {
      template: 'forgotPassword/html',
      url,
      email: forgotPasswordDto.email,
      appLink: urlClient,
      appIcon: '',
      type: 'notification',
    };

    const channel = await this.producer.connect();
    await this.producer.publishExchangeMessage(
      channel,
      'forgot-password',
      'notification',
      JSON.stringify(messageDetail),
      'direct',
    );

    return 'Password reset link sent to your email. Please check your email box';
  }

  async resetPassword(
    token: string,
    resetPasswordDto: ResetPasswordDTO,
  ): Promise<string> {
    if (!token)
      throw new RpcException('This email is not verify or does not exists');

    const { email } = this.jwtService.verify(token, {
      secret: this.configService.get<string>('SECRET_EMAIL'),
    });

    if (!email) throw new RpcException('Invalid token');

    const user = await this.findUserByEmail(email);

    if (resetPasswordDto.password !== resetPasswordDto.confirm_password) {
      throw new RpcException('Password does not match');
    }

    const salt = await bcrypt.genSalt(12);
    const newPassword = await bcrypt.hash(resetPasswordDto.password, salt);

    user.password = newPassword;

    await this.authRepository.save(user);

    return 'Password has been reset';
  }

  async changedPassword(
    currentUser: any,
    changedPasswordDto: ChangedPasswordDTO,
  ): Promise<string> {
    const user = await this.authRepository.findOne({
      where: { email: currentUser.email },
    });

    if (!user) throw new RpcException('User not found');

    const isMatch = await bcrypt.compare(
      changedPasswordDto.current_password,
      user.password,
    );

    if (!isMatch) throw new RpcException('Current password is incorrect');

    const isDuplicate = await bcrypt.compare(
      changedPasswordDto.new_password,
      user.password,
    );

    if (isDuplicate)
      throw new RpcException('New password same old password, try another');

    if (changedPasswordDto.new_password !== changedPasswordDto.confirm_password)
      throw new RpcException('Password not match');

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(changedPasswordDto.new_password, salt);

    await this.authRepository.save(user);

    return 'Password has been changed';
  }
}
