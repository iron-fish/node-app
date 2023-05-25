import { FC } from 'react'
import { ChakraProps, NAMED_COLORS, chakra } from '@ironfish/ui-kit'

interface TextFieldErrorMessageProps extends ChakraProps {
  showError: boolean
  message: string
}

const TextFieldErrorMessage: FC<TextFieldErrorMessageProps> = ({
  message,
  showError,
  ...props
}) =>
  showError ? (
    <chakra.h5 mt="1rem" color={NAMED_COLORS.RED} {...props}>
      {message}
    </chakra.h5>
  ) : null

export default TextFieldErrorMessage
