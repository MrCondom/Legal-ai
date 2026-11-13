import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { AiRateLimitService } from './ai-rate-limit.service';

@Module({
  providers: [
    AiService,
    AiRateLimitService,
  ],

  controllers: [
    AiController,
  ],

  exports: [
    AiService,
  ],
})
export class AiModule {}