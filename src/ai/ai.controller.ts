import { Body, Controller, Post } from '@nestjs/common';

import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('infer-template')
  inferTemplate(
    @Body()
    body: {
      request: string;
    },
  ) {
    return this.aiService.inferTemplate(body.request);
  }

  @Post('polish')
  polish(
    @Body()
    body: {
      draft: string;
    },
  ) {
    return this.aiService.polishDraft(body.draft);
  }

  @Post('review')
  review(
    @Body()
    body: {
      document: string;
    },
  ) {
    return this.aiService.reviewDocument(body.document);
  }

  @Post('improve')
  improve(
    @Body()
    body: {
        document: string;
        review: any;
    },
  ) {
    return this.aiService.suggestImprovements(body.document, body.review);
  }

  @Post('quick-enhance')
  enhanceQuick(
    @Body()
    body: {
      draft: string;
    },
  ) {
    return this.aiService.quickDraftEnhancer(body.draft);
  }

  @Post('custom-enhance')
  customEnhance(
    @Body()
    body: {
      draft: string;

      clauses: string[];

      answers: Record<string, string>;
    },
  ) {
    return this.aiService.customDraftEnhancer(
      body.draft,

      body.clauses,

      body.answers,
    );
  }

  @Post('generate')
  generate(
    @Body()
    body: {
      request: string;

      templateType: string;
    },
  ) {
    return this.aiService.generateUnknownDraft(
      body.request,

      body.templateType,
    );
  }
}
