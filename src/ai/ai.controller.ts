import { Body, Controller, Post } from '@nestjs/common';
import { ReviewDocumentFamily } from './checks/review.check';
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
        documentFamily: ReviewDocumentFamily
    },
  ) {
    return this.aiService.reviewDocument(body.document, body.documentFamily);
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
        request: string;
        family: string;
    },
  ) {
    return this.aiService.quickDraftEnhancer(body.draft, body.request, body.family);
  }

  @Post('custom-enhance')
  customEnhance(
    @Body()
    body: {
      draft: string;

      clauses: string[];

        answers: Record<string, string>;

        family: string
    },
  ) {
    return this.aiService.customDraftEnhancer(
      body.draft,

      body.clauses,

      body.answers,

      body.family,
    );
  }

  @Post('generate')
  generate(
    @Body()
    body: {
      request: string;

        templateType: string;

        family: string;
    },
  ) {
    return this.aiService.generateUnknownDraft(
      body.request,

      body.templateType,

      body.family
    );
  }
}
