import { FC, ReactNode, useEffect, useState } from 'react'
import {
  Button,
  chakra,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  ModalProps,
  NAMED_COLORS,
  StyleProps,
  TextField,
  VStack,
  Icon,
  Link,
  LightMode,
  Progress,
} from '@ironfish/ui-kit'
import Contact from 'Types/Contact'
import SendIcon from 'Svgx/send'
import CutAccount from 'Types/CutAccount'
import { truncateHash } from 'Utils/hash'
import Transaction from 'Types/Transaction'
import { formatOreToTronWithLanguage } from 'Utils/number'
import useAddressBook from 'Hooks/addressBook/useAddressBook'
import ArrowRight from 'Svgx/ArrowRight'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from 'Routes/data'
import Asset from 'Types/Asset'

interface SendFlowProps extends Omit<ModalProps, 'children'>, SendProps {
  cleanUp: () => void
}

interface SendProps {
  from: CutAccount
  to: Contact
  asset: Asset
  amount: bigint
  memo: string
  fee: bigint
  transaction: Transaction | null
  onCreateAccount: (contact: Contact) => void
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
}

const ConfirmStep: FC<StepProps> = ({
  onConfirm,
  onCancel,
  from,
  to,
  asset,
  amount,
  memo,
  fee,
  onCreateAccount,
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
                          addContact(contactName, to.address).then(contact => {
                            setShowAddName(false)
                            setContactName('')
                            onCreateAccount(contact)
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
                <chakra.h4>
                  {formatOreToTronWithLanguage(amount)} {asset.name}
                </chakra.h4>
                <chakra.h5 color={NAMED_COLORS.GREY}>USD $--</chakra.h5>
              </HStack>
            }
            w="100%"
          />
          <DataPreviewLine
            title="Fee:"
            value={
              <HStack w="100%" justifyContent="space-between">
                <chakra.h4>
                  {formatOreToTronWithLanguage(fee)} {asset.name}
                </chakra.h4>
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
                  {formatOreToTronWithLanguage(amount + fee)}
                  &nbsp;{asset.name}
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
              size="small"
              rightIcon={<ArrowRight mr="-0.5rem" />}
              onClick={() =>
                navigate(ROUTES.ACCOUNT, { state: { accountId: from.id } })
              }
            >
              View Account Activity
            </Button>
            <Button
              variant="primary"
              size="small"
              rightIcon={<ArrowRight mr="-0.5rem" />}
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

const STEPS: FC<StepProps>[] = [ConfirmStep, ResultStep]

const SendFlow: FC<Omit<SendFlowProps, 'transaction'>> = ({
  from,
  to,
  amount,
  memo,
  fee,
  asset,
  onCreateAccount,
  ...props
}) => {
  const [currStep, setCurrentStep] = useState<number>(0)
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const Step = STEPS[currStep]

  const handleClose = () => {
    setCurrentStep(0)
    props.onClose && props.onClose()
    if (props.cleanUp && currStep > 0) {
      props.cleanUp()
    }
  }

  const send = () =>
    window.IronfishManager.transactions
      .send(
        from.id,
        {
          amount,
          memo,
          publicAddress: to.address,
        },
        fee,
        asset.id
      )
      .then(setTransaction)

  return (
    <LightMode>
      <Modal
        {...props}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        onClose={handleClose}
      >
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
            asset={asset}
            onConfirm={() => {
              setCurrentStep(1)
              send()
            }}
            transaction={transaction}
            onCancel={handleClose}
            onCreateAccount={onCreateAccount}
          />
        </ModalContent>
      </Modal>
    </LightMode>
  )
}

export default SendFlow
