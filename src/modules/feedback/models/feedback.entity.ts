import { BaseModel } from 'src/modules/shared/models/base-model';
import {
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('lmd_service_feedbacks')
export class Feedback extends BaseModel {
  @Column('text', { unique: false, name: 'comment' })
  public comment?: string;

  @Column('varchar', { unique: false, name: 'resolver_id' })
  public resolverId?: string;

  @Column('varchar', { unique: false, name: 'service_ticket_id' })
  public serviceTicketId?: string;

  @Column('varchar', { unique: false, name: 'initiator_id' })
  public initiatorId?: string;

  @Column('int', { unique: false, name: 'response_time' })
  public responseTime?: string;

  @Column('int', { unique: false, name: 'satisfaction' })
  public satisfaction?: string;

  @DeleteDateColumn({ name: 'soft_delete_date' })
  public softDeleteDate: Date;

  @BeforeInsert()
  beforeInsertListener() {}
}
