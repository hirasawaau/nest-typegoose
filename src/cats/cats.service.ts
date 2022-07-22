import { Injectable } from '@nestjs/common'
import { ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from '../../lib'
import { CatModel } from './cat.model'

@Injectable()
export class CatsService {
  constructor(
    @InjectModel(CatModel)
    private readonly catModel: ReturnModelType<typeof CatModel>,
  ) {}

  create(name: string) {
    return this.catModel.create({ name })
  }

  findAll() {
    return this.catModel.find().exec()
  }
}
