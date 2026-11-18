import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';

import { AppIntelligenceController } from './app-intelligence.controller';
import { AppIntelligenceService } from './app-intelligence.service';

@Module({
  imports: [PrismaModule],
  controllers: [AppIntelligenceController],
  providers: [AppIntelligenceService],
  exports: [AppIntelligenceService],
})
export class AppIntelligenceModule {}
