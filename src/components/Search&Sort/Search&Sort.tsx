import { FC } from 'react'
import { Flex, FlexProps } from '@ironfish/ui-kit'
import SearchInput, { SearchInputProps } from './SearchInput'
import SortSelect, { SelectFieldProps } from './SortSelect'

interface SearchSortFieldProps extends SearchInputProps {
  ContainerProps?: FlexProps
  SortSelectProps?: SelectFieldProps
  sortValue?: 'asc' | 'desc'
}

const OPTIONS = [
  {
    label: 'Highest to lowest balance',
    value: 'desc',
  },
  {
    label: 'Lowest to highest balance',
    value: 'asc',
  },
]

const SearchSortField: FC<SearchSortFieldProps> = ({
  sortValue,
  ContainerProps,
  SortSelectProps,
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
      options={OPTIONS}
      value={OPTIONS.find(({ value }) => value === sortValue)}
    />
  </Flex>
)

export default SearchSortField
