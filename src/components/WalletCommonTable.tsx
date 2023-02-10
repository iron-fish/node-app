import { FC } from 'react'
import { CommonTable } from '@ironfish/ui-kit'
import {
  CommonTableProps,
  TableComponentProps,
} from '@ironfish/ui-kit/dist/components/Table/types'

const DEFAULT_TABLE_PROPS: TableComponentProps = {
  tableHeadProps: {
    display: { base: 'none', md: 'table-header-group' },
  },
  tableBodyRowProps: {
    display: {
      base: 'flex',
      md: 'table-row',
    },
    flexWrap: {
      base: 'wrap',
      md: 'nowrap',
    },
    p: { base: '1rem 0', md: '1rem' },
  },
  tableBodyCellProps: {
    px: {
      base: '2rem',
      md: 'inherit',
    },
    py: {
      base: '1rem',
      md: '1.625rem',
    },
  },
}

const DEFAULT_TABLE_ROW_ITEM_PROPS: TableComponentProps = {
  tableHeadRowProps: {
    display: { base: 'block', md: 'none' },
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WalletCommonTable: FC<CommonTableProps<any>> = props => {
  return (
    <CommonTable
      tableComponentProps={DEFAULT_TABLE_PROPS}
      tableComponentRowItemProps={DEFAULT_TABLE_ROW_ITEM_PROPS}
      {...props}
    />
  )
}

export default WalletCommonTable
