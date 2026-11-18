import { Controller, Get, Post, Put, Delete, Body, Param,} from '@nestjs/common';

import { AppIntelligenceService } from './app-intelligence.service';

@Controller('app-intelligence/apps')
export class AppIntelligenceController {
  constructor(
    private readonly appIntelligenceService: AppIntelligenceService,
  ) {}

  @Post()
  create(@Body() body: {
    name: string;
    packageName: string;
    playStoreUrl: string;
    category?: string;
    description?: string;
    targetAudience?: string;
  }) {
    return this.appIntelligenceService.create(body);
  }

  @Get()
  findAll() {
    return this.appIntelligenceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appIntelligenceService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: {
      name?: string;
      packageName?: string;
      playStoreUrl?: string;
      category?: string;
      description?: string;
      targetAudience?: string;
    },
  ) {
    return this.appIntelligenceService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appIntelligenceService.remove(id);
  }
}
