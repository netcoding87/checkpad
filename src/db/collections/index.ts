import { snakeCamelMapper } from '@electric-sql/client'
import { electricCollectionOptions } from '@tanstack/electric-db-collection'
import { createCollection } from '@tanstack/react-db'
import { createSchemaFactory } from 'drizzle-zod'
import { z } from 'zod'
import { maintenanceCasesTable } from '../schema'
import { url } from '@/utils/url'

const { createSelectSchema } = createSchemaFactory({ zodInstance: z })

const MaintenanceCaseSchema = createSelectSchema(maintenanceCasesTable, {})

export type MaintenanceCase = z.infer<typeof MaintenanceCaseSchema>

export const maintenanceCasesCollection = createCollection(
  electricCollectionOptions({
    getKey: (item) => item.id,
    shapeOptions: {
      columnMapper: snakeCamelMapper(),
      onError: (error) => {
        console.error('Error fetching maintenance cases:', error)
      },
      parser: {
        timestamp: (date: string) => new Date(date),
        timestamptz: (date: string) => new Date(date),
      },
      url: url('/api/maintenance-cases'),
    },
    schema: MaintenanceCaseSchema,
  }),
)
