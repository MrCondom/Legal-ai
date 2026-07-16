import { Module } from '@nestjs/common';

import { AssistantService } from './assistant.service';

import { AssistantController } from './assistant.controller';

import { AiModule } from '../ai/ai.module';

import { TemplatesModule } from '../templates/templates.module';

import { ClausesModule } from '../clauses/clauses.module';

import { BillingModule } from '../billing/billing.module';

import { UsersModule } from '../users/users.module';

import { DraftsModule } from '../drafts/drafts.module';

@Module({
  imports: [
    AiModule,

    TemplatesModule,

    ClausesModule,

    BillingModule,

    UsersModule,

    DraftsModule,
  ],

  providers: [AssistantService],

  controllers: [AssistantController],
})
export class AssistantModule {}
