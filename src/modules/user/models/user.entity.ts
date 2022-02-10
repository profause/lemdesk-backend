import { BaseModel } from "src/modules/shared/models/base-model";
import { BeforeInsert, Column, DeleteDateColumn, Entity } from "typeorm";
const bcrypt = require('bcrypt');

@Entity('lmd_users')
export class User extends BaseModel{
    @Column({ unique: true })
    public username?: string;

    @Column('varchar',{
        nullable: true
    })
    public fullname?: string;

    @Column('varchar',{
        nullable: true
    })
    public departmentId?: string;

    @Column({ unique: true,nullable: true})
    public email?: string;

    @Column('varchar', {
        name: 'password',
        length: '255',
        nullable: true
    })
    public password: string;

    @DeleteDateColumn({name:'soft_delete_date'})
    public softDeleteDate: Date;

    @Column('varchar', {
        name: 'mobile_number',
        nullable:true
    })
    public mobileNumber: string;

    @Column('boolean', {
        name: 'is_2factor_enabled',
        default: false
    })
    public is2FactorEnable: boolean

    @Column('varchar', {
        name: 'role',
        length: '255',
        nullable: true
    })
    public role: string;

    @Column('text', {
        name: 'profile_image',
        nullable: true
    })
    public profileImage: string;

    public department?: string;

    @BeforeInsert()
    beforeInsertListener(){
        //this.email = this.email.toLowerCase();
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(this.password, salt);
        this.password = hash;
    }
}
