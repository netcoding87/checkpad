import { auditLogTable, maintenanceCasesTable } from './schema'

describe('Database Schema', () => {
  describe('maintenanceCases table', () => {
    it('exports maintenanceCases table definition', () => {
      expect(maintenanceCasesTable).toBeDefined()
    })

    it('has all required columns', () => {
      const columns = Object.keys(maintenanceCasesTable)
      expect(columns).toContain('id')
      expect(columns).toContain('name')
      expect(columns).toContain('estimatedHours')
      expect(columns).toContain('estimatedCosts')
      expect(columns).toContain('plannedStart')
      expect(columns).toContain('plannedEnd')
      expect(columns).toContain('offerCreatedBy')
      expect(columns).toContain('offerCreatedAt')
      expect(columns).toContain('offerAcceptedAt')
      expect(columns).toContain('invoiceCreatedBy')
      expect(columns).toContain('invoiceCreatedAt')
      expect(columns).toContain('invoicePaidAt')
      expect(columns).toContain('createdAt')
      expect(columns).toContain('updatedAt')
    })
  })

  describe('auditLog table', () => {
    it('exports auditLog table definition', () => {
      expect(auditLogTable).toBeDefined()
    })

    it('has all required columns', () => {
      const columns = Object.keys(auditLogTable)
      expect(columns).toContain('id')
      expect(columns).toContain('tableName')
      expect(columns).toContain('recordId')
      expect(columns).toContain('columnName')
      expect(columns).toContain('oldValue')
      expect(columns).toContain('newValue')
      expect(columns).toContain('changedBy')
      expect(columns).toContain('changedAt')
    })
  })
})
