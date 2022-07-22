import { INestApplication } from '@nestjs/common'
import { Server } from 'http'
import { Test } from '@nestjs/testing'
import { AppModule } from '../../src/app.module'
import * as request from 'supertest'

jest.setTimeout(10000)

describe('Mongoose Connection', () => {
  let server: Server
  let app: INestApplication

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = module.createNestApplication()
    server = app.getHttpServer()
    await app.init()
  })

  it(`should return created document`, (done) => {
    const createDto = { name: 'Nest' }
    request(server)
      .post('/cats')
      .send(createDto)
      .expect(201)
      .end((err, { body }) => {
        expect(body.name).toEqual(createDto.name)
        done()
      })
  })

  afterEach(async () => {
    await app.close()
  })
})
