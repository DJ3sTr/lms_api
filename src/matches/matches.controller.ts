import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MatchesService } from './matches.service';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  // @Post()
  // create(@Body() createMatchDto: CreateMatchDto) {
  //   return this.matchesService.create(createMatchDto);
  // }

  @Get()
  findAll() {
    return this.matchesService.findAll();
  }

  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.matchesService.findOne(+id);
  }

  @Get("current")
  findThisWeeksMatches(){
    return this.matchesService.findCurrentWeek()
  }

  @Get("/week/:id")
  findWeekMatches(@Param('id') id: string){
    return this.matchesService.findWeek(+id);
  }

  @Get("current/number")
  findWeekNumber(){
    return this.matchesService.findCurrentWeekNumber();
  }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchDto) {
//     return this.matchesService.update(+id, updateMatchDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.matchesService.remove(+id);
//   }

}
