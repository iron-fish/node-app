import { FC, ReactNode, useEffect, useState } from 'react'
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
  Link,
} from '@ironfish/ui-kit'
import IconCopy from '@ironfish/ui-kit/dist/svgx/icon-copy'
import Contact from 'Types/Contact'
import SendIcon from 'Svgx/send'
import CutAccount from 'Types/CutAccount'
import { truncateHash } from 'Utils/hash'
import useSendFlow from 'Hooks/transactions/useSendFlow'
import Transaction, { TransactionStatus } from 'Types/Transaction'
import { ORE_TO_IRON } from '@ironfish/sdk/build/src/utils/currency'
import useAddressBook from 'Hooks/addressBook/useAddressBook'

interface SendFlowProps extends Omit<ModalProps, 'children'>, SendProps {}

interface SendProps {
  from: CutAccount
  to: Contact
  amount: number
  memo: string
  fee: number
  transaction: Transaction | null
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
  onSend: (transaction: Transaction) => void
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
  const [contactName, setContactName] = useState('')
  const [showAddName, setShowAddName] = useState(false)
  const [toContact, setToContact] = useState<Contact>(to)
  const [{ data: contacts }, addContact] = useAddressBook()

  useEffect(() => {
    const contact = contacts?.find(
      ({ address }) => address === toContact.address
    )
    if (contact) {
      setToContact(contact)
    }
  }, [JSON.stringify(contacts)])

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
              <Flex direction="column">
                <HStack w="100%" justifyContent="space-between">
                  {toContact.name && toContact._id !== toContact.address ? (
                    <chakra.h4 whiteSpace="nowrap">{toContact.name}</chakra.h4>
                  ) : (
                    <chakra.h4
                      cursor="pointer"
                      color={NAMED_COLORS.LIGHT_BLUE}
                      whiteSpace="nowrap"
                      onClick={() => setShowAddName(true)}
                    >
                      Add New Contact?
                    </chakra.h4>
                  )}
                  <chakra.h5
                    pl="4rem"
                    color={NAMED_COLORS.GREY}
                    whiteSpace="nowrap"
                    overflow="hidden"
                  >
                    {truncateHash(to.address, 2, 16)}
                  </chakra.h5>
                </HStack>
                {showAddName && (
                  <Flex direction="column">
                    <TextField
                      label="Contact Name"
                      my="1rem"
                      value={contactName}
                      InputProps={{
                        onChange: e => setContactName(e.target.value),
                      }}
                    />
                    <Flex>
                      <Button
                        variant="primary"
                        size="medium"
                        mr="1.5rem"
                        isDisabled={!contactName.trim()}
                        onClick={() => {
                          addContact(contactName, to.address).then(() => {
                            setShowAddName(false)
                            setContactName('')
                          })
                        }}
                      >
                        Add Contact
                      </Button>
                      <Button
                        _hover={{ textDecoration: 'unset' }}
                        variant="link"
                        size="medium"
                        onClick={() => {
                          setShowAddName(false)
                          setContactName('')
                        }}
                      >
                        Cancel
                      </Button>
                    </Flex>
                  </Flex>
                )}
              </Flex>
            }
            flexDirection={to.name ? 'column' : 'row'}
            w="100%"
            overflow="hidden"
          />
          <DataPreviewLine
            title="Amount:"
            value={
              <HStack w="100%" justifyContent="space-between">
                <chakra.h4>{amount} $IRON</chakra.h4>
                <chakra.h5 color={NAMED_COLORS.GREY}>USD $--</chakra.h5>
              </HStack>
            }
            w="100%"
          />
          <DataPreviewLine
            title="Fee:"
            value={
              <HStack w="100%" justifyContent="space-between">
                <chakra.h4>{fee.toFixed(8)} $IRON</chakra.h4>
                <chakra.h5 color={NAMED_COLORS.GREY}>USD $--</chakra.h5>
              </HStack>
            }
            w="100%"
          />
          <DataPreviewLine
            title="Total:"
            value={
              <HStack w="100%" justifyContent="space-between">
                <chakra.h4>
                  {(amount * ORE_TO_IRON + fee * ORE_TO_IRON) / ORE_TO_IRON}
                  &nbsp;$IRON
                </chakra.h4>
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
        <Link onClick={onCancel}>Cancel Transaction</Link>
      </ModalFooter>
    </>
  )
}

const getProgress = (transaction: Transaction): number => {
  switch (transaction?.status) {
    case TransactionStatus.UNKNOWN:
      return 10
    case TransactionStatus.UNCONFIRMED:
      return 25
    case TransactionStatus.PENDING:
      return 50
    case TransactionStatus.CONFIRMED:
    case TransactionStatus.EXPIRED:
      return 100
    default:
      return 0
  }
}

const SendStep: FC<StepProps> = ({ amount, fee, from, to, memo, onSend }) => {
  const transaction = useSendFlow(from.id, amount, memo, to.address, fee)

  useEffect(() => {
    if (
      transaction?.status === TransactionStatus.CONFIRMED ||
      transaction?.status === TransactionStatus.EXPIRED
    ) {
      onSend(transaction)
    }
  }, [transaction?.status])

  const progress = getProgress(transaction)

  return (
    <ModalBody p={0}>
      <chakra.h2 mb="1rem">Transaction Processing</chakra.h2>
      <chakra.h4 mb="2rem">
        We are processing your transaction of {amount} $IRON. This may take a
        few minutes. Once the transaction is processed there will be a link
        below with your details.
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
            <chakra.h4>{progress}% Complete</chakra.h4>
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
          variant="ironLightBlue"
        />
        <HStack justifyContent="center">
          <Image
            height="12.875rem"
            width="8.5rem"
            mt="2rem"
            src={'/gif/walking.gif'}
          />
        </HStack>
      </Box>
    </ModalBody>
  )
}

const ResultStep: FC<StepProps> = ({ transaction }) => (
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
          value={`https://explorer.ironfish.network/transaction/${transaction.hash}`}
          InputProps={{
            textColor: NAMED_COLORS.LIGHT_BLUE,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            isReadOnly: true,
            cursor: 'pointer',
            onClick: () =>
              window.open(
                `https://explorer.ironfish.network/transaction/${transaction.hash}`,
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

const SendFlow: FC<Omit<SendFlowProps, 'transaction'>> = ({
  from,
  to,
  amount,
  memo,
  fee,
  ...props
}) => {
  const [currStep, setCurrentStep] = useState<number>(0)
  const [transaction, setTransaction] = useState<Transaction | null>(null)
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
            transaction={transaction}
            onSend={t => {
              setTransaction(t)
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
