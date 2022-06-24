import { Module } from '@nestjs/common';
import { FeedbackService } from './services/feedback.service';
import { FeedbackController } from './controllers/feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared/shared.module';
import { Feedback } from './models/feedback.entity';
import { FeedbackSubscriber } from './subscribers/feedback.subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Feedback,
    ])
  ],
  providers: [
    FeedbackService,
    FeedbackSubscriber
  ],
  controllers: [
    FeedbackController,
  ],
  exports:[
    FeedbackSubscriber,
  ]
})
export class FeedbackModule { }
