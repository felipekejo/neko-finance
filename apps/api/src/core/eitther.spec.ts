import { Either, left, right } from './either'

describe('Either', () => {
  function doSomething(shouldSuccess: boolean): Either<string, number> {
    if (shouldSuccess) {
      return right(10)
    } else {
      return left('Error')
    }
  }

  it('should have a success value', () => {
    const successResult = doSomething(true)

    expect(successResult.isRight()).toBe(true)
    expect(successResult.isLeft()).toBe(false)
  })

  it('should have a error value', () => {
    const errorResult = doSomething(false)

    expect(errorResult.isRight()).toBe(false)

    expect(errorResult.isLeft()).toBe(true)
  })
})
