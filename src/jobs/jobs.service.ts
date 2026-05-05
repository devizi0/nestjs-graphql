import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobPosting } from './entities/job-posting.entity';
import { CreateJobInput, UpdateJobInput } from './dto/job.input';

@Injectable()
export class JobsService {
  constructor(@InjectRepository(JobPosting) private jobRepo: Repository<JobPosting>) {}

  findAll(companyId?: string) {
    if (companyId) return this.jobRepo.find({ where: { companyId, isActive: true } });
    return this.jobRepo.find({ where: { isActive: true } });
  }

  async findOne(id: string) {
    const job = await this.jobRepo.findOne({ where: { id } });
    if (!job) throw new NotFoundException('Job posting not found');
    return job;
  }

  async create(input: CreateJobInput, userId: string) {
    if (input.deadline && new Date(input.deadline) < new Date()) {
      throw new BadRequestException('Deadline must be in the future');
    }

    const job = this.jobRepo.create({
      title: input.title,
      description: input.description,
      location: input.location,
      salary: input.salary,
      employmentType: input.employmentType,
      deadline: input.deadline,
      companyId: input.companyId,
      createdBy: userId,
    });
    const saved = await this.jobRepo.save(job);
    return this.findOne(saved.id);
  }

  async update(id: string, input: UpdateJobInput, userId: string) {
    const job = await this.findOne(id);
    if (job.createdBy && job.createdBy !== userId) throw new ForbiddenException('Not your job posting');

    if (!job.isActive) throw new BadRequestException('Cannot update an inactive job posting');

    if (input.deadline && new Date(input.deadline) < new Date()) {
      throw new BadRequestException('Deadline must be in the future');
    }

    Object.assign(job, input);
    return this.jobRepo.save(job);
  }

  async remove(id: string, userId: string) {
    const job = await this.findOne(id);
    if (job.createdBy && job.createdBy !== userId) throw new ForbiddenException('Not your job posting');
    await this.jobRepo.remove(job);
    return true;
  }
}
