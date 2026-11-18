import {
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

type Application = 'cfinance' | 'legalReader';

@Injectable()
export class AiRateLimitService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private readonly limits = {
    cfinance: {
      maxRequests: 2,
      windowMs: 6 * 60 * 60 * 1000, // 6 hours
    },

    legalReader: {
      maxRequests: 10,
      windowMs: 30 * 60 * 1000, // 30 minutes
    },
  };

  async consume(application: Application): Promise<void> {

    const config = this.limits[application];

    const lockId = application === 'cfinance' ? 1 : 2;

    const now = new Date();

    const cutoff = new Date(
      now.getTime() - config.windowMs,
    );

    await this.prisma.$transaction(async (tx) => {

      // Prevent concurrent requests from bypassing the limit.
      await tx.$queryRaw`
        SELECT pg_advisory_xact_lock(48291, ${lockId})
      `;

      // Remove expired usage records.
      await tx.$executeRaw`
        DELETE FROM "AiRequestUsage"
        WHERE "application" = ${application}
        AND "createdAt" <= ${cutoff}
      `;

      // Count requests within the current window.
      const result = await tx.$queryRaw<
        { count: number }[]
      >`
        SELECT COUNT(*)::int AS count
        FROM "AiRequestUsage"
        WHERE "application" = ${application}
        AND "createdAt" > ${cutoff}
      `;

      const currentRequests = result[0].count;

      // Reject requests that exceed the limit.
      if (currentRequests >= config.maxRequests) {
        throw new ServiceUnavailableException(
          'AI service unavailable. Please try again later.',
        );
      }

      // Save the accepted request.
      await tx.$executeRaw`
        INSERT INTO "AiRequestUsage" ("application")
        VALUES (${application})
      `;

    });
  }
}
