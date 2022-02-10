import { Injectable } from "@nestjs/common";
import { Connection, EntitySubscriberInterface, EventSubscriber, LoadEvent } from "typeorm";
import { Department } from "../models/department.entity";

@Injectable()
@EventSubscriber()
export class DepartmentSubscriber implements EntitySubscriberInterface<Department> {
    listenTo() {
        return Department;
    }

    constructor(private readonly connection: Connection,) {
        connection.subscribers.push(this);
    }

    afterLoad(department: Department, event?: LoadEvent<Department>): void | Promise<any> {
    }
}