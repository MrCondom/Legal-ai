import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import executions from '../constants/execution';
import deedTemplate from './template-files/deed-of-conveyance.json';
import conveyanceForm from './template-forms/conveyance.json';
import assignmentTemplate from './template-files/deed-of-assignment.json';

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

    const document = content.deed_of_conveyance;

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
        formSchema: conveyanceForm,
      },
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
              ...template.[rootKey],
              sections: template.[rootKey].sections.flatMap(section => {
  
                  if (section.type !== "execution") {
                      return section;
                  }
  
                  return execution.content;
              })
          }
      };
  }


  async seedTemplates() {
    const count = await this.prisma.template.count();

    if (count > 0) {
      return;
    }

    await this.seedDeedOfConveyance();
    await this.seedDeedOfAssignment();
  }
}
