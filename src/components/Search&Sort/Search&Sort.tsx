import { FC } from 'react'
import { Flex, FlexProps } from '@ironfish/ui-kit'
import SearchInput, { SearchInputProps } from './SearchInput'
import SortSelect, { SelectFieldProps } from './SortSelect'
import SortType from 'Types/SortType'

interface SortSelectOption {
  label: string
  value: SortType
}

interface SearchSortFieldProps extends SearchInputProps {
  ContainerProps?: FlexProps
  SortSelectProps?: SelectFieldProps
  sortValue?: SortType
  options?: SortSelectOption[]
}

const OPTIONS = [
  {
    label: 'Highest to lowest balance',
    value: SortType.DESC,
  },
  {
    label: 'Lowest to highest balance',
    value: SortType.ASC,
  },
]

const SearchSortField: FC<SearchSortFieldProps> = ({
  sortValue,
  ContainerProps,
  SortSelectProps,
  options = OPTIONS,
  ...SearchProps
}) => (
  <Flex
    justifyContent="space-between"
    w="100%"
    alignItems="center"
    {...ContainerProps}
  >
    <SearchInput {...SearchProps} />
    <SortSelect
      {...SortSelectProps}
      options={options}
      value={options.find(({ value }) => value === sortValue)}
    />
  </Flex>
)

export default SearchSortField
