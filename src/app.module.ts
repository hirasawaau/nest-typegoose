import { Module } from '@nestjs/common'
import { TypegooseModule } from '../lib'
import { CatsModule } from './cats/cats.module'

@Module({
  imports: [
    CatsModule,
    TypegooseModule.forRoot('mongodb://localhost:27017/test', {
      bufferCommands: false,
    }),
  ],
})
export class AppModule {}
