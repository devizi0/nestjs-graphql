import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { CompaniesService } from './companies.service';
import { CreateCompanyInput, UpdateCompanyInput } from './dto/company.input';
import { Company } from './entities/company.entity';

@Resolver(() => Company)
export class CompaniesResolver {
  constructor(private companiesService: CompaniesService) {}

  @Query(() => [Company])
  companies() {
    return this.companiesService.findAll();
  }

  @Query(() => Company)
  company(@Args('id', { type: () => ID }) id: string) {
    return this.companiesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Company)
  createCompany(@CurrentUser() user: User, @Args('input') input: CreateCompanyInput) {
    return this.companiesService.create(input, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Company)
  updateCompany(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateCompanyInput,
  ) {
    return this.companiesService.update(id, input, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  removeCompany(@CurrentUser() user: User, @Args('id', { type: () => ID }) id: string) {
    return this.companiesService.remove(id, user.id);
  }
}
