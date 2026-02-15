import { snakeCamelMapper } from '@electric-sql/client'
import { electricCollectionOptions } from '@tanstack/electric-db-collection'
import { createCollection } from '@tanstack/react-db'
import { createSchemaFactory } from 'drizzle-zod'
import { z } from 'zod'
import {
  maintenanceCaseStaffTable,
  maintenanceCasesTable,
  staffTable,
} from '../schema'
import { url } from '@/utils/url'

const { createSelectSchema } = createSchemaFactory({ zodInstance: z })

const MaintenanceCaseSchema = createSelectSchema(maintenanceCasesTable, {})

export type MaintenanceCase = z.infer<typeof MaintenanceCaseSchema>

const StaffSchema = createSelectSchema(staffTable, {})

export type Staff = z.infer<typeof StaffSchema>

const MaintenanceCaseStaffSchema = createSelectSchema(
  maintenanceCaseStaffTable,
  {},
)

export type MaintenanceCaseStaff = z.infer<typeof MaintenanceCaseStaffSchema>

export const maintenanceCasesCollection = createCollection(
  electricCollectionOptions({
    getKey: (item) => item.id,
    onDelete: async ({ transaction }) => {
      const deletedItem = transaction.mutations[0].original

      const response = await fetch('/api/maintenance-cases', {
        body: JSON.stringify({ id: deletedItem.id }),
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE',
      })

      const { txid } = await response.json()

      // Return txid to wait for sync
      return { txid }
    },
    onInsert: async ({ transaction }) => {
      const newItem = transaction.mutations[0].modified

      const response = await fetch('/api/maintenance-cases', {
        body: JSON.stringify(newItem),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      const { txid } = await response.json()

      // Return txid to wait for sync
      return { txid }
    },
    onUpdate: async ({ transaction }) => {
      const { original, modified } = transaction.mutations[0]

      const { id: _discardId, ...updates } = modified
      const response = await fetch('/api/maintenance-cases', {
        body: JSON.stringify({ id: original.id, ...updates }),
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
      })

      const { txid } = await response.json()

      // Return txid to wait for sync
      return { txid }
    },
    shapeOptions: {
      columnMapper: snakeCamelMapper(),
      onError: (error) => {
        console.error('Error fetching maintenance cases:', error)
      },
      parser: {
        timestamp: (date: string) => new Date(date),
        timestamptz: (date: string) => new Date(date),
      },
      url: url('/api/electric/maintenance-cases'),
    },
    schema: MaintenanceCaseSchema,
  }),
)

export const maintenanceCaseStaffAssignmentsCollection = createCollection(
  electricCollectionOptions({
    getKey: (item) => item.id,
    onDelete: async ({ transaction }) => {
      const deletedItem = transaction.mutations[0].original

      const response = await fetch('/api/maintenance-case-staff', {
        body: JSON.stringify({ id: deletedItem.id }),
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE',
      })

      const { txid } = await response.json()
      return { txid }
    },
    onInsert: async ({ transaction }) => {
      const newItem = transaction.mutations[0].modified

      const response = await fetch('/api/maintenance-case-staff', {
        body: JSON.stringify(newItem),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      const { txid } = await response.json()
      return { txid }
    },
    onUpdate: async ({ transaction }) => {
      const { original, modified } = transaction.mutations[0]

      const { id: _discardId, ...updates } = modified
      const response = await fetch('/api/maintenance-case-staff', {
        body: JSON.stringify({ id: original.id, ...updates }),
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
      })

      const { txid } = await response.json()
      return { txid }
    },
    shapeOptions: {
      columnMapper: snakeCamelMapper(),
      onError: (error) => {
        console.error(
          'Error fetching maintenance case staff assignments:',
          error,
        )
      },
      parser: {
        timestamp: (date: string) => new Date(date),
        timestamptz: (date: string) => new Date(date),
      },
      url: url('/api/electric/maintenance-case-staff'),
    },
    schema: MaintenanceCaseStaffSchema,
  }),
)

export const staffCollection = createCollection(
  electricCollectionOptions({
    getKey: (item) => item.id,
    onDelete: async ({ transaction }) => {
      const deletedItem = transaction.mutations[0].original

      const response = await fetch('/api/staff', {
        body: JSON.stringify({ id: deletedItem.id }),
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE',
      })

      const { txid } = await response.json()

      // Return txid to wait for sync
      return { txid }
    },
    onInsert: async ({ transaction }) => {
      const newItem = transaction.mutations[0].modified

      const response = await fetch('/api/staff', {
        body: JSON.stringify(newItem),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      const { txid } = await response.json()

      // Return txid to wait for sync
      return { txid }
    },
    onUpdate: async ({ transaction }) => {
      const { original, modified } = transaction.mutations[0]

      const { id: _discardId, ...updates } = modified
      const response = await fetch('/api/staff', {
        body: JSON.stringify({ id: original.id, ...updates }),
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
      })

      const { txid } = await response.json()

      // Return txid to wait for sync
      return { txid }
    },
    shapeOptions: {
      columnMapper: snakeCamelMapper(),
      onError: (error) => {
        console.error('Error fetching staff:', error)
      },
      parser: {
        timestamp: (date: string) => new Date(date),
        timestamptz: (date: string) => new Date(date),
      },
      url: url('/api/electric/staff'),
    },
    schema: StaffSchema,
  }),
)

export const maintenanceCaseStaffCollection = createCollection(
  electricCollectionOptions({
    getKey: (item) => item.id,
    shapeOptions: {
      columnMapper: snakeCamelMapper(),
      onError: (error) => {
        console.error(
          'Error fetching maintenance case staff assignments:',
          error,
        )
      },
      parser: {
        timestamp: (date: string) => new Date(date),
        timestamptz: (date: string) => new Date(date),
      },
      url: url('/api/electric/maintenance-case-staff'),
    },
    schema: MaintenanceCaseStaffSchema,
  }),
)
