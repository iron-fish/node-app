import { FC } from 'react'
import { Box, chakra, Flex, Link, NAMED_COLORS } from '@ironfish/ui-kit'
import { Link as NavigateLink } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import useUpdates from 'Hooks/updates/useUpdates'
import useReleaseNotes from 'Hooks/updates/useReleaseNotes'
import { ROUTES } from '..'

const UpldateList: FC = () => {
  const result = useReleaseNotes()

  console.log(result)

  return (
    <Flex justifyContent="space-between">
      <Flex direction="column" w="calc(100% - 11rem)" mr="1rem">
        {result?.data?.map(note => (
          <Box w="100%" my="2rem">
            <chakra.h5 color={NAMED_COLORS.GREY} mb="0.25rem">
              {note.date.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              .&nbsp;{note.version}
            </chakra.h5>
            <chakra.h3 mb="1rem">{note.name}</chakra.h3>
            <Box w="100%" h="3rem" overflow="hidden" mb="1rem">
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
        ))}
      </Flex>
      <Flex direction="column" w="10rem">
        <Box mb="1rem">
          <b>RELEASES</b>
        </Box>
        <Link mb="1rem">April 2022</Link>
        <Link mb="1rem">March 2022</Link>
        <Link mb="1rem">February 2022</Link>
        <Link mb="1rem">January 2022</Link>
        <Link mb="1rem">December 2021</Link>
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
      <UpldateList />
    </Box>
  )
}

export default Updates
