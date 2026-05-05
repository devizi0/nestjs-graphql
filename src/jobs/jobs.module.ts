import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPosting } from './entities/job-posting.entity';
import { JobsResolver } from './jobs.resolver';
import { JobsService } from './jobs.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobPosting])],
  providers: [JobsResolver, JobsService],
})
export class JobsModule {}
