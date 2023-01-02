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

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Get()
  index(@Query() query) {
    // const { limit, offset } = query;
    return this.coffeesService.index();
  }

  @Post()
  store(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.store(createCoffeeDto);
  }

  @Get(':id')
  show(@Param('id') id: string) {
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
