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


