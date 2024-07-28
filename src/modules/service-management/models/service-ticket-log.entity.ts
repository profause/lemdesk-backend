import { BaseModel } from "src/modules/shared/models/base-model";
import { Column, Entity } from "typeorm";

@Entity('lmd_service_ticket_logs')
export class ServiceTicket extends BaseModel {
  @Column('text', { unique: false })
  public description?: string;

  @Column('varchar', { unique: false, name: 'user_id' })
  public userId?: string;

  @Column('varchar', { unique: false, name: 'service_ticket_id' })
  public serviceTicketId?: string;
}