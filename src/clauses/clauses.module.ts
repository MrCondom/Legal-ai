import { Module } from '@nestjs/common';

import { ClausesController } from './clauses.controller';

import { ClausesService } from './clauses.service';

import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],

  controllers: [ClausesController],

  providers: [ClausesService],

  exports: [ClausesService],
})
export class ClausesModule {}
