import { ModuleMetadata, Type } from '@nestjs/common'
import { ConnectOptions } from 'mongoose'

export interface TypegooseModuleOptions
  extends ConnectOptions,
    Record<string, any> {
  uri?: string
  retryAttempts?: number
  retryDelay?: number
  connectionName?: string
  connectionFactory?: (connection: any, name: string) => any
}

export interface TypegooseOptionsFactory {
  createTypegooseOptions():
    | TypegooseModuleOptions
    | Promise<TypegooseModuleOptions>
}

export type TypegooseModuleFactoryOptions = Omit<
  TypegooseModuleOptions,
  'connectionName'
>

export interface TypegooseModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  connectionName?: string
  useExisting?: Type<TypegooseOptionsFactory>
  useClass?: Type<TypegooseOptionsFactory>
  useFactory?: (...args: any[]) => Promise<TypegooseModuleFactoryOptions>
  inject?: any[]
}
