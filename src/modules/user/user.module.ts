import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { User } from './models/user.entity';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config/dist';

@Module({
  controllers: [UsersController],
  imports: [
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: async (configService:ConfigService)=>({
        secret:configService.get('jwt.secret_key'),
        signOptions:{
          expiresIn:'700000s',
        }
      })

    }),
    TypeOrmModule.forFeature([User])
  ],
  providers: [UserService, AuthService],
  exports: [UserService,AuthService]
})
export class UserModule {}
