import { Controller, Get, Post, Delete } from '@nestjs/common';
import { TemplatesService } from './templates.service';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  getTemplates() {
    return this.templatesService.getTemplates();
  }

  @Post('seed-deed')
  seed() {
    return this.templatesService.seedDeedOfConveyance();
  }

  @Delete()
  deleteTemplates() {
    return this.templatesService.deleteTemplates();
  }
}
