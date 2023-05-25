import { FC, useEffect, useState } from 'react'
import {
  Button,
  chakra,
  Flex,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  NAMED_COLORS,
  TextField,
  VStack,
  Link,
} from '@ironfish/ui-kit'
import Contact from 'Types/Contact'
import { truncateHash } from 'Utils/hash'
import { formatOreToTronWithLanguage } from 'Utils/number'
import useAddressBook from 'Hooks/addressBook/useAddressBook'
import { StepProps } from './SendFlowTypes'
import DataPreviewLine from './DataPreviewLine'

const ConfirmStep: FC<StepProps> = ({
  onConfirm,
  onCancel,
  from,
  to,
  amount,
  asset,
  fee,
  feeAsset,
  memo,
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
          <DataPreviewLine
            title="From:"
            value={
              <chakra.div
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                ml="1rem"
              >
                {from.name}
              </chakra.div>
            }
            w="100%"
          />
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
                    pl="1rem"
                    // color={NAMED_COLORS.GREY}
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
              <chakra.h4 textAlign="end" whiteSpace="nowrap">
                {formatOreToTronWithLanguage(amount)} {asset.name}
              </chakra.h4>
            }
            w="100%"
          />
          <DataPreviewLine
            title="Fee:"
            value={
              <chakra.h4 textAlign="end" whiteSpace="nowrap">
                {formatOreToTronWithLanguage(fee)} $IRON
              </chakra.h4>
            }
            w="100%"
          />
          <DataPreviewLine
            title="Total:"
            value={
              <Flex direction="column">
                <chakra.h4 textAlign="end">
                  {formatOreToTronWithLanguage(amount)}
                  &nbsp;{asset.name}
                </chakra.h4>
                {asset.id !== feeAsset.id && (
                  <chakra.h4 textAlign="end">
                    {formatOreToTronWithLanguage(fee)}
                    &nbsp;{feeAsset.name}
                  </chakra.h4>
                )}
              </Flex>
            }
            w="100%"
          />
          {memo?.trim() && (
            <DataPreviewLine title="Memo:" value={memo} w="100%" />
          )}
        </VStack>
      </ModalBody>
      <ModalFooter mt="2rem" p="0" justifyContent="flex-start">
        <Button variant="primary" mr="2rem" size="medium" onClick={onConfirm}>
          Confirm & Send
        </Button>
        <Link onClick={onCancel}>Cancel Transaction</Link>
      </ModalFooter>
    </>
  )
}

export default ConfirmStep
