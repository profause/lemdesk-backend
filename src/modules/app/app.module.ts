import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/models/user.entity';
import { Role } from '../role/models/role.entity';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { SharedModule } from '../shared/shared.module';
import { DepartmentModule } from '../department/department.module';
import { Department } from '../department/models/department.entity';
import { ServiceTicket } from '../service-management/models/service-ticket.entity';
import { ServiceManagementModule } from '../service-management/service-management.module';
import { ServiceTicketComment } from '../service-management/models/service-ticket-comment.entity';
import { Feedback } from '../feedback/models/feedback.entity';
import { FeedbackModule } from '../feedback/feedback.module';

@Module({
  imports: [
    UserModule,
    RoleModule,
    SharedModule,
    DepartmentModule,
    ServiceManagementModule,
    FeedbackModule,
    ConfigModule.forRoot({
      envFilePath: ['src/configFiles/.dev.env', 'src/configFiles/.prod.env'],
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      url: process.env.DATABASE_URL,
      entities: [
        User,
        Department,
        ServiceTicket,
        ServiceTicketComment,
        Role,
        Feedback
      ],
      synchronize: false,
      //subscribers: [DepartmentSubscriber],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports:[]
})
export class AppModule {}
