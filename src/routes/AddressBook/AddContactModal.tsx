import { FC, useEffect, useState } from 'react'
import {
  ModalProps,
  chakra,
  NAMED_COLORS,
  TextField,
  Button,
} from '@ironfish/ui-kit'
import ModalWindow from 'Components/ModalWindow'

interface AddContactModalProps extends Omit<ModalProps, 'children'> {
  presetAddress?: string
  onAdd: (name: string, address: string) => void
}

const AddContactModal: FC<AddContactModalProps> = ({
  presetAddress,
  onAdd,
  ...modalProps
}) => {
  const [name, setName] = useState<string>('')
  const [address, setAddress] = useState<string>('')

  return (
    <ModalWindow
      {...modalProps}
      onClose={() => {
        setName('')
        setAddress('')
        modalProps.onClose()
      }}
    >
      <chakra.h3>Add Contact to Address Book</chakra.h3>
      <chakra.h5 color={NAMED_COLORS.GREY}>
        This contact name is only known to you
      </chakra.h5>
      <TextField
        label="Account Name"
        mt="1rem"
        mb="2rem"
        value={name}
        InputProps={{
          onChange: e => setName(e.target.value),
        }}
      />
      <TextField
        label="Address"
        my="1rem"
        value={presetAddress || address}
        sx={
          presetAddress
            ? {
                borderColor: NAMED_COLORS.LIGHTER_GREY,
                _hover: {
                  borderColor: NAMED_COLORS.LIGHTER_GREY,
                },
              }
            : {}
        }
        InputProps={{
          onChange: e => setAddress(e.target.value),
          isDisabled: !!presetAddress,
        }}
      />
      <Button
        variant="primary"
        my="1rem"
        py="2rem"
        width="100%"
        borderRadius="2rem"
        onClick={() => {
          onAdd(name, presetAddress || address)
          setName('')
          setAddress('')
        }}
        disabled={!name || (!presetAddress && !address)}
      >
        <chakra.h4>Add Contact</chakra.h4>
      </Button>
    </ModalWindow>
  )
}

export default AddContactModal
