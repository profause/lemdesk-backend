
import { BaseModel } from "src/modules/shared/models/base-model";
import { Column, Entity } from "typeorm";

@Entity('lmd_permissions')
export class Permission extends BaseModel{

    @Column({unique:true})
    public name?: string;

    @Column('text', {
        name: 'description',
        nullable:true
    })
    public description: string;

    @Column({nullable:true})
    public controller:string

    @Column({nullable:true})
    public action:string
}
