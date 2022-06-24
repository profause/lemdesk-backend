import { Injectable } from "@nestjs/common";
import { Connection, EntitySubscriberInterface, EventSubscriber, LoadEvent } from "typeorm";
import { Feedback } from "../models/feedback.entity";

@Injectable()
@EventSubscriber()
export class FeedbackSubscriber implements EntitySubscriberInterface<Feedback> {
    listenTo() {
        return Feedback;
    }

    constructor(private readonly connection: Connection,) {
        connection.subscribers.push(this);
    }

    afterLoad(feedback: Feedback, event?: LoadEvent<Feedback>): void | Promise<any> {
    }
}