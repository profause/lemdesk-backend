import { BaseModel } from 'src/modules/shared/models/base-model';
import {
  Column,
  Entity,
} from 'typeorm';

@Entity('lmd_audit_logs')
export class AuditLog extends BaseModel {
  @Column('text', {
    name: 'audit_log',
    nullable: true,
  })
  public auditLog?: string;

  @Column('varchar', {
    name: 'ip_address',
    length: '255',
    nullable: true,
  })
  public ipAddress?: string;

  @Column('text', {
    name: 'attributes',
    nullable: true,
  })
  public attributes?: any;
}
