import { Body, Controller, Get, Post } from '@nestjs/common'
import { CatsService } from './cats.service'
import { CatDto } from './dto/cat.dto'
import { CreateCatDto } from './dto/create-cat.dto'

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto.name)
  }

  @Get()
  async findAll(): Promise<CatDto[]> {
    return this.catsService.findAll()
  }
}
