import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { DraftsService } from './drafts.service';

@Controller('drafts')
export class DraftsController {
  constructor(private readonly draftsService: DraftsService) {}

  @Post()
  createDraft(
    @Body()
    body: {
      templateId: string;
      userId: string;
      data: Record<string, string>;
    },
  ) {
    return this.draftsService.createDraft(body);
  }

  @Get()
  getDrafts() {
    return this.draftsService.getDrafts();
  }

  @Get(':id')
  getDraft(@Param('id') id: string) {
    return this.draftsService.getDraft(id);
  }
}
