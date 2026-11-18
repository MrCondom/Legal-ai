import { Module } from '@nestjs/common';

import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { JaxChatController } from './jaxchat.controller';
import { AiRateLimitService } from './ai-rate-limit.service';

import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
  ],

  providers: [
    AiService,
    AiRateLimitService,
  ],

  controllers: [
    AiController,
    JaxChatController,
  ],

  exports: [
    AiService,
    AiRateLimitService,
  ],
})
export class AiModule {}