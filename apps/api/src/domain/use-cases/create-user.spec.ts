import { FakeHasher } from 'test/cryptography/fake-hash'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { CreateUserUseCase } from './create-user'
import { UserAlreadyExistError } from './errors/user-already-exist-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: CreateUserUseCase
let fakeHasher: FakeHasher

describe('Create User Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    sut = new CreateUserUseCase(inMemoryUsersRepository, fakeHasher)
  })

  it('should be able to create an user', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
      role: 'CLIENT',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.items[0],
    })
  })
  it('should hash user password', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
      role: 'CLIENT',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword)
  })

  it('should not be able to create an user if the email already exists', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
      role: 'CLIENT',
    })
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
      role: 'CLIENT',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistError)
  })
})
