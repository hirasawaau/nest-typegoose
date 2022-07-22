import { Provider } from '@nestjs/common'
import { getModelForClass } from '@typegoose/typegoose'
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types'
import { Connection } from 'mongoose'
import { getConnectionToken, getModelToken } from './typegoose.utils'

export function createTypegooseProvider(
  connectionName?: string,
  models: AnyParamConstructor<any>[] = [],
): Provider[] {
  return models.map((model) => ({
    provide: getModelToken(model.name, connectionName),
    useFactory: (connection: Connection) => {
      return getModelForClass(model, { existingConnection: connection })
    },
    inject: [getConnectionToken(connectionName)],
  })) as Provider[]
}
