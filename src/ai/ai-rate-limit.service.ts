import {
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';

@Injectable()
export class AiRateLimitService {

  private requests: Record<string, number[]> = {
    cfinance: [],
    legalReader: [],
  };

  private readonly limits = {
    cfinance: {
      maxRequests: 2,
      windowMs: 10 * 60 * 1000,
    },

    legalReader: {
      maxRequests: 10,
      windowMs: 10 * 60 * 1000,
    },
  };

  consume(application: 'cfinance' | 'legalReader'): void {

    const config = this.limits[application];

    const now = Date.now();

    // Remove expired requests.
    this.requests[application] =
      this.requests[application].filter(
        timestamp => now - timestamp < config.windowMs,
      );

    // Check whether the limit has been reached.
    if (
      this.requests[application].length >=
      config.maxRequests
    ) {
      throw new ServiceUnavailableException(
        'AI service unavailable. Please try again later.',
      );
    }

    // Record this request.
    this.requests[application].push(now);
  }
}