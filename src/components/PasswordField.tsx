import { FC, useCallback, useEffect, useState } from 'react'

import {
  HStack,
  InputProps as InputPropsType,
  StyleProps,
  TextField,
} from '@ironfish/ui-kit'
import IconBlinkingEye from '@ironfish/ui-kit/dist/svgx/icon-blinkingEye'
import IconInfo from '@ironfish/ui-kit/dist/svgx/icon-info'
import debounce from 'lodash/debounce'

interface PasswordFieldProps extends StyleProps {
  label?: string
  placeholder?: string
  value?: string
  InputProps?: InputPropsType
  onChange?: (pass: string) => void
}

const PasswordField: FC<PasswordFieldProps> = ({
  label = 'Password',
  placeholder = 'Enter password',
  value,
  InputProps,
  onChange = () => undefined,
  ...props
}) => {
  const [show, setShow] = useState(false)
  const [pass, setPassword] = useState('')
  const debouncedChange = useCallback(debounce(onChange, 150), [onChange])

  useEffect(() => {
    value !== pass && setPassword(value || '')
  }, [value])

  const onPasswordChange = (e: any) => {
    setPassword(e.target.value)
    debouncedChange(e.target.value)
  }

  return (
    <TextField
      label={label}
      InputProps={{
        onChange: onPasswordChange,
        type: show ? 'text' : 'password',
        placeholder: placeholder,
        ...InputProps,
      }}
      value={pass}
      w="100%"
      RightAddons={
        <HStack marginLeft={'2.5rem'} spacing={'0.875rem'}>
          <IconBlinkingEye
            cursor="pointer"
            closed={show}
            onClick={() => setShow(!show)}
          />
        </HStack>
      }
      {...props}
    />
  )
}

export default PasswordField
