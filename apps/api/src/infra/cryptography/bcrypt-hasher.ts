import { HashComparer } from '@/domain/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/cryptography/hash-generator'

import { compare, hash } from 'bcryptjs'

export class BcryptHasher implements HashGenerator, HashComparer {
  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }

  hash(plain: string): Promise<string> {
    return hash(plain, 8)
  }
}
