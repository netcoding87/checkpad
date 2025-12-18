import { url } from './url'

describe('URL utilities', () => {
  describe('url function', () => {
    it('creates absolute URL with window origin', () => {
      const result = url('/api/maintenance-cases')
      expect(result).toMatch(/^https?:\/\//)
      expect(result).toContain('/api/maintenance-cases')
    })

    it('creates proper URL with protocol and origin', () => {
      const result = url('/test')
      expect(result).toMatch(/^https?:\/\//)
      expect(result).toContain('/test')
    })

    it('handles paths without leading slash', () => {
      const result = url('test')
      expect(result).toBeTruthy()
      expect(result).toMatch(/^https?:\/\//)
    })

    it('creates valid URL objects', () => {
      const result = url('/maintenance-cases')
      // Should be a valid URL
      expect(() => new URL(result)).not.toThrow()
    })
  })
})
