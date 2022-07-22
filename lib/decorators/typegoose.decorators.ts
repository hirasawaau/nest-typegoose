import { Inject } from '@nestjs/common'
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types'
import { getConnectionToken, getModelToken } from '../typegoose.utils'

export const InjectModel = (model: AnyParamConstructor<any>) =>
  Inject(getModelToken(model.name))

export const InjectConnection = (connectionName?: string) =>
  Inject(getConnectionToken(connectionName))
