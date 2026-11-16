import {
  Body,
  Controller,
  Post,
  BadRequestException,
} from '@nestjs/common';

import { AiService } from './ai.service';

@Controller('jaxchat')
export class JaxChatController {
  constructor(
    private readonly aiService: AiService,
  ) {}

  // ==================================================
  // JAXCODE — CODING
  // ==================================================

  @Post('code')
  async code(
    @Body()
    body: {
      messages: Array<{
        role: 'user' | 'assistant';
        content: string;
      }>;
    },
  ) {
    if (!body || !Array.isArray(body.messages)) {
      throw new BadRequestException(
        'Messages are required.',
      );
    }

    const response =
      await this.aiService.askJaxCode(
        body.messages,
      );

    return {
      success: true,
      response,
    };
  }

  // ==================================================
  // JAXCHAT — GENERAL CONVERSATION
  // ==================================================

  @Post('chat')
  async chat(
    @Body()
    body: {
      messages: Array<{
        role: 'user' | 'assistant';
        content: string;
      }>;
    },
  ) {
    if (!body || !Array.isArray(body.messages)) {
      throw new BadRequestException(
        'Messages are required.',
      );
    }

    const response =
      await this.aiService.askJaxChat(
        body.messages,
      );

    return {
      success: true,
      response,
    };
  }

  // ==================================================
  // JAXIMAGE — IMAGE GENERATION
  // ==================================================

  @Post('image')
  async image(
    @Body()
    body: {
      prompt: string;
    },
  ) {
    if (!body || typeof body.prompt !== 'string') {
      throw new BadRequestException(
        'Image prompt is required.',
      );
    }

    const result =
      await this.aiService.generateJaxImage(
        body.prompt,
      );

    return result;
  }

  // ==================================================
  // JAXENHANCER — IMAGE ENHANCEMENT
  // ==================================================

  @Post('enhance')
  async enhance(
    @Body()
    body: {
      imageBase64: string;
      mimeType: string;
      prompt: string;
    },
  ) {
    if (
      !body ||
      typeof body.imageBase64 !== 'string' ||
      typeof body.mimeType !== 'string' ||
      typeof body.prompt !== 'string'
    ) {
      throw new BadRequestException(
        'Image, MIME type and enhancement instructions are required.',
      );
    }

    const result =
      await this.aiService.enhanceJaxImage(
        body.imageBase64,
        body.mimeType,
        body.prompt,
      );

    return result;
  }
}