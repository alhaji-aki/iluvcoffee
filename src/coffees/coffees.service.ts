import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto } from './dtos/create-coffee.dto';
import { UpdateCoffeeDto } from './dtos/update-coffee.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Event } from '../events/entities/event.entity';
import { Connection, Model } from 'mongoose';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectModel(Coffee.name) private readonly coffeeModel: Model<Coffee>,
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  index(query: PaginationQueryDto) {
    const { limit, offset } = query;
    return this.coffeeModel.find().skip(offset).limit(limit).exec();
  }

  async store(createCoffeeDto: CreateCoffeeDto) {
    const coffee = new this.coffeeModel(createCoffeeDto);

    return coffee.save();
  }

  async show(id: string) {
    const coffee = await this.coffeeModel.findOne({ _id: id }).exec();

    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found.`);
    }

    return coffee;
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const existingCoffee = await this.coffeeModel
      .findOneAndUpdate({ _id: id }, { $set: updateCoffeeDto }, { new: true })
      .exec();

    if (!existingCoffee) {
      throw new NotFoundException(`Coffee #${id} not found.`);
    }

    return existingCoffee;
  }

  async delete(id: string) {
    const coffee = await this.show(id);
    return coffee.remove();
  }

  async recommendCoffee(coffee: Coffee) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      coffee.recommendations++;
      const recommendEvent = new this.eventModel({
        name: 'recommend_coffee',
        type: 'coffee',
        payload: { coffeeId: coffee.id },
      });

      await recommendEvent.save({ session });
      await coffee.save({ session });

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
  }
}
