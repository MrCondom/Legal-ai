import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TemplatesService } from '../templates/templates.service';
import { CREDIT_COST } from '../constants/credits';

@Injectable()
export class DraftsService {
  constructor(
    private prisma: PrismaService,
    private templates: TemplatesService,
  ) { }

  async createDraft(body: {
    templateId: string;
    userId: string;
    data: Record<string, string>;
  }) {
    const { templateId, data, userId } = body;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    if (user.credits <= 0) {
      throw new ForbiddenException({
        code: "SUBSCRIPTION_REQUIRED",
        message: "No credits left. Please Subscribe.",
      })
    }

    // 1. FIND TEMPLATE
    const template = await this.prisma.template.findUnique({
      where: {
        slug: templateId,
      },
    });

    // 2. TEMPLATE NOT FOUND
    if (!template) {
      throw new NotFoundException('Template not found');
    }

    // 3. PARSE JSON TEMPLATE
    const parsedTemplate = template.content as {
      deed_of_conveyance: {
        sections: {
          type: string;
          value: string | string[];
        }[];
      };
    };

    const rootKey = Object.keys(parsedTemplate)[0];

    const document = parsedTemplate[rootKey];

    const execution = this.templates.buildExecution(document, data);

    const finalTemplate = this.templates.injectExecution(
      parsedTemplate,
      execution
    );

    const root = Object.keys(finalTemplate)[0];
    const sections = finalTemplate[root].sections;
    // 4. BUILD OUTPUT
    let generatedText = '';

    // only replace strings
    for (const section of sections) {
      const value = section.value;

      if (typeof section.left === "string") {
        generatedText += section.left + " ";
      }

      if (typeof section.right === "string") {
        generatedText += section.right + "\n\n";
      }

      // STRING
      if (typeof value === 'string') {
        let processedValue = value;

        Object.keys(data).forEach((key) => {
          processedValue = processedValue.replace(
            new RegExp(`{{${key}}}`, `g`),
            data[key],
          );
        });

        generatedText += processedValue + '\n\n';
      }

      // ARRAY
      else if (Array.isArray(value)) {
        for (let item of value) {
          Object.keys(data).forEach((key) => {
            item = item.replace(new RegExp(`{{${key}}}`, `g`), data[key]);
          });

          generatedText += item + '\n';
        }

        generatedText += '\n';
      }
    }

    // 5. SAVE GENERATED DRAFT
    const draft = await this.prisma.draft.create({
      data: {
        userId: userId,
        templateId: template.id,
        inputData: data,
        generatedText,
      },
    });

    await this.prisma.user.update({
      where: { id: body.userId },
      data: {
        credits: {
          decrement: CREDIT_COST.DRAFT,
        },
      },
    });

    return draft;
  }

  async getDrafts() {
    return this.prisma.draft.findMany();
  }

  async getDraft(id: string) {
    const draft = await this.prisma.draft.findUnique({
      where: { id },
    });

    if (!draft) {
      throw new NotFoundException('Draft not found');
    }

    return draft;
  }

  async createAssistantDraft(body: {
    templateId: string;

    userId: string;

    inputData: any;

    generatedText: string;
  }) {
    return this.prisma.draft.create({
      data: {
        templateId: body.templateId,

        userId: body.userId,

        inputData: JSON.stringify(body.inputData),

        generatedText: body.generatedText,
      },
    });
  }
}
