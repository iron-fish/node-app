import {
  Box,
  chakra,
  Flex,
  NAMED_COLORS,
  Skeleton,
  SkeletonText,
} from '@ironfish/ui-kit'
import ReactMarkdown from 'react-markdown'
import BackButtonLink from 'Components/BackButtonLink'
import { FC, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ROUTES from 'Routes/data'
import LocationStateProps from 'Types/LocationState'
import { useReleaseNotesProvider } from 'Providers/ReleaseNotesProvider'
import { ReleaseNote } from 'Types/IUpdateManager'

interface CurrentNoteStateProps {
  note?: ReleaseNote
  next?: ReleaseNote | null
  prev?: ReleaseNote | null
}

const Update: FC = () => {
  const location = useLocation()
  const { version } = location.state as LocationStateProps
  const { data, loaded } = useReleaseNotesProvider()
  const [currentNote, setCurrentNote] = useState<CurrentNoteStateProps>()

  useEffect(() => {
    if (version && loaded && data.data) {
      const current: CurrentNoteStateProps = {}
      const currentIndex = data.data?.findIndex(
        note => note.version === version
      )
      if (currentIndex !== -1) {
        current.note = data.data[currentIndex]
        current.next = data.data[currentIndex - 1]
        current.prev = data.data[currentIndex + 1]
      }
      setCurrentNote(current)
    }
  }, [version, data?.data, loaded])

  return (
    !!currentNote?.note && (
      <Flex flexDirection="column" pb="0" bg="transparent" w="100%">
        <BackButtonLink
          mb="1rem"
          to={ROUTES.UPDATES}
          label={'Back to release notes'}
        />
        <Box mb="2rem">
          <Skeleton variant="ironFish" isLoaded={loaded}>
            <chakra.h2>{currentNote.note?.name}</chakra.h2>
          </Skeleton>
        </Box>
        <Box mb="1rem">
          <Skeleton variant="ironFish" isLoaded={loaded}>
            <chakra.h5 color={NAMED_COLORS.GREY} mb="0.25rem">
              {new Date(currentNote.note?.date).toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              .&nbsp;{currentNote.note?.version}
            </chakra.h5>
          </Skeleton>
        </Box>
        <SkeletonText
          variant="ironFish"
          isLoaded={loaded}
          skeletonHeight="2"
          noOfLines={16}
          spacing="4"
        >
          <Box
            w="100%"
            overflow={'hidden'}
            sx={{
              ul: {
                paddingLeft: '2rem',
              },
            }}
          >
            <ReactMarkdown>{currentNote.note?.notes}</ReactMarkdown>
          </Box>
        </SkeletonText>
        <Flex mt="4rem" justifyContent="space-between">
          {currentNote.prev && (
            <BackButtonLink
              mb="1rem"
              to={'.'}
              label={currentNote.prev.name}
              replace={true}
              state={{ version: currentNote.prev.version }}
            />
          )}
          <div />
          {currentNote.next && (
            <BackButtonLink
              mb="1rem"
              toTheRight={true}
              to={'.'}
              label={currentNote.next.name}
              replace={true}
              state={{ version: currentNote.next.version }}
            />
          )}
        </Flex>
      </Flex>
    )
  )
}

export default Update
