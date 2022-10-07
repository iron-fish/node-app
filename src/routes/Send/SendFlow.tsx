import { FC, ReactNode, useState } from 'react'
import {
  Box,
  Button,
  chakra,
  FieldGroup,
  Flex,
  HStack,
  LightMode,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  ModalProps,
  NAMED_COLORS,
  Progress,
  StyleProps,
  TextField,
  VStack,
  Icon,
  Image,
} from '@ironfish/ui-kit'
import IconCopy from '@ironfish/ui-kit/dist/svgx/icon-copy'
import { Account } from 'Data/types/Account'
import { Contact } from 'Data/types/Contact'
import SendIcon from 'Svgx/send'

interface SendFlowProps extends Omit<ModalProps, 'children'>, SendProps {}

interface SendProps {
  from: Account
  to: Contact
  amount: number
  memo: string
  fee: number
}

interface DataPreviewLineProps extends StyleProps {
  title: ReactNode
  value: ReactNode
}

const DataPreviewLine: FC<DataPreviewLineProps> = ({
  title,
  value,
  ...props
}) => (
  <VStack
    alignItems="flex-start"
    borderBottom="0.0625rem dotted"
    borderColor={NAMED_COLORS.LIGHT_GREY}
    pb="1rem"
    {...props}
  >
    <chakra.h5 w="100%" color={NAMED_COLORS.GREY}>
      {title}
    </chakra.h5>
    <chakra.h4 w="100%" mt="0 !important">
      {value}
    </chakra.h4>
  </VStack>
)

interface StepProps extends SendProps {
  onConfirm: () => void
  onCancel: () => void
  onSend: () => void
}

const ConfirmStep: FC<StepProps> = ({
  onConfirm,
  onCancel,
  from,
  to,
  amount,
  memo,
  fee,
}) => {
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
        <chakra.h2 mb="2rem">Confirm Transaction Details</chakra.h2>
        <VStack spacing="1rem" w="100%">
          <DataPreviewLine title="From:" value={from.name} w="100%" />
          <DataPreviewLine
            title="To:"
            value={
              <HStack w="100%" justifyContent="space-between">
                <chakra.h4>{to.name}</chakra.h4>
                <chakra.h5 color={NAMED_COLORS.GREY}>{to.address}</chakra.h5>
              </HStack>
            }
            w="100%"
          />
          <DataPreviewLine
            title="Amount:"
            value={
              <HStack w="100%" justifyContent="space-between">
                <chakra.h4>{amount}</chakra.h4>
                <chakra.h5 color={NAMED_COLORS.GREY}>USD $--</chakra.h5>
              </HStack>
            }
            w="100%"
          />
          <DataPreviewLine
            title="Fee:"
            value={
              <HStack w="100%" justifyContent="space-between">
                <chakra.h4>{fee} $IRON</chakra.h4>
                <chakra.h5 color={NAMED_COLORS.GREY}>USD $--</chakra.h5>
              </HStack>
            }
            w="100%"
          />
          <DataPreviewLine
            title="Total:"
            value={
              <HStack w="100%" justifyContent="space-between">
                <chakra.h4>{amount + fee} $IRON</chakra.h4>
                <chakra.h5 color={NAMED_COLORS.GREY}>USD $--</chakra.h5>
              </HStack>
            }
            w="100%"
          />
          <DataPreviewLine title="Memo:" value={memo} w="100%" />
        </VStack>
      </ModalBody>
      <ModalFooter mt="2rem" p="0" justifyContent="flex-start">
        <Button
          variant="primary"
          mr="2rem"
          p="2rem"
          borderRadius="4.5rem"
          onClick={onConfirm}
          leftIcon={
            <Icon height={26} width={26}>
              <SendIcon fill="currentColor" />
            </Icon>
          }
        >
          Confirm & Send
        </Button>
        <Button variant="link" onClick={onCancel}>
          Cancel Transaction
        </Button>
      </ModalFooter>
    </>
  )
}

const SendStep: FC<StepProps> = ({ onSend }) => {
  setTimeout(onSend, 3000)
  return (
    <ModalBody p={0}>
      <chakra.h2 mb="1rem">Transaction Processing</chakra.h2>
      <chakra.h4 mb="2rem">
        We are processing your transaction of 1.3232 $IRON. This may take a few
        minutes. Once the transaction is processed there will be a link below
        with your details.
      </chakra.h4>
      <Box
        border="0.0625rem solid"
        borderColor={NAMED_COLORS.LIGHT_GREY}
        boxShadow="0 0.25rem 0.6875rem rgba(0, 0, 0, 0.04)"
        borderRadius="0.25rem"
        p="2rem"
      >
        <Flex w="100%" justifyContent="space-between" mb="0.5rem">
          <Box>
            <chakra.h4>0% Complete</chakra.h4>
          </Box>
          <Box>
            <chakra.h5 color={NAMED_COLORS.GREY}>
              15 seconds remaining
            </chakra.h5>
          </Box>
        </Flex>
        <Progress
          borderRadius="2rem"
          isIndeterminate
          bg={NAMED_COLORS.LIGHT_GREY}
          colorScheme="blue"
        />
        <HStack justifyContent="center">
          <Image
            height="206px"
            width="136px"
            mt="2rem"
            src={'/gif/walking.gif'}
          />
        </HStack>
      </Box>
    </ModalBody>
  )
}

const ResultStep: FC<StepProps> = () => (
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
      <chakra.h2 mb="1rem">Transaction Sent!</chakra.h2>
      <chakra.h4 mb="2rem">
        To view the details of this transaction, please use the link below to
        visit our block explorer. You can also send the link below to your
        transaction receipient.
      </chakra.h4>
      <FieldGroup w="100%">
        <TextField
          label="Transaction Link"
          value="https://explorer.ironfish.network/transaction/a717490d1d8aa25d8c64ca1ab78934e0b8bc7981b40de33359ec6a8137c26484"
          InputProps={{
            textColor: NAMED_COLORS.LIGHT_BLUE,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            isReadOnly: true,
            cursor: 'pointer',
            onClick: () =>
              window.open(
                'https://explorer.ironfish.network/transaction/a717490d1d8aa25d8c64ca1ab78934e0b8bc7981b40de33359ec6a8137c26484',
                '_blank'
              ),
          }}
          width="100%"
        />
        <Button
          px="1.5rem"
          textColor={NAMED_COLORS.LIGHT_BLUE}
          rightIcon={<IconCopy w="1rem" h="1rem" />}
        >
          Copy
        </Button>
      </FieldGroup>
    </ModalBody>
  </>
)

const STEPS: FC<StepProps>[] = [ConfirmStep, SendStep, ResultStep]

const SendFlow: FC<SendFlowProps> = ({
  from,
  to,
  amount,
  memo,
  fee,
  ...props
}) => {
  const [currStep, setCurrentStep] = useState<number>(0)
  const Step = STEPS[currStep]

  const handleClose = () => {
    setCurrentStep(0)
    props.onClose && props.onClose()
  }

  return (
    <LightMode>
      <Modal {...props} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent
          w="37.5rem"
          maxW="37.5rem"
          p="4rem"
          color={NAMED_COLORS.DEEP_BLUE}
        >
          <Step
            from={from}
            to={to}
            amount={amount}
            memo={memo}
            fee={fee}
            onConfirm={() => {
              setCurrentStep(1)
            }}
            onSend={() => {
              setCurrentStep(2)
            }}
            onCancel={handleClose}
          />
        </ModalContent>
      </Modal>
    </LightMode>
  )
}

export default SendFlow
