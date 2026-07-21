import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';

import pdfParse from 'pdf-parse';

import * as mammoth from 'mammoth';

import { AiService } from '../ai/ai.service';

import { TemplatesService } from '../templates/templates.service';

import { ClausesService } from '../clauses/clauses.service';

import { BillingService } from '../billing/billing.service';

import { UsersService } from '../users/users.service';

import { DraftsService } from '../drafts/drafts.service';

import { CREDIT_COST } from '../constants/credits';

export interface WorkflowFound {
  status: 'FOUND';

  template: any;
}

export interface WorkflowUnknown {
  status: 'UNKNOWN';

  family: string;
}

export interface WorkflowCredit {
  status: 'NO_CREDIT';

  message: string;

  user: any;
}

export interface WorkflowReview {
  status: 'DOCUMENT_REVIEW';
}

export interface WorkflowInvalid {
  status: 'INVALID';

  message: string;
}

export type WorkflowResult =
  | WorkflowFound
  | WorkflowUnknown
  | WorkflowCredit
  | WorkflowInvalid
  | WorkflowReview;

@Injectable()
export class AssistantService {
  constructor(
    private readonly ai: AiService,

    private readonly templates: TemplatesService,

    private readonly clauses: ClausesService,

    private readonly billing: BillingService,

    private readonly users: UsersService,

    private readonly drafts: DraftsService,
  ) {}

  //////////////////////////////////////////////////////

  async startConversation(userId: string) {

    await this.templates.seedTemplates();
    await this.clauses.seedClauses();

    const user = await this.users.getProfile(userId);
    const credit = await this.checkCredits(userId);

    return {
      message: `Hello ${user?.name ?? 'there'}.

What can I draft for you today?`,

      credits: user?.credits,

      plan: user?.plan,

      subscription: user?.subscription,

      reason: credit.reason,
    };
  }

  //////////////////////////////////////////////////////

  async checkCredits(userId: string) {
    let user = await this.users.getProfile(userId);
  
    if (!user) {
      throw new NotFoundException("User not found");
    }
  
    if (
      user.subscription &&
      user.subscriptionExpiry &&
      new Date(user.subscriptionExpiry) <= new Date()
    ) {
  
      await this.users.expireSubscription(userId);
  
      user = await this.users.getProfile(userId);
    }
  
    const noCredits = (user.credits ?? 0) <= 0;
    
    if (!user.everSubscribed) {
    
      if (noCredits) {
        return {
          allowed: false,
          reason: "NO_CREDITS",
          user,
        };
      }
    
      return {
        allowed: true,
        reason: null,
        user,
      };
    }
    
    const subscriptionExpired = !user.subscription;
    
    if (subscriptionExpired && noCredits) {
      return {
        allowed: false,
        reason: "SUBSCRIPTION_AND_CREDITS",
        user,
      };
    }
    
    if (subscriptionExpired) {
      return {
        allowed: false,
        reason: "SUBSCRIPTION_EXPIRED",
        user,
      };
    }
    
    if (noCredits) {
      return {
        allowed: false,
        reason: "NO_CREDIT",
        user,
      };
    }
    
    return {
      allowed: true,
      reason: null,
      user,
    };
  }

///////////////////////////////////////////////////////

  async detectDocument(request: string) {
    return this.ai.inferTemplate(request);
  }

  //////////////////////////////////////////////////////

  async determineWorkflow(
    request: string,

    userId: string,
  ): Promise<WorkflowResult> {
    const credit = await this.checkCredits(userId);

    if (!credit.allowed) {
      return {
        status: 'NO_CREDIT',
        message: 'Insufficient credits',
        user: credit.user,
      };
    }

    const parsed = await this.ai.inferTemplate(request);

    if (!parsed) {
      throw new Error('AI failed');
    }
    console.log("AI RESULT");
    console.log(parsed);
    console.log("TYPE:", parsed.type);

    if (parsed.intent === 'DOCUMENT_REVIEW') {
      return {
        status: 'DOCUMENT_REVIEW',
      };
    }

    if (parsed.intent === 'INVALID') {
      await this.billing.consumeCredits(userId, CREDIT_COST.INVALID_QUERY);

      return {
        status: 'INVALID',

        message: 'Please request a legal draft or upload a legal document.',
      };
    }

    const templates = await this.templates.getTemplatesByFamily(parsed.type);
    console.log("TEMPLATES FOUND");
    console.log(templates);

    if (templates.length === 0) {
      return {
        status: 'UNKNOWN',

        family: parsed.type,
      };
    }

    const template = await this.ai.chooseBestTemplate(request, templates);

    return {
      status: 'FOUND',

      template,
    };
  }

  //////////////////////////////////////////////////////

  async prepareDraft(
    request: string,

    userId: string,
  ) {
    const workflow = await this.determineWorkflow(
      request,

      userId,
    );

    if (workflow.status === 'DOCUMENT_REVIEW') {
      return {
        status: 'DOCUMENT_REVIEW',

        message: 'Existing legal document detected.',
      };
    }

    if (workflow.status === 'INVALID') {
      return {
        status: 'INVALID',
        message: workflow.message,
      };
    }

    if (workflow.status === 'FOUND') {
      const clauses = await this.clauses.getByDocument(workflow.template.title);

      return {
        status: 'FOUND',

        templateId: workflow.template.id,

        template: workflow.template.title,

        family: workflow.template.documentFamily,

        formSchema: workflow.template.formSchema,

        clauses,

        modeSelection: true,
      };
    }

    if (workflow.status === 'NO_CREDIT') {
      const credit = await this.checkCredits(userId);
      return {
        status: 'NO_CREDIT',
        reason: credit.reason,
        message: workflow.message,
        user: credit.user,
      };
    }

    return {
      status: 'UNKNOWN',

      family: workflow.family,

      generated: true,

      modeSelection: true,
    };
  }

