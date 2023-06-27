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
import { ROUTES } from '..'
import { useReleaseNotesProvider } from 'Providers/ReleaseNotesProvider'
import { ReleaseNote, UpdateMonthVersion } from 'Types/IUpdateManager'
import { useDataSync } from 'Providers/DataSyncProvider'
import EmptyOverview from 'Components/EmptyOverview'

interface ReleaseNoteProps {
  note: ReleaseNote
  setIntersectionId: (id: string) => void
  isLatest?: boolean
}

function useLatestVersionDownloadLink({
  isLatest,
  isNew,
}: {
  isLatest?: boolean
  isNew?: boolean
}) {
  const [downloadLink, setDownloadLink] = useState(null)
  const shouldFetch = isLatest && isNew

  useEffect(() => {
    const getDownloadLink = async () => {
      if (!shouldFetch) return

      const link = await window.UpdateManager.getDownloadLinkForPlatform()

      // If there is no latest download, the server responds with "/".
      // Adding !link to be extra safe...
      if (!link || link.length <= 1) return

      setDownloadLink(link)
    }
    getDownloadLink()
  }, [shouldFetch])

  return downloadLink
}

const ReleaseNoteItem: FC<ReleaseNoteProps> = ({
  note,
  setIntersectionId,
  isLatest,
}) => {
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

  const downloadLink = useLatestVersionDownloadLink({
    isLatest,
    isNew: note.isNew,
  })

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
      <Box w="100%" maxH="3rem" h="min-content" overflow="hidden" mb="1rem">
        <ReactMarkdown>{note.notes}</ReactMarkdown>
      </Box>
      <Flex gap="2rem">
        <Link
          color={NAMED_COLORS.LIGHT_BLUE}
          _hover={{ opacity: '0.7' }}
          as={NavigateLink}
          to={ROUTES.UPDATE}
          state={{ version: note.version }}
        >
          Read more
        </Link>
        {downloadLink && (
          <Link
            color={NAMED_COLORS.LIGHT_BLUE}
            _hover={{ opacity: '0.7' }}
            as="a"
            href={downloadLink}
            target="_blank"
          >
            Download Latest Version
          </Link>
        )}
      </Flex>
    </Box>
  )
}

const UpdateList: FC = () => {
  const [intersectionId, setIntersectionId] = useState(null)
  const { data, loaded } = useReleaseNotesProvider()

  const monthRange: UpdateMonthVersion[] = useMemo(
    () => data?.metadata?.month_range || [],
    [data?.metadata]
  )

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

  if (loaded && !data?.data) {
    return (
      <EmptyOverview
        alignItems="center"
        h="calc(100vh - 18.75rem)"
        header="No updates available"
      />
    )
  }

  return (
    <Flex justifyContent="space-between">
      <Flex direction="column" w="calc(100% - 13rem)">
        {((loaded && data.data) || new Array(3).fill(null))?.map(
          (note, index) => {
            return note ? (
              <ReleaseNoteItem
                key={note.version}
                note={note}
                setIntersectionId={handleVisibleTagChange}
                isLatest={index === 0}
              />
            ) : (
              <Skeleton
                key={index}
                variant="ironFish"
                my="1rem"
                w="100%"
                h="200px"
                isLoaded={loaded}
              />
            )
          }
        )}
      </Flex>
      {!!monthRange.length && (
        <Flex
          direction="column"
          w="7rem"
          position="fixed"
          top="11.75rem"
          right="4rem"
        >
          <Box mb="1.25rem" letterSpacing="0.01rem">
            <b>RELEASES</b>
          </Box>
          {monthRange.map(({ month, version }, index) =>
            month && version ? (
              <Link
                key={`${month}-${version}`}
                mb="1.25rem"
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
                onClick={() => {
                  const element = document.getElementById(version)
                  if (element) {
                    element.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    })
                  }
                }}
              >
                {month}
              </Link>
            ) : (
              <Skeleton
                key={index}
                variant="ironFish"
                w="100%"
                h="1.5rem"
                mb="1rem"
                isLoaded={loaded}
              />
            )
          )}
        </Flex>
      )}
    </Flex>
  )
}

const VersionBadge = () => {
  const {
    updates: { status },
  } = useDataSync()
  return (
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
  )
}

const Updates: FC = () => {
  return (
    <Box w="100%">
      <Flex alignItems="center" h="4rem">
        <Box mr="1rem">
          <chakra.h2>Updates</chakra.h2>
        </Box>
        <VersionBadge />
      </Flex>
      <UpdateList />
    </Box>
  )
}

export default Updates
