import { BaseModel } from 'src/modules/shared/models/base-model';
import {
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('lmd_service_tickets')
export class ServiceTicket extends BaseModel {
  @Column({ unique: true })
  public title?: string;

  @Column('text', { unique: false })
  public description?: string;

  @Column('text', { unique: false, name: 'rich_text_description' })
  richTextDescription?: string;

  @Column('varchar', { unique: false })
  public initiator?: string;

  @Column('varchar', { unique: false, name: 'initiator_id' })
  public initiatorId?: string;

  @Column('varchar', { unique: false, name: 'assigned_to_id', nullable: true })
  public assignedToId?: string;

  @Column('varchar', { unique: false, name: 'assigned_to_department' })
  public assignedToDepartment?: string;

  @Column('varchar', { unique: true, name: 'tracking_id' })
  public trackingId?: string;

  @Column('varchar', {
    unique: false,
    name: 'assigned_to_resolver',
    nullable: true,
  })
  public assignedToResolver?: string;

  @Column('varchar', {
    unique: false,
    name: 'status',
    default: 'OPEN',
    nullable: true,
  })
  public status?: string;

  @Column('varchar', {
    unique: false,
    name: 'date',
    nullable: false,
  })
  public date?: string;

  @Column('varchar', {
    unique: false,
    name: 'category',
    nullable: false,
  })
  public category?: string;

  @Column('varchar', {
    unique: false,
    name: 'impact',
    nullable: false,
    default: 'ONLY_ME',
  })
  public impact?: string;

  @Column('varchar', {
    unique: false,
    name: 'urgency',
    nullable: false,
  })
  public urgency?: string;

  @Column('varchar', {
    unique: false,
    name: 'type',
    nullable: false,
  })
  public type?: string;

  @Column('varchar', {
    unique: false,
    name: 'attachments',
    nullable: false,
  })
  public attachments?: string;

  @DeleteDateColumn({ name: 'soft_delete_date' })
  public softDeleteDate: Date;

  @BeforeInsert()
  beforeInsertListener() {
    this.trackingId = Math.random().toString(36).substr(2, 9);
  }

}
