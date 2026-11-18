import { Controller, Get, Post, Delete, Body, Param,} from '@nestjs/common';
import { ResearchService } from './research.service';

@Controller('app-intelligence/research')
export class ResearchController {
  constructor(
    private readonly researchService: ResearchService,
  ) {}

  // ==========================================
  // GENERATE RESEARCH
  // POST /app-intelligence/research
  // ==========================================

  @Post()
  generateResearch(
    @Body()
    body: {
      appId: string;
      researchType:
        | 'GENERAL_ANALYSIS'
        | 'COMPETITOR_COMPARISON'
        | 'IMPROVEMENT_RECOMMENDATIONS';
      additionalInformation?: string;
    },
  ) {
    return this.researchService.generateResearch(body);
  }

  // ==========================================
  // GET ALL REPORTS FOR AN APP
  // GET /app-intelligence/research/app/:appId
  // ==========================================

  @Get('app/:appId')
  getReports(@Param('appId') appId: string) {
    return this.researchService.getReports(appId);
  }

  // ==========================================
  // GET ONE REPORT
  // GET /app-intelligence/research/report/:reportId
  // ==========================================

  @Get('report/:reportId')
  getReport(@Param('reportId') reportId: string) {
    return this.researchService.getReport(reportId);
  }

  // ==========================================
  // DELETE A REPORT
  // DELETE /app-intelligence/research/report/:reportId
  // ==========================================

  @Delete('report/:reportId')
  deleteReport(@Param('reportId') reportId: string) {
    return this.researchService.deleteReport(reportId);
  }
}