# nest-typegoose
Nestjs' wrapper for `@typegoose/typegoose` that inspired from [@nestjs/mongoose](https://github.com/nestjs/mongoose)

## Example
### Initialize Module


```typescript
// app.module.ts
import { TypegooseModule } from 'nest-typegoose'

@Module({
  import: [ 
    TypegooseModule.forRoot('mongodb://<your-uri>' , options)
  ]
})
export class AppModule {}
```

### Model Injection

#### Model Example
```typescript
// cat.model.ts
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
```

#### Initialize Model to Module 
```typescript
// cat.module.ts
import { Module } from '@nestjs/common'
import { CatModel } from './cat.model'

@Module({
  imports: [TypegooseModule.forFeature([CatModel])],
  provider: [...],
  exports: [...],
})
export class CatModule {}
```

#### Inject Model to Service
```typescript
import { Injectable } from '@nestjs/common'
import { CatModel } from './cat.model'
import { InjectModel } from 'nest-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'

@Injectable()
export class CatService {
  constructor(@InjectModel(CatModel) private readonly catModel: ReturnModelType<typeof CatModel>) {}

  ...
}
```

```