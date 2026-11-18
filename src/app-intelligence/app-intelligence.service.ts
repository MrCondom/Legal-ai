import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppIntelligenceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    name: string;
    packageName: string;
    playStoreUrl: string;
    category?: string;
    description?: string;
    targetAudience?: string;
  }) {
    const packageName = data.packageName.trim();

    const existing = await this.prisma.managedApp.findUnique({
      where: { packageName },
    });

    if (existing) {
      throw new ConflictException('This app is already registered.');
    }

    return this.prisma.managedApp.create({
      data: {
        name: data.name.trim(),
        packageName,
        playStoreUrl: data.playStoreUrl.trim(),
        category: data.category?.trim(),
        description: data.description?.trim(),
        targetAudience: data.targetAudience?.trim(),
      },
    });
  }

  async findAll() {
    return this.prisma.managedApp.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const app = await this.prisma.managedApp.findUnique({
      where: { id },
    });

    if (!app) {
      throw new NotFoundException('App not found.');
    }

    return app;
  }

  async update(
    id: string,
    data: {
      name?: string;
      packageName?: string;
      playStoreUrl?: string;
      category?: string;
      description?: string;
      targetAudience?: string;
    },
  ) {
    await this.findOne(id);

    return this.prisma.managedApp.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.managedApp.delete({
      where: { id },
    });
  }
}
