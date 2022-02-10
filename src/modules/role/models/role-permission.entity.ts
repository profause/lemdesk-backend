import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('lmd_role_permissions')
export class RolePermission {

    @PrimaryGeneratedColumn("uuid")
    public id?: string;

    @PrimaryColumn('varchar',{
        name:'role_id',
        length:255,
    })
    public roleId:string;

    @PrimaryColumn('varchar',{
        name:'permission_id',
        length:255,
    })
    public permissionId:string;
}
