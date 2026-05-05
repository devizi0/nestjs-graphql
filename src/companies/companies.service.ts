import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyInput, UpdateCompanyInput } from './dto/company.input';

@Injectable()
export class CompaniesService {
  constructor(@InjectRepository(Company) private companyRepo: Repository<Company>) {}

  findAll() {
    return this.companyRepo.find();
  }

  async findOne(id: string) {
    const company = await this.companyRepo.findOne({ where: { id } });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async create(input: CreateCompanyInput, ownerId: string) {
    const exists = await this.companyRepo.findOne({ where: { name: input.name } });
    if (exists) throw new ConflictException('Company name already exists');

    const company = this.companyRepo.create({ ...input, ownerId });
    return this.companyRepo.save(company);
  }

  async update(id: string, input: UpdateCompanyInput, userId: string) {
    const company = await this.findOne(id);
    if (company.ownerId && company.ownerId !== userId) throw new ForbiddenException('Not your company');

    if (input.name && input.name !== company.name) {
      const exists = await this.companyRepo.findOne({ where: { name: input.name } });
      if (exists) throw new ConflictException('Company name already exists');
    }

    Object.assign(company, input);
    return this.companyRepo.save(company);
  }

  async remove(id: string, userId: string) {
    const company = await this.findOne(id);
    if (company.ownerId && company.ownerId !== userId) throw new ForbiddenException('Not your company');
    await this.companyRepo.remove(company);
    return true;
  }
}
