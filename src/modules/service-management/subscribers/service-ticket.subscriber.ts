import { Injectable } from "@nestjs/common";
import { Connection, EntitySubscriberInterface, EventSubscriber, LoadEvent } from "typeorm";
import { ServiceTicket } from "../models/service-ticket.entity";


@Injectable()
@EventSubscriber()
export class ServiceTicketSubscriber implements EntitySubscriberInterface<ServiceTicket> {
    listenTo() {
        return ServiceTicket;
    }

    constructor(private readonly connection: Connection,) {
        connection.subscribers.push(this);
    }

    afterLoad(group: ServiceTicket, event?: LoadEvent<ServiceTicket>): void | Promise<any> {
      
    }
}