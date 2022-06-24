import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Observable, from } from 'rxjs';
import { Repository } from 'typeorm';
import { Feedback } from '../models/feedback.entity';

@Injectable()
export class FeedbackService extends TypeOrmQueryService<Feedback> {
    constructor(@InjectRepository(Feedback) public readonly feedbackRepository: Repository<Feedback>,
    ) {
        super(feedbackRepository, { useSoftDelete: true })
    }
    public create(feedback: Feedback): Observable<Feedback> {
        const createdFeedback = this.feedbackRepository.create(feedback);
        return from(this.feedbackRepository.save(createdFeedback));
    }
    public update = (feedback: Feedback) => from(this.feedbackRepository.update(feedback.id, feedback));
    public findAll = (options: IPaginationOptions) => from(paginate<Feedback>(this.feedbackRepository, options, {
        
    }));
    public findOne = (feedbackId: string) => from(this.feedbackRepository.findOne(feedbackId, {
        
    }));

    public findOne1(feedbackId: string) {
        const result = this.feedbackRepository.createQueryBuilder('feedback')
            .where({ id: feedbackId })
            .getOne()

        return from(result)
    }

    public delete = (feedbackId: string) => from(this.feedbackRepository.delete(feedbackId));


}