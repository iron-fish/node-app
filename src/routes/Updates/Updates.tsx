import { FC, useMemo, useEffect, useRef, useState, useCallback } from 'react'
import {
  Box,
  chakra,
  Flex,
  Link,
  NAMED_COLORS,
  Skeleton,
} from '@ironfish/ui-kit'
import { Link as NavigateLink } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import useUpdates from 'Hooks/updates/useUpdates'
import { ROUTES } from '..'
import { useUpdateProvider } from 'Providers/UpdatesProvider'
import { ReleaseNote, UpdateMonthVersion } from 'Types/IUpdateManager'

interface ReleaseNoteProps {
  note: ReleaseNote
  setIntersectionId: (id: string) => void
}

const ReleaseNoteItem: FC<ReleaseNoteProps> = ({ note, setIntersectionId }) => {
  const ref = useRef()
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntersectionId(entry.target.id)
        }
      },
      {
        rootMargin: '0px 0px -40% 0px',
      }
    )
    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [])

  return (
    <Box ref={ref} w="100%" my="2rem" id={note.version}>
      {note.isNew && (
        <Flex
          h="1.625rem"
          w="min-content"
          bg={'#EBFBF4'}
          color={'#335A48'}
          _dark={{
            bg: '#192D23',
            color: '#5FC89A',
          }}
          alignItems="center"
          justifyContent="center"
          borderRadius="0.25rem"
          p="0.125rem 0.625rem"
          mb="1rem"
        >
          <chakra.h5>New</chakra.h5>
        </Flex>
      )}
      <chakra.h5 whiteSpace="nowrap" color={NAMED_COLORS.GREY} mb="0.25rem">
        {new Date(note.date).toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
        .&nbsp;{note.version}
      </chakra.h5>
      <chakra.h3 mb="1rem">{note.name}</chakra.h3>
      <Box w="100%" h="6rem" overflow="hidden" mb="1rem">
        <ReactMarkdown>{note.notes}</ReactMarkdown>
      </Box>
      <Box>
        <Link
          color={NAMED_COLORS.LIGHT_BLUE}
          _hover={{ opacity: '0.7' }}
          as={NavigateLink}
          to={ROUTES.UPDATE}
          state={{ version: note.version }}
        >
          Read more
        </Link>
      </Box>
    </Box>
  )
}

const UpdateList: FC = () => {
  const [intersectionId, setIntersectionId] = useState(null)
  const { data, loaded } = useUpdateProvider()

  const monthRange: UpdateMonthVersion[] = useMemo(() => {
    const month = data?.metadata?.month_range || new Array(12).fill({})
    return month
  }, [data?.metadata])

  const tags = useMemo(
    () => monthRange?.map(item => item?.version),
    [monthRange]
  )

  const handleVisibleTagChange = useCallback(
    (newTag: string) => {
      if (tags?.includes(newTag)) {
        setIntersectionId(newTag)
      }
    },
    [tags]
  )

  return (
    <Flex justifyContent="space-between">
      <Flex direction="column" w="calc(100% - 13rem)">
        {(data?.data || new Array(3).fill(null))?.map(note => {
          return note ? (
            <ReleaseNoteItem
              key={note.version}
              note={note}
              setIntersectionId={handleVisibleTagChange}
            />
          ) : (
            <Skeleton
              variant="ironFish"
              my="1rem"
              w="100%"
              h="200px"
              isLoaded={loaded}
            />
          )
        })}
      </Flex>
      <Flex
        direction="column"
        w="7rem"
        position="fixed"
        top="8.5rem"
        right="4rem"
      >
        <Box mb="1rem">
          <b>RELEASES</b>
        </Box>
        {monthRange.map(({ month, version }) =>
          month && version ? (
            <Link
              key={`${month}-${version}`}
              onClick={() => {
                const element = document.getElementById(version)
                if (element) {
                  element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                  })
                }
              }}
              mb="1rem"
              fontWeight={intersectionId === version ? 'bold' : 'normal'}
              color={
                intersectionId === version
                  ? NAMED_COLORS.BLACK
                  : NAMED_COLORS.GREY
              }
              _dark={{
                color:
                  intersectionId === version
                    ? NAMED_COLORS.WHITE
                    : NAMED_COLORS.PALE_GREY,
              }}
            >
              {month}
            </Link>
          ) : (
            <Skeleton
              variant="ironFish"
              w="100%"
              h="24px"
              mb="1rem"
              isLoaded={loaded}
            />
          )
        )}
      </Flex>
    </Flex>
  )
}

const Updates: FC = () => {
  const { status } = useUpdates()

  return (
    <Box w="100%">
      <Flex alignItems="center" h="4rem">
        <Box mr="1rem">
          <chakra.h2>Updates</chakra.h2>
        </Box>
        <Flex
          ml="0.5rem"
          h="2rem"
          bg={NAMED_COLORS.LIGHTER_GREY}
          color={NAMED_COLORS.GREY}
          _dark={{
            bg: NAMED_COLORS.DARK_GREY,
            color: NAMED_COLORS.PALE_GREY,
          }}
          alignItems="center"
          justifyContent="center"
          borderRadius="0.25rem"
        >
          <chakra.h5 my="0.25rem" mx="1rem">
            Version {status?.version}
          </chakra.h5>
        </Flex>
      </Flex>
      <UpdateList />
    </Box>
  )
}

export default Updates
