import { Module } from '@nestjs/common'
import { TypegooseModule } from '../../../lib'
import { CatModel } from './cat.model'
import { CatsController } from './cats.controller'
import { CatsService } from './cats.service'

@Module({
  imports: [TypegooseModule.forFeature([CatModel])],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
