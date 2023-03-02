import { FC } from 'react'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  NAMED_COLORS,
  Wrap,
  WrapItem,
} from '@ironfish/ui-kit'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { formatOreToTronWithLanguage } from 'Utils/number'
import AccountBalance from 'Types/AccountBalance'

interface AccountAssetsViewProps {
  assets: AccountBalance[]
}

const AccountAssetsView: FC<AccountAssetsViewProps> = ({ assets }) => {
  return (
    !!assets?.length && (
      <Accordion allowToggle={true} pt="1.5rem" pb="2.5rem">
        <AccordionItem border="0rem">
          <AccordionButton p="0rem" _hover={{ background: 'none' }}>
            <h3>
              <Flex alignItems="center">
                {assets.length}&nbsp;Asset{assets.length === 1 ? '' : 's'}
                <AccordionIcon ml="0.3125rem" />
              </Flex>
            </h3>
          </AccordionButton>
          <AccordionPanel px="0rem" pb="0rem" mb="0.0625rem">
            <Wrap overflow="visible" spacing="1rem">
              {assets.map(({ confirmed, asset }) => (
                <WrapItem key={asset.id}>
                  <Flex
                    width="auto"
                    layerStyle="card"
                    p="2rem 2rem 1.5rem 2rem"
                    borderRadius="0.25rem"
                    alignItems="center"
                  >
                    <Flex direction="column" mr="2rem">
                      <h4>{asset.name}</h4>
                      <h2>{formatOreToTronWithLanguage(confirmed)}</h2>
                    </Flex>
                    <ChevronRightIcon ml="auto" color={NAMED_COLORS.GREY} />
                  </Flex>
                </WrapItem>
              ))}
            </Wrap>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    )
  )
}

export default AccountAssetsView
