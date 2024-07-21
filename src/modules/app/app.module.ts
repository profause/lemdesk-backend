import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from '../department/models/department.entity';
import { Feedback } from '../feedback/models/feedback.entity';
import { Role } from '../role/models/role.entity';
import { ServiceTicketComment } from '../service-management/models/service-ticket-comment.entity';
import { ServiceTicket } from '../service-management/models/service-ticket.entity';
import { User } from '../user/models/user.entity';
import { DepartmentModule } from '../department/department.module';
import { FeedbackModule } from '../feedback/feedback.module';
import { RoleModule } from '../role/role.module';
import { ServiceManagementModule } from '../service-management/service-management.module';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { AuditLogInterceptor } from '../audit-log/interceptors/audit-log.interceptor';
import { AuditLog } from '../audit-log/models/audit-log.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';

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
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      //url: process.env.DATABASE_URL,
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        User,
        Department,
        ServiceTicket,
        ServiceTicketComment,
        Role,
        Feedback,
        AuditLog
      ],
      logging: true,
      //synchronize: true,
      //subscribers: [DepartmentSubscriber],
    }),
    AuditLogModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: AuditLogInterceptor,
    // },
  ],
})
export class AppModule {}
