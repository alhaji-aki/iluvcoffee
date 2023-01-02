import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Shipwreck Roast',
      brand: 'Buddy Brew',
      flavors: ['chocolate', 'vanilla'],
    },
  ];

  index() {
    return this.coffees;
  }

  store(createCoffeeDto: any) {
    this.coffees.push(createCoffeeDto);
  }

  show(id: string) {
    const coffee = this.coffees.find((item) => item.id === +id);

    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found.`);
    }

    return coffee;
  }

  update(id: string, updateCoffeeDto: any) {
    const existingCoffee = this.show(id);
    if (existingCoffee) {
      // update existing coffee
    }
  }

  delete(id: string) {
    const coffeeIndex = this.coffees.findIndex((item) => item.id === +id);
    if (coffeeIndex >= 0) {
      this.coffees.splice(coffeeIndex, 1);
    }
  }
}
