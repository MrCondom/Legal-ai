import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import clauses from './clauses.json';

@Injectable()
export class ClausesService {
  constructor(private readonly prisma: PrismaService) {}

  //////////////////////////////////////////////////////

  async searchClauses(query: string) {
    return this.prisma.clause.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
            },
          },

          {
            family: {
              contains: query,
            },
          },

          {
            documents: {
              has: query,
            },
          },

          {
            keywords: {
              has: query,
            },
          },

          {
            content: {
              contains: query,
            },
          },
        ],
      },

      orderBy: {
        title: 'asc',
      },
    });
  }

  //////////////////////////////////////////////////////

  async getAllClauses() {
    return this.prisma.clause.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  //////////////////////////////////////////////////////

  async getByFamily(family: string) {
    return this.prisma.clause.findMany({
      where: {
        family,
      },

      orderBy: {
        title: 'asc',
      },
    });
  }

  //////////////////////////////////////////////////////

  async getByDocument(document: string) {
    document = document.toLowerCase();
    
    return this.prisma.clause.findMany({
      where: {
        documents: {
          has: document,
        },
      },

      orderBy: {
        title: 'asc',
      },
    });
  }

  //////////////////////////////////////////////////////

  async getPremiumClauses(document: string) {
    document = document.toLowerCase();
    return this.prisma.clause.findMany({
      where: {
        documents: {
          has: document,
        },

        premium: true,
      },

      orderBy: {
        title: 'asc',
      },
    });
  }

  //////////////////////////////////////////////////////

  async getBasicClauses(document: string) {
    document = document.toLowerCase();
    return this.prisma.clause.findMany({
      where: {
        documents: {
          has: document,
        },

        premium: false,
      },

      orderBy: {
        title: 'asc',
      },
    });
  }

  //////////////////////////////////////////////////////

  async suggestClauses(
    family: string,

    document: string,
  ) {
    return this.prisma.clause.findMany({
      where: {
        family,

        documents: {
          has: document,
        },
      },

      orderBy: {
        title: 'asc',
      },
    });
  }

  //////////////////////////////////////////////////////

  async getByIds(ids: string[]) {
    return this.prisma.clause.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
  
  //////////////////////////////////////////////////////

  async seedClauses() {
    const formattedClauses = clauses.map((clause) => ({
      title: clause.title,

      family: clause.family,

      documents: clause.documents,

      content: clause.content,

      keywords: clause.keywords ?? [],

      premium: clause.premium ?? false,
    }));

    for (const clause of formattedClauses) {
      await this.prisma.clause.upsert({
        where: {
          title: clause.title,
        },

        update: {
          family: clause.family,

          documents: clause.documents,

          content: clause.content,

          keywords: clause.keywords,

          premium: clause.premium,
        },

        create: clause,
      });
    }

    return {
      success: true,

      count: formattedClauses.length,
    };
  }
}
