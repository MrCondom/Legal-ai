import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { google } from 'googleapis';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  private androidPublisher = google.androidpublisher('v3');

  private auth = new google.auth.GoogleAuth({
    keyFile: './google-services.json',
    scopes: ['https://www.googleapis.com/auth/androidpublisher'],
  });

  async verifySubscription(
    userId: string,
    purchaseToken: string,
    productId: string,
    plan: 'BASIC' | 'PRO',
  ) {
    try {
      const authClient = await this.auth.getClient();

      const response = await this.androidPublisher.purchases.subscriptions.get({
        auth: authClient as any,
        packageName: 'com.jaxman.cdraft',
        subscriptionId: productId,
        token: purchaseToken,
      });

      const data = response.data;

      console.log('GOOGLE RESPONSE:', JSON.stringify(data, null, 2));

      if (data.acknowledgementState === 0) {
        await this.androidPublisher.purchases.subscriptions.acknowledge({
          auth: authClient as any,
          packageName: 'com.jaxman.cdraft',
          subscriptionId: productId,
          token: purchaseToken,
          requestBody: {},
        });

        console.log('Subscription acknowledged');
      }

      // 1. VALIDATE EXPIRY
      const expiryTime = Number(data.expiryTimeMillis);

      if (!expiryTime || expiryTime < Date.now()) {
        throw new UnauthorizedException('Subscription expired');
      }

      const expiryDate = new Date(expiryTime);

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      const billingCycleId = `${data.startTimeMillis}_${data.expiryTimeMillis}`;
      if (user?.lastBillingCycleId === billingCycleId) {
        return {
          success: true,
          message: 'Billing cycle already processed',
          plan: user.plan,
          credits: user.credits,
          expiryDate,
        };
      }

      let credits = 0;

      if (plan === 'BASIC') {
        credits = 50;
      }

      if (plan === 'PRO') {
        credits = 250;
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          subscription: true,
          everSubscribed: true,
          subscriptionId: purchaseToken,
          subscriptionExpiry: expiryDate,
          plan,
          credits: {
            increment: plan === 'BASIC' ? 150 : 600,
          },
          creditResetAt: new Date(),
          lastBillingCycleId: billingCycleId,
        },
      });

      return {
        success: true,
        expiryDate,
        productId,
        plan,
        credits,
      };
    } catch (error) {
      console.log('Billing verify error:', error);
      throw new UnauthorizedException('Invalid subscription');
    }
  }

  async rewardCredit(userId: string, amount = 1) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        credits: {
          increment: amount,
        },
      },
    });
  }

  async consumeCredits(userId: string, amount: number) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        credits: {
          decrement: amount,
        },
      },
    });
  }
}
