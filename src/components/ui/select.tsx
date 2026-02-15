import {
  Box,
  Button,
  Icon,
  IconButton,
  Input,
  InputGroup,
  Separator,
  Tag,
  Text,
} from '@chakra-ui/react'
import { useMultipleSelection, useSelect } from 'downshift'
import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { FaChevronDown, FaSearch, FaTimes } from 'react-icons/fa'
import type { ComponentProps, ReactNode } from 'react'

import { useColorModeValue } from '@/components/ui/color-mode'

export type SelectOption<T = unknown> = {
  data?: T
  label: string
  value: string
}

type BaseSelectProps<T> = {
  id?: string
  isMultiple?: boolean
  labelId?: string
  name?: string
  options?: Array<SelectOption<T>>
  placeholder?: string
  renderItem?: (
    item: SelectOption<T>,
    options?: { index: number; selected: boolean },
  ) => ReactNode
  search?: (
    search: string,
    options: Array<SelectOption<T>>,
  ) => Array<SelectOption<T>>
  searchable?: boolean
  variant?: ComponentProps<typeof Button>['variant']
}

type SingleSelectProps<T> = BaseSelectProps<T> & {
  isClearable?: false
  isMultiple?: false
  onChange?: (value: string) => void
  value?: string
}

type ClearableSingleSelectProps<T> = BaseSelectProps<T> & {
  isClearable: true
  isMultiple?: false
  onChange?: (value?: string) => void
  value?: string
}

type MultiSelectProps<T> = BaseSelectProps<T> & {
  isClearable?: false
  isMultiple: true
  onChange?: (values: Array<string>) => void
  value?: Array<string>
}

type ClearableMultiSelectProps<T> = BaseSelectProps<T> & {
  isClearable: true
  isMultiple: true
  onChange?: (values: Array<string>) => void
  value?: Array<string>
}

type SelectProps<T> =
  | SingleSelectProps<T>
  | ClearableSingleSelectProps<T>
  | MultiSelectProps<T>
  | ClearableMultiSelectProps<T>

