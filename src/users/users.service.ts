import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(email: string, name?: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return existingUser;
    }

    return this.prisma.user.create({
      data: {
        email,
        name,
        credits: 1000,
        subscription: false,
        plan: "FREE"
      },
    });
  }

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async getDraftHistory(userId: string) {
    return this.prisma.draft.findMany({
      where: {
        userId,
      },

      include: {
        template: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  
  async clearDraftHistory(userId: string) {
    return this.prisma.draft.deleteMany({
      where: {
        userId,
      },
    });
  }

  async deleteDraft(draftId: string, userId: string) {
    const draft = await this.prisma.draft.findUnique({
      where: {
        id: draftId,
      },
    });

    if (!draft || draft.userId !== userId) {
      throw new NotFoundException();
    }

    return this.prisma.draft.delete({
      where: {
        id: draftId,
      },
    });
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,

        plan: true,
        credits: true,

        subscription: true,
        everSubscribed: true,
        subscriptionExpiry: true,

        lastBillingCycleId: true,


        createdAt: true,

        _count: {
          select: {
            drafts: true,
          },
        },
      },
    });

    return {
      ...user,

      draftCount: user?._count.drafts,
    };
  }

  async activateSubscription(
    userId: string,
    purchaseToken: string,
    expiryDate: Date,
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        subscription: true,
        subscriptionId: purchaseToken,
        subscriptionExpiry: expiryDate,
      },
    });
  }

  async expireSubscription(userId: string) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        subscription: false,
        plan: "FREE",
        subscriptionId: null,
        subscriptionExpiry: null,
      },
    });
  }
}
