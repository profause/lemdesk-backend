import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared/shared.module';
import { RolesController } from './controllers/roles.controller';
import { Role } from './models/role.entity';
import { RoleService } from './services/role/role.service';

@Module({
    controllers: [RolesController],
    imports: [
      SharedModule,
      TypeOrmModule.forFeature([Role])
    ],
    providers: [RoleService],
  })
export class RoleModule {}
