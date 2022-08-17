import { FC, ReactNode } from 'react'
import { FlexProps, SelectField } from '@ironfish/ui-kit'
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

const SortSelect: FC<SelectFieldProps> = props => (
  <SelectField
    label="Sort by"
    minWidth="15rem"
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    size="small"
    options={[
      {
        label: 'Highest to lowest balance',
        value: 'desc',
      },
      {
        label: 'Lowest to highest balance',
        value: 'asc',
      },
    ]}
    whiteSpace="nowrap"
    {...props}
  />
)

export default SortSelect
