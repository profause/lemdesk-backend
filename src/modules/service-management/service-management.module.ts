import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared/shared.module';
import { User } from '../user/models/user.entity';
import { UserService } from '../user/services/user.service';
import { ServiceTicketController } from './controllers/service-ticket.controller';
import { ServiceTicketComment } from './models/service-ticket-comment.entity';
import { ServiceTicket } from './models/service-ticket.entity';
import { TicketService } from './services/service-ticket.service';
import { ServiceTicketSubscriber } from './subscribers/service-ticket.subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceTicket,
      ServiceTicketComment,
      User
    ])
  ],
  providers: [
    TicketService,
    ServiceTicketSubscriber,
  ],
  controllers: [
    ServiceTicketController,
  ],
  exports:[
    ServiceTicketSubscriber,]
})
export class ServiceManagementModule { }
