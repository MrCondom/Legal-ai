import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(
    @Body()
    body: {
      email: string;
      name?: string;
    },
  ) {
    return this.usersService.createUser(body.email, body.name);
  }

  @Get('profile/:id')
  getProfile(@Param('id') id: string) {
    return this.usersService.getProfile(id);
  }

  @Get(':email')
  getUser(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @Get('profile/:id/drafts')
  getDraftHistory(@Param('id') id: string) {
    return this.usersService.getDraftHistory(id);
  }

  @Delete('profile/:id/drafts/:draftId')
  deleteDraft(
    @Param('id')
    userId: string,

    @Param('draftId')
    draftId: string,
  ) {
    return this.usersService.deleteDraft(
      draftId,

      userId,
    );
  }
}
