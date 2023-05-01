import { Logger } from '@nestjs/common'
import {
  delay,
  Observable,
  ObservableInput,
  retry,
  retryWhen,
  scan,
} from 'rxjs'
import { TypegooseConstant } from './typegoose.constant'

export function getModelToken(model: string, connectionName?: string) {
  if (connectionName === undefined) {
    return `${model}Model`
  }
  return `${getConnectionToken(connectionName)}/${model}Model`
}

export function getConnectionToken(name?: string) {
  return name && name !== TypegooseConstant.DEFAULT_DB_CONNECTION
    ? `${name}Connection`
    : TypegooseConstant.DEFAULT_DB_CONNECTION
}

export function handleRetry(
  retryAttempts = 9,
  retryDelay = 3000,
): <T>(source: Observable<T>) => Observable<T> {
  const logger = new Logger('TypegooseModule')

  return <T>(source: Observable<T>) =>
    source.pipe(
      retryWhen((e) =>
        e.pipe(
          scan((errorCount, error) => {
            logger.error(
              `Unable to connect to the database. Retrying (${
                errorCount + 1
              })...`,
              '',
            )
            if (errorCount + 1 >= retryAttempts) {
              throw error
            }
            return errorCount + 1
          }, 0),
          delay(retryDelay),
        ),
      ),
    )
}
