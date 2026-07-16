import { Body, Controller, Post } from '@nestjs/common';
import { BillingService } from './billing.service';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) { }

  @Post("reward")
  rewardCredit(
    @Body() body: { userId: string },
  ) {
    return this.billingService.rewardCredit(
      body.userId,
      1,
    );
  }


  @Post('verify')
  verifySubscription(
    @Body()
    body: {
      userId: string;
      purchaseToken: string;
      productId: string;
      plan: 'BASIC' | 'PRO';
    },
  ) {
    return this.billingService.verifySubscription(
      body.userId,
      body.purchaseToken,
      body.productId,
      body.plan,
    );
  }
}
