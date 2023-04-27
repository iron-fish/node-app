import { FC } from 'react'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Card,
  CardBody,
} from '@ironfish/ui-kit'
import { formatOreToTronWithLanguage } from 'Utils/number'
import AccountBalance from 'Types/AccountBalance'

interface AccountAssetsViewProps {
  assets: AccountBalance[]
}

const AccountAssetsView: FC<AccountAssetsViewProps> = ({ assets }) => {
  return (
    !!assets?.length && (
      <Accordion defaultIndex={0} allowToggle={true} pt="0.5rem" pb="2.5rem">
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
            <Flex wrap={'wrap'} gap="1.25rem" mb="0.25rem">
              {assets.map(({ confirmed, asset }) => (
                <Card
                  variant="ironFish"
                  key={asset.id}
                  p="2rem 2rem 1.5rem 2rem"
                  borderRadius="0.25rem"
                  alignItems="center"
                  m="0"
                  minW="16.875rem"
                  width={{
                    base: 'calc(50% - 0.75rem)',
                    md1: 'calc(33.333333% - 0.9375rem)',
                  }}
                >
                  <CardBody>
                    <Flex direction="column">
                      <h4>{asset.name}</h4>
                      <h2>{formatOreToTronWithLanguage(confirmed)}</h2>
                    </Flex>
                  </CardBody>
                </Card>
              ))}
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    )
  )
}

export default AccountAssetsView
