import { FC } from 'react'
import { Flex, FlexProps } from '@ironfish/ui-kit'
import SearchInput, { SearchInputProps } from './SearchInput'
import SortSelect, { SelectFieldProps } from './SortSelect'

interface SearchSortFieldProps extends SearchInputProps {
  ContainerProps?: FlexProps
  SortSelectProps?: SelectFieldProps
}

const SearchSortField: FC<SearchSortFieldProps> = ({
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
    <SortSelect {...SortSelectProps} />
  </Flex>
)

export default SearchSortField
