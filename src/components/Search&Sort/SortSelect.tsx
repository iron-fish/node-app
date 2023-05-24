import { FC, ReactNode } from 'react'
import {
  FlexProps,
  SelectField,
  useBreakpointValue,
  Flex,
  ArrowUpArrowDownIcon,
} from '@ironfish/ui-kit'
import { OptionType } from '@ironfish/ui-kit/dist/components/SelectField'

//TODO: Need add export of type in ui-kit lib
export interface SelectFieldProps extends FlexProps {
  label?: string
  value?: OptionType
  options?: OptionType[]
  size?: string
  renderOption?: (option: OptionType) => ReactNode
  renderSelected?: (option: OptionType) => ReactNode
  onSelectOption?: (option: OptionType) => void
}

const renderLabel = (label: string) => {
  return (
    <Flex alignItems="center" gap="5px">
      <ArrowUpArrowDownIcon />
      {label}
    </Flex>
  )
}

const SortSelect: FC<SelectFieldProps> = props => {
  const breakpointProps = useBreakpointValue({
    base: { size: 'compact', renderLabel },
    sm2: { size: 'small', renderLabel: undefined },
  })
  return (
    <SelectField
      label="Sort by"
      minWidth={{ base: 'min-content', sm2: '15rem' }}
      {...breakpointProps}
      whiteSpace="nowrap"
      {...props}
    />
  )
}

export default SortSelect
