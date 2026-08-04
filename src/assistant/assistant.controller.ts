import { Controller, Post, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AssistantService } from './assistant.service';

@Controller('assistant')
export class AssistantController {
  constructor(private assistantService: AssistantService) {}

  @Post('welcome')
  welcome(@Body() body: { userId: string }) {
    return this.assistantService.startConversation(body.userId);
  }

  @Post('request')
  handleRequest(@Body() body: { userId: string; request: string }) {
    return this.assistantService.determineWorkflow(body.request, body.userId);
  }

  @Post('prepare')
  prepare(@Body() body: { userId: string; request: string }) {
    return this.assistantService.prepareDraft(body.request, body.userId);
  }

  @Post('quick')
  quick(@Body() body: { templateId: string; userId: string; request: string; }) {
    return this.assistantService.createQuickDraft(body.templateId, body.userId, body.request,);
  }

  @Post('custom')
  custom(
    @Body()
    body: {
      templateId: string;
        userId: string;
        answers: Record<string, string>;
        clauseIds: string[];
    },
  ) {
    return this.assistantService.createCustomDraft(
      body.templateId,
      body.userId,
      body.answers,
      body.clauseIds ?? [],
    );
  }

  @Post('fallback')
  fallback(
    @Body()
    body: {
      request: string;
      family: string;
      userId: string;
    },
  ) {
    return this.assistantService.generateFallbackDraft(
      body.request,
      body.family,
      body.userId,
    );
  }

  @Post('clauses')
  getClauses(@Body() body: { family: string }) {
    return this.assistantService.getClauses(body.family);
  }

  @Post('review')
  review(
    @Body()
    body: {
      userId: string;

      document: string;
    },
  ) {
    return this.assistantService.reviewExistingDocument(
      body.userId,

      body.document,
    );
  }

  @Post("review-upload")
  @UseInterceptors(FileInterceptor("file"))
  reviewUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body("userId") userId: string,
  ) {
    return this.assistantService.reviewUploadedDocument(
      userId,
      file,
    );
  }

  @Post('improve')
  improveUpload(
   @Body()
   body:{
     userId:string;
        document: string;
        review: any;
   }
  ){
   return this.assistantService.suggestImprovements(
     body.userId,
     body.document,
     body.review,
   );
  }
}
