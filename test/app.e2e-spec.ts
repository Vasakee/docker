import {Test} from "@nestjs/testing"
import * as pactum from 'pactum'
import { AppModule } from "../src/app.module"
import { INestApplication, ValidationPipe } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "src/auth/dto";


describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
     app = moduleRef.createNestApplication()
     app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
     )
     await app.init()
     await app.listen(3333)

     prisma = app.get(PrismaService)

     await prisma.cleanDb()

     pactum.request.setBaseUrl('http://localhost:3333')
  })
   afterAll(() => {
    app.close()
   });

   describe('Auth', () => {
    const dto: AuthDto ={
      email: 'basildayigil@gmail.com',
      password: '1234'
    }
    describe('SignUp', () => {
      it('should throw if email empty', () => {
        return pactum
        .spec()
        .post('/auth/signup',)
        .withBody( dto )
        .expectStatus(400)
        .inspect()
      })
      it('should throw if password empty', () => {
        return pactum
        .spec()
        .post('/auth/signup',)
        .withBody({
          email: dto.email
        } )
        .expectStatus(400)
        .inspect()
      })
      it('should throw if nobody provided', () => {
        return pactum
        .spec()
        .post('/auth/signup',)
        .expectStatus(400)
        .inspect()
      })
     it('should signup', () => {
      return pactum
      .spec()
      .post('/auth/signup',)
      .withBody( dto )
      .expectStatus(201)
      .inspect()
      .stores('usersAt', 'access_token')
     })
    })
  
    describe('SignIn', () => {
      it('should throw if email empty', () => {
        return pactum
        .spec()
        .post('/auth/signin',)
        .withBody( dto )
        .expectStatus(400)
        .inspect()
      })
      it('should throw if password empty', () => {
        return pactum
        .spec()
        .post('/auth/signin',)
        .withBody({
          email: dto.email
        } )
        .expectStatus(400)
        .inspect()
      })
      it('should throw if nobody provided', () => {
        return pactum
        .spec()
        .post('/auth/signin',)
        .expectStatus(400)
        .inspect()
      })
      it('should signin', () =>{
        return pactum 
        .spec()
        .post('auth/signin')
        .withBody(dto)
        .expectStatus(201)
        .stores('usersAt', 'access_token')
      })
    })
  })
  
  describe('User', ()=> {
    describe('Get me', ()=> {
      it('should get current user', () => {
        return pactum
        .spec()
        .get('/users/me')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        })
        .expectStatus(200)
      })
    })
    
    describe('Edit user', () =>{
      
    })
  })

  describe('Bookmarks', () => {
    describe('Create Bookmarks', () =>{

    })

    describe('Get Bookmarks', () => {

    })

    describe('Get Bookmark by id', ()=>{

    })

    describe('Edit Bookmark', () =>{

    })

    describe('Delete Bookmark', () =>{

    })
  })
})
