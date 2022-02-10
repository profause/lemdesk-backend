import { Module } from '@nestjs/common';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { AuthTokenGuard } from './guards/auth-token.guard';
import { RoleGuard } from './guards/role.guard';
import { SharedService } from './services/shared.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    controllers: [],
    imports: [
      UserModule,
    ],
    providers: [SharedService,JwtStrategy, AuthTokenGuard, RoleGuard],
    exports: [SharedService,
      JwtStrategy,
      AuthTokenGuard,
      RoleGuard,
      UserModule,
    ]
  })
export class SharedModule {}
