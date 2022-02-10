import { Module } from '@nestjs/common';
import { DepartmentService } from './services/department.service';
import { DepartmentController } from './controllers/department.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared/shared.module';
import { Department } from './models/department.entity';
import { DepartmentSubscriber } from './subscribers/department.subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Department,
    ])
  ],
  providers: [
    DepartmentService,
    DepartmentSubscriber
  ],
  controllers: [
    DepartmentController,
  ],
  exports:[
    DepartmentSubscriber,
  ]
})
export class DepartmentModule { }
