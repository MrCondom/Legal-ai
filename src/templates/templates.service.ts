import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import executions from '../constants/execution';
import deedTemplate from './template-files/propertyLaw/deed-of-conveyance.json';
import conveyanceForm from './template-forms/propertySchema/conveyance.json';
import assignmentTemplate from './template-files/propertyLaw/deed-of-assignment.json';
import assignmentForm from './template-forms/propertySchema/assignment.json';
import giftTemplate from './template-files/propertyLaw/deed-of-gift.json';
import giftForm from './template-forms/propertySchema/giftSchema.json';
import sharesTemplate from './template-files/propertyLaw/deed-of-shares.json';
import sharesForm from './template-forms/propertySchema/sharesSchema.json';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  async getTemplates() {
    return this.prisma.template.findMany();
  }

  async deleteTemplates() {
    await this.prisma.draft.deleteMany();
    return this.prisma.template.deleteMany();
  }

  async getTemplateByFamily(family: string) {
    return this.prisma.template.findFirst({
      where: {
        documentFamily: family,
      },
    });
  }

  async getTemplatesByFamily(family: string) {
    return this.prisma.template.findMany({
      where: {
        documentFamily: family,
      },
      select: {
        id: true,
        title: true,
        tags: true,
        documentFamily: true,
        formSchema: true,
        content: true
      }
    });
  }

  async getTemplateById(id: string) {
    return this.prisma.template.findUnique({
      where: {
        id,
      },
    });
  }

  flattenTemplate(content: any) {

    const rootKey = Object.keys(content)[0];

    const document = content[rootKey];

    return document.sections.map(section => {

      if (Array.isArray(section.value)) {
        return section.value.join('\n');
      }
      return section.value;
    })
      .join('\n\n');
  }

  async seedDeedOfConveyance() {
    return this.prisma.template.create({
      data: {
        slug: 'deed-of-conveyance',
        title: 'Deed of Conveyance',
        documentFamily: 'deed',
        tags: ['property, land, ownership, conveyance, transfer of title'],
        content: deedTemplate,
        formSchema: conveyanceForm,
      },
    });
  }

  async seedDeedOfAssignment() {
    return this.prisma.template.create({
      data: {
        slug: 'deed-of-assignment',
        title: 'Deed of Assignment',
        documentFamily: 'deed',
        tags: ['property, land, ownership, assignment, transfer of title'],
        content: assignmentTemplate,
        formSchema: assignmentForm,
      },
    });
  }

  async seedDeedOfGift() {
    return this.prisma.template.create({
      data: {
        slug: 'deed-of-gift',
        title: 'Deed of Gift',
        documentFamily: 'deed',
        tags: ['property, ownership, gift, transfer of title, no consideration'],
        content: giftTemplate,
        formSchema: giftForm,
      },
    });
  }

  async seedDeedOfShares() {
    return this.prisma.template.create({
      data: {
        slug: 'deed-of-transfer-of-shares',
        title: 'Deed of Transfer of Shares',
        documentFamily: 'deed',
        tags: ['property, ownership, transfer of title, corporate issues, transfer of shares,'],
        content: sharesTemplate,
        formSchema: sharesForm,
      },
    });
  }


  buildExecution(template: any, answers: any) {

    const execution = [] as any[];

    for (const party of template.parties ?? []) {

      const prefix = party.id;

      const executionType =
        answers[`${prefix}Execution`]?.toLowerCase().replace(/\s+/g, "");

      const block = this.getExecutionBlock(executionType);

      execution.push(
        this.renderExecution(block, {
          role: party.role,
          name: answers[`${prefix}Name`],
          companyName: answers[`${prefix}CompanyName`],
          interpreterName: answers[`${prefix}InterpreterName`],
          attorneyName: answers[`${prefix}AttorneyName`],
          familyHead: answers[`${prefix}FamilyHead`]
        })
      );
    }

    return execution.flat();
  }


  renderExecution(block: any, values: Record<string, any>) {

    return block.content.map(item => {

      const copy = JSON.parse(JSON.stringify(item));

      const replace = (text: string) =>
        text.replace(/\{\{(.*?)\}\}/g, (_, key) => {

          return values[key.trim()] ?? "";
        });

      if (typeof copy.value === "string") {

        copy.value = replace(copy.value);

      } else if (Array.isArray(copy.value)) {

        copy.value = copy.value.map(replace);
      }

      return copy;
    });

  }


  getExecutionBlock(type: string) {
      return executions[type] ?? executions.individual;
  }
  injectExecution(
      template: any,
      execution: any
  ) {
    const rootKey = Object.keys(template)[0];
      return {
          ...template,
          [rootKey]: {
              ...template[rootKey],
              sections: template[rootKey].sections.flatMap(section => {

                  if (section.type !== "execution") {
                      return section;
                  }

                  return execution;
              })
          }
      };
  }


  async seedTemplates() {

    const templates = [
      {
        slug: 'deed-of-conveyance',
        seed: () => this.seedDeedOfConveyance(),
      },
      {
        slug: 'deed-of-assignment',
        seed: () => this.seedDeedOfAssignment(),
      },
      {
        slug: 'deed-of-gift',
        seed: () => this.seedDeedOfGift(),
      },
      {
        slug: 'deed-of-transfer-of-shares',
        seed: () => this.seedDeedOfShares(),
      },

      //add more templates
    ];

    for (const template of templates) {
      const exists = await this.prisma.template.findUnique({
        where: {
          slug: template.slug,
        },
      });

      if (!exists) {
        await template.seed();
        console.log(
          `Seeded ${template.slug}`
        );
      }
    }
  }
}
