import { BaseModel } from "src/modules/shared/models/base-model";
import { BeforeInsert, Column, DeleteDateColumn, Entity, JoinColumn, OneToMany } from "typeorm";

@Entity('lmd_departments')
export class Department extends BaseModel {
    @Column({ unique: true })
    public name?: string;

    @Column('text', { unique: false })
    public description?: string;

    @Column('text', { unique: false, name: 'operations' })
    public operations?: string;

    @DeleteDateColumn({ name: 'soft_delete_date' })
    public softDeleteDate: Date;

    @BeforeInsert()
    beforeInsertListener() {
    }
}