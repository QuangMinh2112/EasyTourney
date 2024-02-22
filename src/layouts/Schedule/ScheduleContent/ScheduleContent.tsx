import React, { useCallback, useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import ListScheduleColumn from './ListScheduleColumn/ListScheduleColumn'
import ScheduleCard from './ListScheduleColumn/ScheduleColumn/ListScheduleCard/ScheduleCard/ScheduleCard'
import {
  CollisionDetection,
  DndContext,
  DragOverlay,
  DropAnimation,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  closestCorners,
  defaultDropAnimationSideEffects,
  getFirstCollision,
  pointerWithin,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { cloneDeep, isEmpty } from 'lodash'
import { arrayMove } from '@dnd-kit/sortable'
import { generatePlaceholderCard } from '../../../utils/function'
import { CSS } from '@dnd-kit/utilities'
import { MatchDataType, ScheduleDataType } from '../../../types/schedule.type'
import { dragDropApi, getAllScheduledMatches } from '../../../apis/axios/schedule/schedule'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ScheduleMatchesAPIRes } from '../../../types/common'
import { useDispatch } from 'react-redux'
import { setDuplicateMatch, setTimeNotEnough } from '../../../redux/reducers/schedule/schedule.reducer'

export type CollisionDetectionArgs = Parameters<CollisionDetection>[0]

interface ScheduleContentProps {
  isGenerated: boolean
}

const ScheduleContent = ({ isGenerated }: ScheduleContentProps) => {
  const dispatch = useDispatch()
  const [columnData, setColumnData] = useState<ScheduleDataType[]>([])
  const [activeDragItemId, setActiveDragItemId] = useState<number | null>(null) //  Get the id of card being draging
  const [activeDragItemData, setActiveDragItemData] = useState<MatchDataType | null>(null) // Get the data of card being draging
  const [oldColumnWhenDragingCard, setOldColumnWhenDragingCard] = useState<any>(null) // Get old data when draging start
  const [update, setUpdate] = useState<boolean>(false)
  // Final impact point
  const lastOverId = useRef<UniqueIdentifier | null>(null)

  const { tournamentId } = useParams()

  // Sensors when start dragging card or cancle the operation
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 0, tolerance: 500 } })
  const sensors = useSensors(mouseSensor, touchSensor)

  // Find id of column contain Card
  const findColumnByMatchCardId = (matchId: any) => {
    return columnData?.find((column: any) => column?.matches?.map((match: any) => match.id).includes(matchId))
  }

  // Custom  collision detection algorithms
  const collisionDetectionStrategy = useCallback(
    (args: CollisionDetectionArgs) => {
      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args)
      // If pointerIntersections is empty array => return and not do anything
      if (!pointerIntersections?.length) return

      //Find first overId  in intersction above
      let overId = getFirstCollision(pointerIntersections, 'id')

      if (overId) {
        const checkColumn = columnData?.find((column: ScheduleDataType) => column.eventDateId === overId)

        if (checkColumn) {
          const cardMatchIdsByColumn = columnData?.map((column: ScheduleDataType) => {
            if (column.eventDateId === checkColumn.eventDateId) {
              return column.matches?.map((match: any) => match.id) || []
            }
          })
          const cardOrderIds = cardMatchIdsByColumn?.filter((item: any) => item !== undefined).flat()

          // Override columnId to card id with overId
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => container.id !== overId && cardOrderIds?.includes(container.id)
            )
          })[0]?.id
        }
        lastOverId.current = overId

        return [{ id: overId }]
      }
      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [columnData]
  )

  const moveCardBetweenTwoColumns = async (
    overColumns: ScheduleDataType,
    overCardId: string,
    active: any,
    over: any,
    activeColumns: ScheduleDataType,
    activeDragingCardId: string,
    activeDragingCardData: ScheduleDataType,
    triggerFrom: string
  ) => {
    setColumnData((prev: any) => {
      const overCardIndex = overColumns?.matches?.findIndex((match: any) => match.id === overCardId)

      // eslint-disable-next-line prefer-const

      let newCardIndex
      // rect : position of match relative to frame
      const isBelowOverItem =
        active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      // eslint-disable-next-line prefer-const
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumns?.matches?.length + 1

      // Clone columnData to new array to handle data
      const nextColumns = cloneDeep(prev)
      const nextActiveColumns = nextColumns?.find((c: any) => c.eventDateId === activeColumns.eventDateId)
      const nextOverColumns = nextColumns?.find((c: any) => c.eventDateId === overColumns.eventDateId)

      const filterIdOfColumn = nextColumns?.map((column: any) => {
        if (column.eventDateId === nextActiveColumns.eventDateId) {
          return column.matches?.map((match: any) => match.id) || []
        }
      })
      let cardOrderIds = filterIdOfColumn?.filter((item: any) => item !== undefined).flat()

      // Column old

      if (nextActiveColumns) {
        // Delete the dragging card from its column when dragging to a new column
        nextActiveColumns.matches = nextActiveColumns?.matches?.filter((match: any) => match.id !== activeDragingCardId)

        if (isEmpty(nextActiveColumns.matches)) {
          nextActiveColumns.matches = [generatePlaceholderCard(nextActiveColumns)]
        }

        // Update Id in column
        cardOrderIds = nextActiveColumns?.matches?.map((match: MatchDataType) => match.id)
      }

      // Column new
      if (nextOverColumns) {
        // Check if the card that is pulling it exists in OverCloud or not => if it exists, delete it
        nextOverColumns.matches = nextOverColumns?.matches?.filter((c: MatchDataType) => c.id !== activeDragingCardId)
        // Add the currently dragged card to the column according to the new index position
        nextOverColumns.matches = nextOverColumns.matches?.toSpliced(newCardIndex, 0, {
          ...activeDragingCardData,
          eventDateId: nextActiveColumns?.eventDateId
        })
        nextOverColumns.matches = nextOverColumns?.matches?.filter((match: MatchDataType) => !match.FE_PlaceholderCard)
        // Update Id in column
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        cardOrderIds = nextOverColumns?.matches?.map((match: MatchDataType) => match.id)
      }
      // Call Api Drag drop between different columns (Handle api at handleDragEnd to avoid call api many times)
      if (triggerFrom === 'handleDragEnd') {
        const data = {
          matchId: activeDragingCardId,
          newEventDateId: overColumns.eventDateId,
          newIndexOfMatch: newCardIndex + 1
        }

        DragDropMatches(Number(tournamentId), data)
      }

      return nextColumns
    })
  }

  // Trigger when start draging card
  const handleDragStart = (event: { active: any; over: any }) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemData(event?.active?.data?.current)

    if (event?.active?.data?.current?.id) {
      setOldColumnWhenDragingCard(findColumnByMatchCardId(event?.active?.id))
    }
  }

  // Trigger during the card drag and drop process
  const handleDragOver = (event: { active: any; over: any }) => {
    const { active, over } = event
    // Check if over does not exist (drag miscellaneous items out then return immediately, avoid errors, avoid page crashes)
    if (!active || !over) return

    const {
      id: activeDragingCardId,
      data: { current: activeDragingCardData }
    } = active // Get id and data of card is draging

    const { id: overCardId } = over //overCardId: is the interactive card above or below the card being dragged

    // Find 2 columns dragged and dropped according to the matchId card
    const activeColumns = findColumnByMatchCardId(activeDragingCardId)
    const overColumns = findColumnByMatchCardId(overCardId)

    if (!activeColumns || !overColumns || !isPastDateColumn(overColumns)) return // If one of the two columns does not exist, return does nothing (avoid website crashes).

    if (activeColumns.eventDateId !== overColumns.eventDateId) {
      moveCardBetweenTwoColumns(
        overColumns,
        overCardId,
        active,
        over,
        activeColumns,
        activeDragingCardId,
        activeDragingCardData,
        'handleDragOver'
      )
    }
  }
  const isPastDateColumn = (column: ScheduleDataType) => {
    if (!column) return false
    const currentDate = new Date()
    const columnDate = new Date(column.date)

    if (currentDate.toDateString() === columnDate.toDateString()) {
      return true
    } else if (columnDate < currentDate) {
      return false
    }
    return true
  }

  // Trigger when end draging card
  const handleDragEnd = (event: { active: any; over: any }) => {
    const { active, over } = event
    // Check if does not exist over (if drag anything out then return it, avoid errors, avoid crashing the page)
    if (!active || !over) return

    const {
      id: activeDragingCardId,
      data: { current: activeDragingCardData }
    } = active

    const { id: overCardId } = over

    const activeColumns = findColumnByMatchCardId(activeDragingCardId)
    const overColumns = findColumnByMatchCardId(overCardId)

    if (!activeColumns || !overColumns || !isPastDateColumn(overColumns)) return

    // Check draging card between two column or inside a column
    if (oldColumnWhenDragingCard?.eventDateId !== overColumns.eventDateId) {
      // Draging card between two different columns
      moveCardBetweenTwoColumns(
        overColumns,
        overCardId,
        active,
        over,
        activeColumns,
        activeDragingCardId,
        activeDragingCardData,
        'handleDragEnd'
      )
    } else {
      // Draging card inside column
      const oldCardIndex = oldColumnWhenDragingCard?.matches?.findIndex(
        (c: MatchDataType) => c.id === activeDragingCardId
      )
      const newCardIndex = oldColumnWhenDragingCard?.matches?.findIndex((c: MatchDataType) => c.id === overCardId)

      const dndSortCards = arrayMove(oldColumnWhenDragingCard?.matches, oldCardIndex, newCardIndex) // use arrayMove to sort card by index

      setColumnData((prev: any) => {
        const nextCard = cloneDeep(prev)
        const targetCard = nextCard?.find((column: ScheduleDataType) => column.eventDateId === overColumns.eventDateId)
        let cardMatchIds = prev
          ?.find((column: ScheduleDataType) => column.eventDateId === overColumns.eventDateId)
          ?.matches?.map((match: MatchDataType) => match.id)

        targetCard.matches = dndSortCards
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        cardMatchIds = dndSortCards?.map((card: any) => card.id)
        return nextCard
      })
      const data = {
        matchId: activeDragingCardId,
        newEventDateId: overColumns.eventDateId,
        newIndexOfMatch: newCardIndex + 1
      }
      DragDropMatches(Number(tournamentId), data)
    }

    // Datas after drag and drop have to return initial value is null
    setActiveDragItemId(null)
    setActiveDragItemData(null)
    setOldColumnWhenDragingCard(null)
  }

  // Re-render component
  const render = () => {
    setUpdate(!update)
  }

  // Handle api here
  const getAllScheduleMatches = async (id: number) => {
    const res = (await getAllScheduledMatches(id)) as ScheduleMatchesAPIRes
    if (res?.success) {
      setColumnData(res?.data)
    }

    if (res?.additionalData) {
      dispatch(setDuplicateMatch(res?.additionalData?.DuplicateMatch))
      dispatch(setTimeNotEnough(res?.additionalData?.TimeNoEnough))
    } else {
      dispatch(setTimeNotEnough(res?.additionalData?.TimeNoEnough))
      dispatch(setDuplicateMatch(res?.additionalData?.DuplicateMatch))
    }
    // Generate special match (id,eventDataId,FE_PlaceholderCard) when matches array is empty
    res?.data?.map((column: any) => {
      if (column?.matches?.length === 0) {
        column.matches = [
          {
            id: `${column.eventDateId}-placeholder-card`,
            eventDateId: column.eventDateId,
            FE_PlaceholderCard: true
          }
        ]
      }
    })
  }
  const DragDropMatches = async (id: number, data: any) => {
    const res = (await dragDropApi(id, data)) as ScheduleMatchesAPIRes

    if (res?.success) {
      toast.success('A match has changed successfully!')
      render()
    } else {
      render()
      toast.error(res?.errorMessage['Invalid Error'])
    }
  }

  useEffect(() => {
    getAllScheduleMatches(Number(tournamentId))
  }, [update, isGenerated])

  // Animation of DragOverlay when match is dragging
  const dropAnimation: DropAnimation = {
    keyframes({ transform }) {
      return [
        { transform: CSS.Transform.toString(transform.initial) },
        {
          transform: CSS.Transform.toString({
            scaleX: 0.98,
            scaleY: 0.98,
            x: transform.final.x - 10,
            y: transform.final.y - 10
          })
        }
      ]
    },
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }
  return (
    <Box sx={{ backgroundColor: 'white', padding: '1rem 1rem 0', borderRadius: '1rem' }}>
      <Box sx={{ fontWeight: '500', fontSize: '2rem', textAlign: 'center' }}>Schedule</Box>
      <DndContext
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        sensors={sensors}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        collisionDetection={collisionDetectionStrategy} // Collision detection algorithms
      >
        <Box
          sx={{
            backgroundColor: '#fff',
            width: '100%',
            height: 'calc(100vh - 140px - 5.2rem)',
            marginTop: '1rem',
            transition: 'all 0.5s ease',
            overflowX: 'auto',
            overflowY: 'hidden',
            borderRadius: '6px',
            '&::-webkit-scrollbar-track': { marginLeft: '1.3rem ' }
          }}
        >
          <ListScheduleColumn columnData={columnData} render={render} />

          <DragOverlay dropAnimation={dropAnimation}>
            {(!activeDragItemId || !activeDragItemData) && null}
            {activeDragItemId && activeDragItemData && (
              <ScheduleCard card={activeDragItemData} activeDragItemId={activeDragItemId} render={render} />
            )}
          </DragOverlay>
        </Box>
      </DndContext>
    </Box>
  )
}

export default ScheduleContent
