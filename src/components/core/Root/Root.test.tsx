import { RootDocument } from './Root'

describe('RootDocument', () => {
  it('is a function component', () => {
    expect(typeof RootDocument).toBe('function')
  })

  it('exports the RootDocument component', () => {
    expect(RootDocument).toBeDefined()
  })
})
