import { BaseModel } from "src/modules/shared/models/base-model";
import { BeforeInsert, Column, DeleteDateColumn, Entity, JoinColumn, OneToMany } from "typeorm";


@Entity('lmd_service_tickets')
export class ServiceTicket extends BaseModel {
    @Column({ unique: true })
    public name?: string;

    @Column('text', { unique: false })
    public description?: string;

    @Column('text', { unique: false })
    public about?: string;

    @Column('text', { unique: false, name: 'terms_and_conditions' })
    public termsAndConditions?: string;

    @Column('varchar', {
        unique: false,
        name: 'parent_group_id',
        default: 'PARENT',
        nullable: true,
    })
    public parentGroupId?: string;

    @Column('varchar', {
        unique: false,
        name: 'category',
        nullable: false,
    })
    public category?: string;

    @Column('varchar', {
        unique: false,
        name: 'access_scope',
        nullable: false,
        default: 'PUBLIC',
    })
    public accessScope?: string;

    @DeleteDateColumn({ name: 'soft_delete_date' })
    public softDeleteDate: Date;

    @BeforeInsert()
    beforeInsertListener() {
    }
}