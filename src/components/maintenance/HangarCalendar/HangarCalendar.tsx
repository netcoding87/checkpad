import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  IconButton,
  Skeleton,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import { gte, lte, useLiveQuery } from '@tanstack/react-db'
import { Link } from '@tanstack/react-router'
import { AlertCircle, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { MaintenanceCase } from '@/db/collections'
import {
  maintenanceCaseStaffCollection,
  maintenanceCasesCollection,
  staffCollection,
} from '@/db/collections'
import { Tooltip } from '@/components/ui/tooltip'
import { useColorModeValue } from '@/components/ui/color-mode'

const DAY_MS = 24 * 60 * 60 * 1000
const COLOR_PALETTE = [
  '#0ea5e9',
  '#6366f1',
  '#22c55e',
  '#f97316',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#84cc16',
]

type MonthInfo = {
  days: number
  monthIndex: number
  name: string
}

type CaseRange = {
  endIndex: number
  startIndex: number
}

type CalendarCase = MaintenanceCase & {
  color: string
  endDate: Date | null
  range: CaseRange | null
  startDate: Date | null
}

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

const buildMonths = (year: number): Array<MonthInfo> =>
  Array.from({ length: 12 }, (_, monthIndex) => {
    const monthStart = new Date(year, monthIndex, 1)
    const monthName = new Intl.DateTimeFormat('de-DE', {
      month: 'long',
    }).format(monthStart)
    const days = new Date(year, monthIndex + 1, 0).getDate()
    return { days, monthIndex, name: monthName }
  })

const isWeekend = (date: Date) => {
  const day = date.getDay()
  return day === 0 || day === 6
}

const dayIndexInYear = (date: Date, year: number) => {
  const yearStart = new Date(year, 0, 1)
  return Math.floor((startOfDay(date).getTime() - yearStart.getTime()) / DAY_MS)
}

const clampRangeToYear = (
  start: Date,
  end: Date,
  year: number,
): CaseRange | null => {
  const yearStart = new Date(year, 0, 1)
  const yearEnd = new Date(year, 11, 31, 23, 59, 59, 999)

  if (end < yearStart || start > yearEnd) return null

  const effectiveStart = start < yearStart ? yearStart : start
  const effectiveEnd = end > yearEnd ? yearEnd : end

  return {
    startIndex: dayIndexInYear(effectiveStart, year),
    endIndex: dayIndexInYear(effectiveEnd, year),
  }
}

const colorForId = (id: string) => {
  let hash = 0
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash << 5) - hash + id.charCodeAt(i)
    hash |= 0
  }
  const index = Math.abs(hash) % COLOR_PALETTE.length
  return COLOR_PALETTE[index]
}

