import { Box, chakra, Flex, NAMED_COLORS } from '@ironfish/ui-kit'
import ReactMarkdown from 'react-markdown'
import BackButtonLink from 'Components/BackButtonLink'
import useReleaseNote from 'Hooks/updates/useReleaseNote'
import { FC } from 'react'
import { useLocation } from 'react-router-dom'
import ROUTES from 'Routes/data'
import LocationStateProps from 'Types/LocationState'

const Update: FC = () => {
  const location = useLocation()
  const { version } = location.state as LocationStateProps
  const result = useReleaseNote(version)
  return (
    <Flex flexDirection="column" pb="0" bg="transparent" w="100%">
      <BackButtonLink
        mb="1rem"
        to={ROUTES.UPDATES}
        label={'Back to release notes'}
      />
      <Box mb="2rem">
        <chakra.h2>{result?.data?.name}</chakra.h2>
      </Box>
      <Box mb="1rem">
        <chakra.h5 color={NAMED_COLORS.GREY} mb="0.25rem">
          {result?.data?.date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
          .&nbsp;{result?.data?.version}
        </chakra.h5>
      </Box>
      <Box w="100%">
        <ReactMarkdown>{result?.data?.notes}</ReactMarkdown>
      </Box>
    </Flex>
  )
}

export default Update
