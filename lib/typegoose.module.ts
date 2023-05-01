import { DynamicModule, Module } from '@nestjs/common'
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types'
import { MongooseOptions } from 'mongoose'
import {
  TypegooseModuleAsyncOptions,
  TypegooseModuleOptions,
} from './interfaces/typegoose-options.interface'
import { TypegooseCoreModule } from './typegoose-core.module'
import { createTypegooseProvider as createTypegooseProviders } from './typegoose.provider'

@Module({})
export class TypegooseModule {
  static forRoot(uri: string, options?: TypegooseModuleOptions): DynamicModule {
    return {
      module: TypegooseModule,
      imports: [TypegooseCoreModule.forRoot(uri, options)],
    }
  }

  static forRootAsync(options: TypegooseModuleAsyncOptions): DynamicModule {
    return {
      module: TypegooseModule,
      imports: [TypegooseCoreModule.forRootAsync(options)],
    }
  }

  static forFeature(
    models: AnyParamConstructor<any>[] = [],
    connectionName?: string,
  ): DynamicModule {
    const providers = createTypegooseProviders(connectionName, models)
    return {
      module: TypegooseModule,
      providers,
      exports: providers,
    }
  }
}
