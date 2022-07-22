import {
  DynamicModule,
  Global,
  Inject,
  Logger,
  Module,
  OnApplicationShutdown,
  Provider,
  Type,
} from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import mongoose, { Connection, MongooseOptions } from 'mongoose'
import { defer, lastValueFrom } from 'rxjs'
import {
  TypegooseModuleAsyncOptions,
  TypegooseModuleOptions,
  TypegooseOptionsFactory,
} from './interfaces/typegoose-options.interface'
import { TypegooseConstant } from './typegoose.constant'
import { getConnectionToken, handleRetry } from './typegoose.utils'

@Module({})
@Global()
export class TypegooseCoreModule implements OnApplicationShutdown {
  private static readonly logger = new Logger('TypegooseModule')
  constructor(
    @Inject(TypegooseConstant.TYPEGOOSE_CONNECTION_NAME)
    private readonly connectionName: string,
    private readonly moduleRef: ModuleRef,
  ) {}
  static forRoot(
    uri: string,
    options: TypegooseModuleOptions = {},
  ): DynamicModule {
    const {
      retryAttempts,
      retryDelay,
      connectionName,
      connectionFactory,
      ...mongooseOptions
    } = options

    const typegooseConnectionFactory =
      connectionFactory || ((connection) => connection)

    const typegooseConnectionName = getConnectionToken(connectionName)

    const typegooseConnectionNameProvider = {
      provide: TypegooseConstant.TYPEGOOSE_CONNECTION_NAME,
      useValue: typegooseConnectionName,
    }

    const connectionProvider = {
      provide: typegooseConnectionName,
      useFactory: async () =>
        await lastValueFrom(
          defer(async () =>
            typegooseConnectionFactory(
              await mongoose.createConnection(uri, mongooseOptions).asPromise(),
              typegooseConnectionName,
            ),
          ).pipe(handleRetry(retryAttempts, retryDelay)),
        ).then((connection: any) => {
          this.logger.log(`options: ${JSON.stringify(mongooseOptions)}`)
          return connection
        }),
    }

    return {
      module: TypegooseCoreModule,
      providers: [connectionProvider, typegooseConnectionNameProvider],
      exports: [connectionProvider],
    }
  }

  static forRootAsync(options: TypegooseModuleAsyncOptions): DynamicModule {
    const typegooseConnectionName = getConnectionToken(options.connectionName)

    const typegooseConnectionNameProvider = {
      provide: TypegooseConstant.TYPEGOOSE_CONNECTION_NAME,
      useValue: typegooseConnectionName,
    }

    const connectionProvider = {
      provide: typegooseConnectionName,
      async useFactory(
        typegooseModuleOptions: TypegooseModuleOptions,
      ): Promise<any> {
        const {
          retryAttempts,
          retryDelay,
          connectionName,
          connectionFactory,
          uri,
          ...mongooseOptions
        } = typegooseModuleOptions

        const typegooseConnectionFactory =
          connectionFactory || ((connection) => connection)

        return lastValueFrom(
          defer(async () =>
            typegooseConnectionFactory(
              await mongoose.createConnection(uri, mongooseOptions).asPromise(),
              connectionName,
            ),
          ).pipe(handleRetry(retryAttempts, retryDelay)),
        )
      },
      inject: [TypegooseConstant.TYPEGOOSE_MODULE_OPTIONS],
    }

    const asyncProviders = this.createAsyncProvider(options)
    return {
      module: TypegooseCoreModule,
      imports: options.imports,
      providers: [
        ...asyncProviders,
        connectionProvider,
        typegooseConnectionNameProvider,
      ],
      exports: [connectionProvider],
    }
  }

  private static createAsyncProvider(
    options: TypegooseModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionProvider(options)]
    }

    const useClass = options.useClass as Type<TypegooseOptionsFactory>

    return [
      this.createAsyncOptionProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ]
  }

  private static createAsyncOptionProvider(
    options: TypegooseModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: TypegooseConstant.TYPEGOOSE_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      }
    }

    const inject = [
      (options.useClass ||
        options.useExisting) as Type<TypegooseOptionsFactory>,
    ]

    return {
      provide: TypegooseConstant.TYPEGOOSE_MODULE_OPTIONS,
      useFactory(optionsFactory: TypegooseOptionsFactory) {
        return optionsFactory.createTypegooseOptions()
      },
      inject,
    }
  }

  async onApplicationShutdown() {
    const connection = this.moduleRef.get<Connection>(this.connectionName)
    connection && (await connection.close())
  }
}
