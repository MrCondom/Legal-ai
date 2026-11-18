import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

type ResearchType =
  | 'GENERAL_ANALYSIS'
  | 'COMPETITOR_COMPARISON'
  | 'IMPROVEMENT_RECOMMENDATIONS';

@Injectable()
export class ResearchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
  ) {}

  // ==========================================
  // GENERATE RESEARCH REPORT
  // ==========================================

  async generateResearch(data: {
    appId: string;
    researchType: ResearchType;
    additionalInformation?: string;
  }) {
    const app = await this.prisma.managedApp.findUnique({
      where: { id: data.appId },
    });

    if (!app) {
      throw new NotFoundException('Registered app not found.');
    }

    const validTypes: ResearchType[] = [
      'GENERAL_ANALYSIS',
      'COMPETITOR_COMPARISON',
      'IMPROVEMENT_RECOMMENDATIONS',
    ];

    if (!validTypes.includes(data.researchType)) {
      throw new BadRequestException('Invalid research type.');
    }

    const additionalInformation =
      data.additionalInformation?.trim() || '';

    if (additionalInformation.length > 15000) {
      throw new BadRequestException(
        'Additional information cannot exceed 15,000 characters.',
      );
    }

    const researchInstructions = {
      GENERAL_ANALYSIS: `
Analyse this application comprehensively.

Cover:
1. Overview of the application.
2. Target audience.
3. Strengths.
4. Weaknesses and potential limitations.
5. Feature evaluation.
6. Market positioning.
7. Monetisation opportunities.
8. Overall assessment.

`,

      COMPETITOR_COMPARISON: `
Compare this application with the competitor information supplied.

Cover:
1. Overview of both applications.
2. Feature comparison.
3. Strengths of each application.
4. Weaknesses of each application.
5. Competitive advantages.
6. Missing features and opportunities.
7. Ways to differentiate the registered application.
8. Overall competitive assessment.

If competitor information is insufficient, explain the limitations.
Do not invent competitor features or statistics.

`,

      IMPROVEMENT_RECOMMENDATIONS: `
Evaluate this application and recommend practical improvements.

Cover:
1. User experience improvements.
2. New feature recommendations.
3. Performance and usability considerations.
4. Monetisation opportunities.
5. User retention strategies.
6. Marketing and growth opportunities.
7. Development priorities.
8. Recommended action plan.

Prioritise recommendations according to usefulness and practicality.

`,
    };

    const prompt = `
You are the App Intelligence Research Analyst for JaxChat.

Your task is to produce a useful, structured application research report.

IMPORTANT RULES:
- Use the information actually provided.
- Do not pretend to have accessed the internet.
- Do not invent Play Store ratings, downloads, reviews, competitors,
  market statistics or other factual information.
- Clearly distinguish supplied facts from your assessments.
- Identify assumptions where necessary.
- Give practical recommendations.
- Be analytical, objective and detailed.
- Use clear headings and organised sections.

REGISTERED APPLICATION:

Name: ${app.name}
Package name: ${app.packageName}
Category: ${app.category || 'Not specified'}
Description: ${app.description || 'Not provided'}
Target audience: ${app.targetAudience || 'Not specified'}
Play Store URL: ${app.playStoreUrl}

RESEARCH TYPE:
${data.researchType}

ADDITIONAL INFORMATION PROVIDED:
${additionalInformation || 'No additional information provided.'}

RESEARCH INSTRUCTIONS:
${researchInstructions[data.researchType]}

Generate a professional research report with a suitable title.

End with a concise overall conclusion.
`;

    const report = await this.aiService.askJaxChat([
      {
        role: 'user',
        content: prompt,
      },
    ]);

    const title = `${app.name} - ${
      data.researchType === 'GENERAL_ANALYSIS'
        ? 'General Analysis'
        : data.researchType === 'COMPETITOR_COMPARISON'
          ? 'Competitor Comparison'
          : 'Improvement Recommendations'
    }`;

    const savedReport = await this.prisma.researchReport.create({
      data: {
        appId: app.id,
        researchType: data.researchType,
        title,
        inputData: additionalInformation
          ? { additionalInformation }
          : undefined,
        report,
      },
    });

    return {
      success: true,
      message: 'Research report generated successfully.',
      research: savedReport,
    };
  }

  // ==========================================
  // GET ALL REPORTS FOR AN APPLICATION
  // ==========================================

  async getReports(appId: string) {
    const app = await this.prisma.managedApp.findUnique({
      where: { id: appId },
    });

    if (!app) {
      throw new NotFoundException('Registered app not found.');
    }

    return this.prisma.researchReport.findMany({
      where: { appId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ==========================================
  // GET A SINGLE REPORT
  // ==========================================

  async getReport(reportId: string) {
    const report = await this.prisma.researchReport.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new NotFoundException('Research report not found.');
    }

    return report;
  }

  // ==========================================
  // DELETE A REPORT
  // ==========================================

  async deleteReport(reportId: string) {
    await this.getReport(reportId);

    await this.prisma.researchReport.delete({
      where: { id: reportId },
    });

    return {
      success: true,
      message: 'Research report deleted successfully.',
    };
  }
}