  //////////////////////////////////////////////////////

  async createQuickDraft(
    templateId: string,

    userId: string,
  ) {
    const template = await this.templates.getTemplateById(templateId);

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    const document = this.templates.flattenTemplate(template.content);

    const enhanced = await this.ai.quickDraftEnhancer(document);

    const polished = await this.ai.polishDraft(enhanced);

    const review = await this.ai.reviewDocument(polished);

    await this.billing.consumeCredits(userId, CREDIT_COST.QUICK_DRAFT);

    const draft = await this.drafts.createAssistantDraft({
      templateId,

      userId,

      generatedText: polished,

      inputData: {},
    });

    return {
      draftId: draft.id,

      draft: polished,

      review,
    };
  }

  //////////////////////////////////////////////////////

  async createCustomDraft(
    templateId: string,

    userId: string,

    answers: Record<string, string>,

    clauseIds: string[],
  ) {
    const template = await this.templates.getTemplateById(templateId);

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    const user = await this.users.getProfile(userId);

    const availableClauses =
      user?.plan === 'PRO'
        ? await this.clauses.getByDocument(template.title)
        : await this.clauses.getBasicClauses(template.title);

    const allowedIds = availableClauses.map(c => c.id);

    const clauses = await this.clauses.getByIds(
      clauseIds.filter(id => allowedIds.includes(id))
    );

    const document = this.templates.flattenTemplate(template.content);

    const enhanced = await this.ai.customDraftEnhancer(
      document,

      clauses.map((c) => c.content),

      answers
    );

    const polished = await this.ai.polishDraft(enhanced);

    const review = await this.ai.reviewDocument(polished);

    await this.billing.consumeCredits(userId, CREDIT_COST.CUSTOM_DRAFT);

    const draft = await this.drafts.createAssistantDraft({
      templateId,

      userId,

      inputData: answers,

      generatedText: polished,
    });

    return {
      draftId: draft.id,

      draft: polished,

      review,
    };
  }

  //////////////////////////////////////////////////////

  async generateFallbackDraft(
    request: string,

    family: string,

    userId: string,
  ) {
    const templates = await this.templates.getTemplatesByFamily(family);

    if (templates.length === 0) {
      throw new BadRequestException('No Base Template');
    }

    const template = await this.ai.chooseBestTemplate(request, templates);

    const document = this.templates.flattenTemplate(template.content);

    const generated = await this.ai.generateUnknownDraft(
      request,

      document,
    );

    const polished = await this.ai.polishDraft(generated);

    const review = await this.ai.reviewDocument(polished);

    await this.billing.consumeCredits(userId, CREDIT_COST.DRAFT);

    const draft = await this.drafts.createAssistantDraft({
      templateId: template.id,

      userId,

      generatedText: polished,

      inputData: {},
    });

    return {
      draftId: draft.id,

      draft: polished,

      review,
    };
  }

  //////////////////////////////////////////////////////

  async getClauses(document: string) {
    return this.clauses.getByDocument(document);
  }

  //////////////////////////////////////////////////////

  async getHistory(userId: string) {
    return this.users.getDraftHistory(userId);
  }

  //////////////////////////////////////////////////////

  async reviewExistingDocument(userId: string, document: string) {
    const user = await this.users.getProfile(userId);

    //if (user.plan !== 'PRO') {
     //throw new ForbiddenException('Feature available only for PRO users');
     //}

    await this.billing.consumeCredits(userId, CREDIT_COST.REVIEW);

    return this.ai.reviewDocument(document);
  }

  //////////////////////////////////////////////////////

  async reviewUploadedDocument(
    userId: string,
    file: Express.Multer.File,
  ) {

    //const user = await this.users.getProfile(userId);


    //if (!user) {
      //throw new NotFoundException('User not found');
      // }

    //if (user.plan !== 'PRO') {
      //throw new ForbiddenException({
       //code: "PRO_REQUIRED",
       //message: "Feature available only for PRO users"});
       //}

    console.log(userId);
    console.log(file.originalname);

    const extension = file.originalname
      .split(".")
      .pop()
      ?.toLowerCase();

    let text = "";

    if (extension === "pdf") {
      try {
      const parsed = await pdfParse(file.buffer);
        text = parsed.text;
      } catch (error) {
        console.error(error);

        throw new BadRequestException({
          code: "PASSWORD_PROTECTED",
          message: "This PDF is password protected. Please remove the password and upload it again."
        });
      }
    } else if (extension === "docx") {
      const result = await mammoth.extractRawText({
        buffer: file.buffer,
      });

      text = result.value;
    } else {
      throw new BadRequestException(
        "Only PDF and DOCX files are supported.",
      );
    }

    const review = await this.ai.reviewDocument(text);

    if (!review.validDocument) {
      await this.billing.consumeCredits(userId, CREDIT_COST.INVALID_QUERY);
      throw new BadRequestException(
        review.reason??
        "This is not a legal document. Please upload a legal draft for review"
      );
    }

    await this.billing.consumeCredits(userId, CREDIT_COST.REVIEW);

    return {
      review,
        document: text,
    };
  }


  ////////////////////////////////////////////

  async suggestImprovements(userId: string, document: string, review: any,) {
    //const user = await this.users.getProfile(userId);

    //if (!user) {
      //throw new NotFoundException('User not found');
      // }

    //if (user.plan !== 'PRO') {
      //throw new ForbiddenException({
       //code: "PRO_REQUIRED",
       //message: "Feature available only for PRO users"});
       //}

    await this.billing.consumeCredits(userId, CREDIT_COST.IMPROVEMENT);

    return this.ai.suggestImprovements(document, review);
  }
}
