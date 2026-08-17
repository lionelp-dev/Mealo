import { createHash, randomUUID } from 'node:crypto'

export function generateSeed(): number {
  return createHash('sha256').update(randomUUID()).digest().readUInt32BE(0)
}
