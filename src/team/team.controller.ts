import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Logger } from '@nestjs/common';
import { TeamService } from './team.service';




@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) { }

  // @Post()
  // create(@Body() createTeamDto: CreateTeamDto) {
  //   return this.teamService.create(createTeamDto);
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    Logger.verbose(`id: ${id}`);
    return this.teamService.findOne(id);
  }

  @Get()
  findAll() {
    return this.teamService.findAll();
  }


  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
  //   return this.teamService.update(id, updateTeamDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamService.remove(id);
  }
}