const Select = <T,>(
  {
    id = undefined,
    labelId = undefined,
    name = undefined,
    options = [],
    placeholder = 'Bitte auswählen',
    renderItem = (item) => item.label,
    search,
    searchable = false,
    variant = 'outline',
    ...props
  }: SelectProps<T>,
  ref: React.Ref<HTMLButtonElement>,
) => {
  const [searchTerm, setSearchTerm] = useState('')
  const getFilteredOptions = () => {
    let possibleOptions = props.isMultiple
      ? options.filter(
          (option) =>
            !selectedItems.find(
              (selectedItem) => selectedItem === option.value,
            ),
        )
      : options

    if (searchable) {
      if (search) {
        possibleOptions = search(searchTerm, possibleOptions)
      } else {
        possibleOptions = possibleOptions.filter((option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }
    }

    return possibleOptions
  }

  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    reset,
    selectedItems,
    setSelectedItems,
  } = useMultipleSelection<string>({
    onSelectedItemsChange: ({
      selectedItems: nextSelectedItems = [],
      type,
    }) => {
      if (
        type !==
          useMultipleSelection.stateChangeTypes.FunctionSetSelectedItems &&
        props.onChange
      ) {
        if (props.isMultiple) {
          props.onChange(nextSelectedItems)
        } else {
          props.onChange(nextSelectedItems[0])
        }
      }
    },
  })

  useEffect(() => {
    setSelectedItems(
      props.value ? (props.isMultiple ? [...props.value] : [props.value]) : [],
    )
  }, [props.isMultiple, props.value, setSelectedItems])

  const {
    closeMenu,
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
    highlightedIndex,
    openMenu,
    setHighlightedIndex,
  } = useSelect({
    defaultHighlightedIndex: props.isMultiple ? 0 : undefined,
    items: getFilteredOptions(),
    itemToString: (item) => item?.label || String(item),
    labelId: labelId,
    onIsOpenChange: (changes) => {
      if (changes.isOpen) {
        searchInputElementRef.current?.focus()
        openMenu()
      } else {
        setSearchTerm('')
      }
    },
    onStateChange: ({ type, selectedItem }) => {
      switch (type) {
        case useSelect.stateChangeTypes.ToggleButtonKeyDownEnter:
        case useSelect.stateChangeTypes.ToggleButtonKeyDownSpaceButton:
        case useSelect.stateChangeTypes.ItemClick:
          if (selectedItem) {
            selectItem(selectedItem.value)
          }
          break
        default:
          break
      }
    },
    selectedItem: null,
    toggleButtonId: id,
  })

  const searchInputElementRef = useRef<HTMLInputElement>(null)

  const listBgColor = useColorModeValue('white', 'gray.900')
  const highlightBgColor = useColorModeValue('blue.500', 'blue.700')
  const highlightTextColor = useColorModeValue('white', 'white')

  const highlight = (item: SelectOption<T>, index: number) =>
    highlightedIndex === index ||
    selectedItems.find((selectedItem) => selectedItem === item.value)

  const buttonText = props.isMultiple
    ? selectedItems.length === 0
      ? placeholder
      : ''
    : selectedItems.length
      ? getLabel(selectedItems[0], options)
      : placeholder

  const handleClear = () => {
    reset()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown': {
        setHighlightedIndex(highlightedIndex + 1)
        break
      }

      case 'ArrowUp': {
        setHighlightedIndex(highlightedIndex - 1)
        break
      }

      case 'Enter': {
        const filteredOptions = getFilteredOptions()
        selectItem(filteredOptions[highlightedIndex].value)
        closeMenu()
        break
      }

      case 'Escape':
      case 'Tab': {
        closeMenu()
        break
      }
    }
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.currentTarget.value)
    if (highlightedIndex === -1) {
      setHighlightedIndex(0)
    }
  }

  const selectItem = (value: string) => {
    if (!props.isMultiple) {
      reset()
    }

    addSelectedItem(value)
  }

  return (
    <Box position="relative" width="full">
      <InputGroup
        alignItems="center"
        endElement={
          props.isClearable && selectedItems.length > 0 ? (
            <Box alignItems="center" display="flex">
              <IconButton
                aria-label="Auswahl löschen"
                display="inline-flex"
                onClick={handleClear}
                pointerEvents="all"
                size="xs"
                variant="plain"
              >
                <Icon as={FaTimes} color="gray.500" />
              </IconButton>
              <Icon as={FaChevronDown} color="gray.500" />
            </Box>
          ) : (
            <Icon as={FaChevronDown} color="gray.500" />
          )
        }
        endElementProps={{ css: { pointerEvents: 'none' } }}
      >
        <Button
          alignItems="center"
          display="flex"
          flexWrap="wrap"
          height="fit-content"
          justifyContent="flex-start"
          minHeight={10}
          name={name}
          pr={props.isClearable ? 16 : 10}
          type="button"
          variant={variant}
          width="full"
          {...getToggleButtonProps(
            getDropdownProps({ preventKeyAction: isOpen, ref: ref }),
          )}
        >
          {props.isMultiple && (
            <Box role="list">
              {selectedItems.map((selectedItem, index) => (
                <Tag.Root
                  aria-label={getLabel(selectedItem, options)}
                  colorPalette="brand"
                  key={selectedItem}
                  marginRight={1}
                  marginY={1}
                  role="listitem"
                  size="sm"
                  {...getSelectedItemProps({ selectedItem, index })}
                >
                  <Tag.Label>{getLabel(selectedItem, options)}</Tag.Label>
                  <Tag.EndElement>
                    <Tag.CloseTrigger
                      aria-label="Entfernen"
                      as="span"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeSelectedItem(selectedItem)
                      }}
                      role="button"
                      type="button"
                    />
                  </Tag.EndElement>
                </Tag.Root>
              ))}
            </Box>
          )}
          <Text lineClamp={1} textAlign="left">
            {buttonText}
          </Text>
        </Button>
      </InputGroup>
      <Box
        bgColor={listBgColor}
        borderWidth={1}
        marginTop={1}
        position="absolute"
        rounded="sm"
        shadow="md"
        width="full"
        zIndex={20}
        {...getMenuProps({ hidden: !isOpen })}
      >
        {isOpen && (
          <>
            {searchable && (
              <>
                <Box px={4} py={3}>
                  <InputGroup
                    startElement={
                      <Icon
                        as={FaSearch}
                        color="gray.500"
                        pointerEvents="none"
                      />
                    }
                  >
                    <Input
                      aria-label="Suchen"
                      autoComplete="off"
                      onChange={handleSearch}
                      onKeyDown={handleKeyDown}
                      placeholder="Suchen"
                      ref={searchInputElementRef}
                      tabIndex={-1}
                      value={searchTerm}
                    />
                  </InputGroup>
                </Box>
                <Separator />
              </>
            )}
            <Box as="ul" listStyleType="none" maxHeight={48} overflowY="auto">
              {getFilteredOptions().length === 0 ? (
                <Box as="li" px={4} py={2}>
                  Keine Einträge
                </Box>
              ) : (
                getFilteredOptions().map((item, index) => (
                  <Box
                    as="li"
                    bgColor={
                      highlight(item, index) ? highlightBgColor : 'inherit'
                    }
                    highlightTextColor
                    color={highlight(item, index) ? 'white' : 'inherit'}
                    key={item.value}
                    px={4}
                    py={3}
                    {...getItemProps({ item, index })}
                  >
                    {renderItem(item, {
                      index: index,
                      selected: highlight(item, index) === true,
                    })}
                  </Box>
                ))
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}

const getLabel = <T,>(value: string, options: Array<SelectOption<T>>) => {
  return options.find((option) => option.value === value)?.label ?? ''
}

export default forwardRef(Select) as <T>(
  props: SelectProps<T> & { ref?: React.Ref<HTMLButtonElement> },
) => React.ReactElement
