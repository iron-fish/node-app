import { FC } from 'react'
import {
  Button,
  chakra,
  Flex,
  ModalBody,
  ModalCloseButton,
  NAMED_COLORS,
  Progress,
} from '@ironfish/ui-kit'
import { formatOreToTronWithLanguage } from 'Utils/number'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from 'Routes/data'
import { StepProps } from './SendFlowTypes'

const ResultStep: FC<StepProps> = ({ from, amount, asset, transaction }) => {
  const navigate = useNavigate()
  return (
    <>
      <ModalCloseButton
        border="0.0625rem solid"
        borderRadius="50%"
        color={NAMED_COLORS.GREY}
        borderColor={NAMED_COLORS.LIGHT_GREY}
        top="1.5rem"
        right="1.5rem"
        _focus={{
          boxShadow: 'none',
        }}
      />
      <ModalBody p={0}>
        <chakra.h2 mb="1rem">Transaction Processing</chakra.h2>
        <chakra.h4 mb="2rem">
          We are processing your transaction of{' '}
          {formatOreToTronWithLanguage(amount)} {asset.name}. This may take a
          few minutes. This transaction will appear in your activity as pending
          until it’s been processed.
        </chakra.h4>
        {transaction ? (
          <Flex gap="1rem">
            <Button
              variant="primary"
              size="medium"
              onClick={() =>
                navigate(ROUTES.ACCOUNT, { state: { accountId: from.id } })
              }
            >
              View Account Activity
            </Button>
            <Button
              variant="primary"
              size="medium"
              onClick={() =>
                navigate(ROUTES.TRANSACTION, {
                  state: {
                    accountId: from.id,
                    hash: transaction.hash,
                  },
                })
              }
            >
              View Transaction
            </Button>
          </Flex>
        ) : (
          <Progress
            borderRadius="2rem"
            isIndeterminate
            bg={NAMED_COLORS.LIGHT_GREY}
            variant="ironLightBlue"
          />
        )}
      </ModalBody>
    </>
  )
}

export default ResultStep
