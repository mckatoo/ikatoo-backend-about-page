import { randomBytes } from 'crypto'

export const generateString = (size = 20) => {
  return randomBytes(size).toString('hex')
}

interface Options {
  min: number
  max: number
}

export const generateNumber = (options?: Options) => {
  if (options != null) {
    const { max, min } = options
    return Math.floor(Math.random() * (max - min) + min)
  }
  return Math.floor(Math.random() * 10)
}
