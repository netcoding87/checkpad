import { Field as ChakraField } from '@chakra-ui/react'
import type { ReactNode } from 'react'

export interface FieldProps {
  children: ReactNode
  errorText?: string
  helperText?: string
  invalid?: boolean
  label?: string
  required?: boolean
}

export function Field({
  children,
  errorText,
  helperText,
  invalid,
  label,
  required,
}: FieldProps) {
  return (
    <ChakraField.Root invalid={invalid} required={required}>
      {label && <ChakraField.Label>{label}</ChakraField.Label>}
      {children}
      {helperText && (
        <ChakraField.HelperText>{helperText}</ChakraField.HelperText>
      )}
      {errorText && <ChakraField.ErrorText>{errorText}</ChakraField.ErrorText>}
    </ChakraField.Root>
  )
}
