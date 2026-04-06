import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hash'
import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { AuthenticateUserUseCase } from './authenticate'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: AuthenticateUserUseCase
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateUserUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate an user', async () => {
    const user = makeUser({
      password: await fakeHasher.hash('123456'),
      email: 'john.doe@example.com',
    })

    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
