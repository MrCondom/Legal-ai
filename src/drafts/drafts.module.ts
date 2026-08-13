import { Module } from '@nestjs/common';
import { DraftsController } from './drafts.controller';
import { DraftsService } from './drafts.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TemplatesModule } from '../templates/templates.module';

@Module({
  imports: [PrismaModule, TemplatesModule],
  controllers: [DraftsController],
  providers: [DraftsService],
  exports: [DraftsService],
})
export class DraftsModule {}
