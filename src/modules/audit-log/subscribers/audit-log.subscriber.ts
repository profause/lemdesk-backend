import { Inject, Injectable } from "@nestjs/common";
import { EventSubscriber, EntitySubscriberInterface, Connection, InsertEvent } from "typeorm";
import { AuditLog } from "../models/audit-log.entity";
import { AuthService } from "src/modules/user/services/auth.service";

@Injectable()
@EventSubscriber()
export class AuditLogSubscriber implements EntitySubscriberInterface<AuditLog> {
    
    listenTo() {
        return AuditLog;
    }

    constructor(private readonly connection: Connection,public authService: AuthService) {
        connection.subscribers.push(this);
    }

    beforeInsert(event: InsertEvent<AuditLog>): Promise<any> | void {
        //console.log(`BEFORE ENTITY INSERTED: `, event.entity) 
        event.entity.createdBy = this.authService.getUserId();
    }
    
}