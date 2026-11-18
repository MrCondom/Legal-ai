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

    // ==========================================
    // RESEARCH INSTRUCTIONS
    // ==========================================

    const researchInstructions = {
      GENERAL_ANALYSIS: `
Perform a concise analysis of this application.

Focus on:
1. What the application does and its intended audience.
2. Its strongest features and advantages.
3. Its weaknesses and potential limitations.
4. Its market positioning based on available information.
5. Monetisation opportunities, where relevant.
6. The most important improvements.

Avoid lengthy explanations.
Focus on findings that could influence development decisions.
`,

      COMPETITOR_COMPARISON: `
Perform a concise comparison between this application
and the competitor information supplied.

Focus on:
1. Main differences between the applications.
2. Feature comparison.
3. Strengths and weaknesses of each.
4. Competitive advantages.
5. Missing features and opportunities.
6. How the registered application can differentiate itself.

Only compare information that is actually available.

If competitor information is insufficient,
clearly explain what cannot be established.

Never invent competitor features, ratings or statistics.
`,

      IMPROVEMENT_RECOMMENDATIONS: `
Evaluate this application and identify its most valuable
improvement opportunities.

Focus on:
1. User experience and interface improvements.
2. Useful feature additions.
3. Performance and usability.
4. Monetisation opportunities.
5. User retention.
6. Development priorities.

Provide specific, practical recommendations.

Prioritise improvements by their likely impact
and implementation practicality.

Avoid generic suggestions that could apply to any application.
`,

    };

    // ==========================================
    // MAIN AI PROMPT
    // ==========================================

    const prompt = `
You are the App Intelligence Research Analyst for JaxChat.

Produce a concise, useful and decision-focused research report.

Your objective is to help the developer understand the application
and identify its most important opportunities and weaknesses.

STRICT OUTPUT REQUIREMENTS:

1. LENGTH
- Keep the report between 400 and 600 words where possible.
- Never exceed 600 words.
- Prioritise important findings over lengthy explanations.

2. STRUCTURE

Use this structure:

QUICK SUMMARY

Write a brief summary of the most important findings
in approximately 3 to 5 sentences.

KEY FINDINGS

Present 4 to 6 important findings as short bullet points.

DETAILED ANALYSIS

Provide the relevant analysis for the selected research type.
Use short paragraphs and concise bullet points.

RECOMMENDATIONS

Provide 3 to 5 practical recommendations.
Each recommendation must explain what should be done
and briefly why it matters.

PRIORITY ACTIONS

Identify the most important actions using:
HIGH PRIORITY
MEDIUM PRIORITY
LOW PRIORITY

Only include priorities that are genuinely relevant.

FINAL ASSESSMENT

End with a brief conclusion of no more than 3 sentences.

3. FORMATTING
- Use plain text headings.
- Do not use Markdown heading symbols such as # or ##.
- Do not use lengthy numbered sections.
- Use simple bullet points.
- Keep paragraphs short.
- Avoid excessive spacing.
- Do not repeat the same findings in different sections.

4. ACCURACY
- Use only information actually provided.
- Do not pretend to have accessed the internet.
- Do not invent Play Store ratings, downloads, reviews,
  competitor features, market statistics or other facts.
- Clearly distinguish supplied facts from your assessments.
- Label important assumptions as ASSUMPTION.
- If information is unavailable, say so briefly.
- Never present an estimate as a verified fact.

5. QUALITY
- Be analytical, objective and practical.
- Avoid generic recommendations.
- Do not explain obvious concepts.
- Avoid unnecessary introductions and lengthy conclusions.
- Focus on information that helps the developer make decisions.

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

Generate the report now.
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

    // ==========================================
    // SAVE REPORT
    // ==========================================

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