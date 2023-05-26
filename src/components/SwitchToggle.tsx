import { Switch, SwitchProps, NAMED_COLORS } from '@ironfish/ui-kit'
import { FC } from 'react'

const SwitchToggle: FC<SwitchProps> = ({ ...props }) => (
  <Switch
    size="lg"
    sx={{
      '.chakra-switch__track': {
        bg: NAMED_COLORS.WHITE,
        border: `0.0625rem solid ${NAMED_COLORS.LIGHT_GREY}`,
        _checked: {
          bg: NAMED_COLORS.WHITE,
        },
        _focus: {
          boxShadow: 'none',
        },
      },
      '.chakra-switch__thumb': {
        _checked: {
          background: '#389810',
        },
        background: NAMED_COLORS.DEEP_BLUE,
      },
    }}
    {...props}
  />
)

export default SwitchToggle
