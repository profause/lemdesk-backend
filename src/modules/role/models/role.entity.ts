import { BaseModel } from "src/modules/shared/models/base-model";
import { BeforeInsert, Column, DeleteDateColumn, Entity } from "typeorm";

@Entity('lmd_user_roles')
export class Role extends BaseModel{
    @Column({ unique: true })
    public title?: string;

    @Column('text',{ unique: false })
    public description?: string;

    @DeleteDateColumn({name:'soft_delete_date'})
    public softDeleteDate: Date;

    @BeforeInsert()
    beforeInsertListener() {
     this.title = this.title.toUpperCase();
    }
}