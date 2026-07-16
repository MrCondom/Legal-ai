import { Controller, Get, Query, Param, Post } from '@nestjs/common';

import { ClausesService } from './clauses.service';

@Controller('clauses')
export class ClausesController {
  constructor(private readonly clauses: ClausesService) {}

  ////////////////////////////////////////////////////

  @Get()
  async all() {
    return this.clauses.getAllClauses();
  }

  ////////////////////////////////////////////////////

  @Get('search')
  async search(
    @Query('q')
    q: string,
  ) {
    return this.clauses.searchClauses(q);
  }

  ////////////////////////////////////////////////////

  @Get('family/:family')
  async family(
    @Param('family')
    family: string,
  ) {
    return this.clauses.getByFamily(family);
  }

  ////////////////////////////////////////////////////

  @Get('document/:document')
  async document(
    @Param('document')
    document: string,
  ) {
    return this.clauses.getByDocument(document);
  }

  ////////////////////////////////////////////////////

  @Get('document/:document/basic')
  async basic(
    @Param('document')
    document: string,
  ) {
    return this.clauses.getBasicClauses(document);
  }

  ////////////////////////////////////////////////////

  @Get('document/:document/premium')
  async premium(
    @Param('document')
    document: string,
  ) {
    return this.clauses.getPremiumClauses(document);
  }

  ////////////////////////////////////////////////////

  @Get('suggest')
  async suggest(
    @Query('family')
    family: string,

    @Query('document')
    document: string,
  ) {
    return this.clauses.suggestClauses(
      family,

      document,
    );
  }

  ////////////////////////////////////////////////////

  @Post('seed')
  async seed() {
    return this.clauses.seedClauses();
  }
}
