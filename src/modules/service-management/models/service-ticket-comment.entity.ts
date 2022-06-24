import { BaseModel } from 'src/modules/shared/models/base-model';
import {
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('lmd_service_ticket_comments')
export class ServiceTicketComment extends BaseModel {
 
  @Column('text', { unique: false,name:'text' })
  public text?: string;

  @Column('varchar', { unique: false, name: 'service_ticket_id' })
  serviceTicketId?: string;

  @Column('varchar', {
    unique: false,
    name: 'type',
    nullable: false,
  })
  public type?: string;

  @DeleteDateColumn({ name: 'soft_delete_date' })
  public softDeleteDate: Date;

  @BeforeInsert()
  beforeInsertListener() {}
}