export function HangarCalendar() {
  const today = useMemo(() => new Date(), [])
  const currentYear = today.getFullYear()
  const [year, setYear] = useState(currentYear)

  const columnWidth = useBreakpointValue({ base: 28, md: 32, lg: 36 }) ?? 32
  const caseRowHeight = useBreakpointValue({ base: 40, md: 44 }) ?? 44
  const monthRowHeight = 34
  const dayRowHeight = 36

  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const weekendBg = useColorModeValue('gray.50', 'gray.800')
  const todayBg = useColorModeValue('cyan.50', 'cyan.900')
  const headerBg = useColorModeValue('white', 'gray.900')

  const { data: maintenanceCases = [], isLoading } = useLiveQuery(
    (q) =>
      // .where(({ case: c }) => gte(c.plannedEnd, new Date(year, 0, 1))),
      q
        .from({ case: maintenanceCasesCollection })
        .where(({ case: c }) => gte(c.plannedStart, new Date(`${year}-01-01`)))
        .where(({ case: c }) => lte(c.plannedEnd, new Date(`${year}-12-31`))),
    [year],
  )

  const { data: assignments = [] } = useLiveQuery(
    maintenanceCaseStaffCollection,
  )
  const { data: staff = [] } = useLiveQuery(staffCollection)

  // Create a map of case IDs to assignment counts
  const assignmentCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const assignment of assignments) {
      counts[assignment.caseId] = (counts[assignment.caseId] || 0) + 1
    }
    return counts
  }, [assignments])

  // Create a map of case IDs to staff names
  const assignedStaffNames = useMemo(() => {
    const names: Record<string, Array<string>> = {}
    for (const assignment of assignments) {
      const staffMember = staff.find((s) => s.id === assignment.staffId)
      if (staffMember) {
        names[assignment.caseId] = names[assignment.caseId] ?? []
        names[assignment.caseId].push(
          `${staffMember.firstName} ${staffMember.lastName}`,
        )
      }
    }
    return names
  }, [assignments, staff])

  const months = useMemo(() => buildMonths(year), [year])
  const totalDaysInYear = useMemo(
    () => months.reduce((total, month) => total + month.days, 0),
    [months],
  )

  const casesForYear: Array<CalendarCase> = useMemo(() => {
    return maintenanceCases.map((maintenanceCase) => {
      const startDate = startOfDay(new Date(maintenanceCase.plannedStart))
      const endDate = startOfDay(new Date(maintenanceCase.plannedEnd))

      if (startDate > endDate) {
        return {
          ...maintenanceCase,
          color: colorForId(maintenanceCase.id),
          endDate,
          range: null,
          startDate,
        }
      }

      const range = clampRangeToYear(startDate, endDate, year)

      return {
        ...maintenanceCase,
        color: colorForId(maintenanceCase.id),
        endDate,
        range,
        startDate,
      }
    })
  }, [maintenanceCases, year])

  const todayIndex = useMemo(() => {
    if (year !== currentYear) return null
    return dayIndexInYear(today, year)
  }, [currentYear, today, year])

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const namesScrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = scrollRef.current
    if (!container || todayIndex === null) return
    const offset = Math.max(
      todayIndex * columnWidth - container.clientWidth / 2,
      0,
    )
    container.scrollTo({ left: offset, behavior: 'smooth' })
  }, [columnWidth, todayIndex])

  const syncScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (!namesScrollRef.current) return
    namesScrollRef.current.scrollTop = event.currentTarget.scrollTop
  }

  const syncNamesScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTop = event.currentTarget.scrollTop
  }

  const renderDayCell = (date: Date, key: string) => {
    const isTodayCell =
      todayIndex !== null && dayIndexInYear(date, year) === todayIndex
    return (
      <Box
        alignItems="center"
        bg={isTodayCell ? todayBg : isWeekend(date) ? weekendBg : undefined}
        border={1}
        borderColor={borderColor}
        borderLeft={0}
        borderStyle="solid"
        display="flex"
        justifyContent="center"
        key={key}
        minHeight={`${dayRowHeight}px`}
        minWidth={`${columnWidth}px`}
      >
        {date.getDate()}
      </Box>
    )
  }

  return (
    <Container maxW="7xl" py={8} px={{ base: 4, md: 6 }}>
      <Stack gap={6}>
        <HStack justify="space-between">
          <Heading size="xl">Hangar</Heading>
          <HStack gap={3}>
            <HStack gap={2}>
              <IconButton
                aria-label="Previous year"
                onClick={() => setYear((value) => value - 1)}
                size="sm"
                variant="ghost"
              >
                <ChevronLeft size={18} />
              </IconButton>
              <Button
                onClick={() => setYear(currentYear)}
                size="sm"
                variant="outline"
              >
                {year}
              </Button>
              <IconButton
                aria-label="Next year"
                onClick={() => setYear((value) => value + 1)}
                size="sm"
                variant="ghost"
              >
                <ChevronRight size={18} />
              </IconButton>
            </HStack>
            <Button asChild colorPalette="blue" size="sm">
              <Link to="/hangar/new">
                <Plus size={16} />
                Neuer Eintrag
              </Link>
            </Button>
          </HStack>
        </HStack>

        <Box
          bg="bg.panel"
          borderColor="border"
          borderWidth="1px"
          rounded="lg"
          shadow="sm"
        >
          <Flex>
            <Box
              borderRight="1px solid"
              borderColor="border"
              minW={{ base: '180px', md: '220px' }}
            >
              <Box
                borderBottom="1px solid"
                borderColor="border"
                height={`${monthRowHeight + dayRowHeight}px`}
              />
              <Box
                maxH="70vh"
                overflow="hidden"
                ref={namesScrollRef}
                onScroll={syncNamesScroll}
              >
                {isLoading ? (
                  <Box as="ul">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <Box
                        alignItems="center"
                        as="li"
                        display="flex"
                        key={`name-skeleton-${index}`}
                        minHeight={`${caseRowHeight}px`}
                        px={{ base: 2, sm: 4 }}
                      >
                        <Skeleton height="16px" width="80%" />
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box as="ul">
                    {casesForYear.map((maintenanceCase) => {
                      const staffCount =
                        assignmentCounts[maintenanceCase.id] || 0
                      return (
                        <Box
                          alignItems="center"
                          as="li"
                          cursor="pointer"
                          display="flex"
                          gap={3}
                          key={maintenanceCase.id}
                          minHeight={`${caseRowHeight}px`}
                          px={{ base: 2, sm: 4 }}
                          transition="background 0.2s"
                          _hover={{ bg: 'bg.muted' }}
                          asChild
                        >
                          <Link
                            to="/hangar/$caseId"
                            params={{ caseId: maintenanceCase.id }}
                          >
                            <Box
                              aria-hidden
                              bg={maintenanceCase.color}
                              borderRadius="full"
                              height="10px"
                              minW="10px"
                            />
                            <Stack
                              flex={1}
                              gap={1}
                              direction="row"
                              align="center"
                            >
                              <Text
                                fontWeight="medium"
                                lineClamp={1}
                                title={maintenanceCase.name}
                              >
                                {maintenanceCase.name}
                              </Text>
                              {staffCount === 0 && (
                                <AlertCircle
                                  size={14}
                                  color="var(--chakra-colors-yellow-500)"
                                />
                              )}
                              {staffCount > 0 && (
                                <Tooltip
                                  content={(
                                    assignedStaffNames[maintenanceCase.id] ?? []
                                  ).join(', ')}
                                >
                                  <Badge colorPalette="blue" fontSize="xs">
                                    {staffCount}
                                  </Badge>
                                </Tooltip>
                              )}
                            </Stack>
                          </Link>
                        </Box>
                      )
                    })}
                  </Box>
                )}
              </Box>
            </Box>

            <Box
              flex={1}
              maxH="70vh"
              overflow="auto"
              ref={scrollRef}
              onScroll={syncScroll}
            >
              <Box
                minW={`${totalDaysInYear * columnWidth}px`}
                position="relative"
              >
                <Box bg={headerBg} position="sticky" top={0} zIndex={5}>
                  <Box display="flex">
                    {months.map((month) => (
                      <Box
                        alignItems="center"
                        borderColor="border"
                        borderStyle="solid"
                        borderWidth="0 1px 1px 0"
                        display="flex"
                        fontWeight="semibold"
                        justifyContent="center"
                        key={month.name}
                        minHeight={`${monthRowHeight}px`}
                        minWidth={`${month.days * columnWidth}px`}
                        textTransform="capitalize"
                      >
                        {month.name}
                      </Box>
                    ))}
                  </Box>
                  <Box display="flex">
                    {months.flatMap((month) =>
                      Array.from({ length: month.days }, (_, index) => {
                        const date = new Date(year, month.monthIndex, index + 1)
                        return renderDayCell(
                          date,
                          `${month.name}-${index + 1}-header`,
                        )
                      }),
                    )}
                  </Box>
                </Box>

                <Box>
                  {isLoading ? (
                    <Box>
                      {Array.from({ length: 6 }).map((_, index) => (
                        <Box
                          display="flex"
                          key={`row-skeleton-${index}`}
                          minHeight={`${caseRowHeight}px`}
                          position="relative"
                        >
                          <Skeleton
                            height="70%"
                            left="10%"
                            position="absolute"
                            top="15%"
                            width="30%"
                          />
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Box>
                      {casesForYear.map((maintenanceCase, caseIndex) => (
                        <Box
                          display="flex"
                          key={maintenanceCase.id}
                          minHeight={`${caseRowHeight}px`}
                          position="relative"
                        >
                          {months.flatMap((month) =>
                            Array.from({ length: month.days }, (_, index) => {
                              const date = new Date(
                                year,
                                month.monthIndex,
                                index + 1,
                              )
                              const isTodayCell =
                                todayIndex !== null &&
                                dayIndexInYear(date, year) === todayIndex
                              return (
                                <Box
                                  alignItems="center"
                                  bg={
                                    isTodayCell
                                      ? todayBg
                                      : isWeekend(date)
                                        ? weekendBg
                                        : undefined
                                  }
                                  border={1}
                                  borderBottom={0}
                                  borderColor={borderColor}
                                  borderLeft={0}
                                  borderStyle="solid"
                                  borderTop={
                                    caseIndex === 0 ? '0px' : undefined
                                  }
                                  display="flex"
                                  justifyContent="center"
                                  key={`${maintenanceCase.id}-${month.name}-${index + 1}-grid`}
                                  minHeight={`${caseRowHeight}px`}
                                  minWidth={`${columnWidth}px`}
                                />
                              )
                            }),
                          )}

                          {maintenanceCase.range ? (
                            <Box
                              asChild
                              bg={maintenanceCase.color}
                              borderRadius="md"
                              color="white"
                              cursor="pointer"
                              fontSize="sm"
                              fontWeight="semibold"
                              left={`${maintenanceCase.range.startIndex * columnWidth}px`}
                              lineHeight={1.2}
                              maxW="100%"
                              minH={`${caseRowHeight - 12}px`}
                              overflow="hidden"
                              px={3}
                              py={2}
                              position="absolute"
                              shadow="sm"
                              textOverflow="ellipsis"
                              title={maintenanceCase.name}
                              top="50%"
                              transform="translateY(-50%)"
                              transition="opacity 0.2s"
                              whiteSpace="nowrap"
                              width={`${(maintenanceCase.range.endIndex - maintenanceCase.range.startIndex + 1) * columnWidth}px`}
                              _hover={{ opacity: 0.9 }}
                            >
                              <Link
                                to="/hangar/$caseId"
                                params={{ caseId: maintenanceCase.id }}
                              >
                                {maintenanceCase.name}
                              </Link>
                            </Box>
                          ) : null}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Stack>
    </Container>
  )
}
