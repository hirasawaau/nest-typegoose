import { modelOptions, prop } from '@typegoose/typegoose'
import { Types } from 'mongoose'

@modelOptions({
  options: {
    customName: 'cats',
  },
})
export class CatModel {
  @prop({ auto: true })
  id: Types.ObjectId

  @prop()
  name: string
}
