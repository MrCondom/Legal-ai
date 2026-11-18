import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';

import { AppIntelligenceController } from './app-intelligence.controller';
import { AppIntelligenceService } from './app-intelligence.service';
import { ResearchService } from './research.service';
import { ResearchController } from './research.controller';

@Module({
  imports: [
    PrismaModule,
    AiModule,
  ],

  controllers: [
    AppIntelligenceController,
    ResearchController,
  ],

  providers: [
    AppIntelligenceService,
    ResearchService,
  ],

  exports: [
    AppIntelligenceService,
    ResearchService,
  ],
})
export class AppIntelligenceModule {}