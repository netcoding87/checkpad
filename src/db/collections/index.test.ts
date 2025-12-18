import { maintenanceCasesCollection } from './index'
import type { MaintenanceCase } from './index'

describe('DB Collections', () => {
  describe('maintenanceCasesCollection', () => {
    it('exports maintenanceCasesCollection', () => {
      expect(maintenanceCasesCollection).toBeDefined()
    })
  })

  describe('MaintenanceCase type', () => {
    it('MaintenanceCase type is inferred from schema', () => {
      const testCase: MaintenanceCase = {
        id: '123',
        name: 'Test',
        estimatedHours: null,
        estimatedCosts: null,
        plannedStart: null,
        plannedEnd: null,
        offerCreatedBy: null,
        offerCreatedAt: null,
        offerAcceptedAt: null,
        invoiceCreatedBy: null,
        invoiceCreatedAt: null,
        invoicePaidAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      expect(testCase.id).toBe('123')
      expect(testCase.name).toBe('Test')
    })
  })
})
