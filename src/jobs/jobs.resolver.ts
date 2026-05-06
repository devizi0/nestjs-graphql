import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { CreateJobInput, UpdateJobInput } from './dto/job.input';
import { JobPosting } from './entities/job-posting.entity';
import { JobsService } from './jobs.service';

@Resolver(() => JobPosting)
export class JobsResolver {
  constructor(private jobsService: JobsService) {}

  @Query(() => [JobPosting])
  jobs(@Args('companyId', { type: () => ID, nullable: true }) companyId?: string) {
    return this.jobsService.findAll(companyId);
  }

  @Query(() => JobPosting)
  job(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.jobsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => JobPosting)
  createJob(@CurrentUser() user: User, @Args('input') input: CreateJobInput) {
    return this.jobsService.create(input, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => JobPosting)
  updateJob(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @Args('input') input: UpdateJobInput,
  ) {
    return this.jobsService.update(id, input, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  removeJob(@CurrentUser() user: User, @Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.jobsService.remove(id, user.id);
  }
}
