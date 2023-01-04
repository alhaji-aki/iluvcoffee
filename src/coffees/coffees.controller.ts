import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dtos/create-coffee.dto';
import { UpdateCoffeeDto } from './dtos/update-coffee.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Public } from '../common/decorators/public.decorator';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Public()
  @Get()
  async index(@Query() query: PaginationQueryDto) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return this.coffeesService.index(query);
  }

  @Post()
  store(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.store(createCoffeeDto);
  }

  @Get(':id')
  show(@Param('id', ParseIntPipe) id: string) {
    console.log(id);

    return this.coffeesService.show(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeesService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.coffeesService.delete(id);
  }
}
