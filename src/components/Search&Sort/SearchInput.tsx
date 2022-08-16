import { FC } from 'react'
import {
  IconSearch,
  Input,
  InputGroup,
  InputGroupProps,
  InputLeftElement,
  InputProps,
} from '@ironfish/ui-kit'

export interface SearchInputProps {
  GroupProps?: InputGroupProps
  SearchProps?: InputProps
}

const SearchInput: FC<SearchInputProps> = ({ GroupProps, SearchProps }) => (
  <InputGroup variant="search" mr="1rem" {...GroupProps}>
    <InputLeftElement pointerEvents="none">
      <IconSearch />
    </InputLeftElement>
    <Input placeholder="Search" {...SearchProps} />
  </InputGroup>
)

export default SearchInput
