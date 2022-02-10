import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared/shared.module';
import { ServiceTicketController } from './controllers/service-ticket.controller';
import { ServiceTicket } from './models/service-ticket.entity';
import { TicketService } from './services/service-ticket.service';
import { ServiceTicketSubscriber } from './subscribers/service-ticket.subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceTicket
    ])
  ],
  providers: [
    TicketService,
    ServiceTicketSubscriber
  ],
  controllers: [
    ServiceTicketController,
  ],
  exports:[
    ServiceTicketSubscriber,]
})
export class TicketModule { }
