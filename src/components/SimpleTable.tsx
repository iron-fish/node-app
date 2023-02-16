import { FC } from 'react'
import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  NAMED_COLORS,
  useColorModeValue,
} from '@ironfish/ui-kit'
import { CommonTableProps } from '@ironfish/ui-kit/dist/components/Table/types'
import RowItemSpin from '@ironfish/ui-kit/dist/components/Table/RowItemSpin'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SimpleTable: FC<CommonTableProps<any>> = ({
  data = null,
  columns = [],
  textTransform = 'uppercase',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onRowClick,
  ...rest
}) => {
  const $colors = useColorModeValue(
    { bg: NAMED_COLORS.WHITE, borderColor: NAMED_COLORS.LIGHT_GREY },
    { bg: NAMED_COLORS.DARKER_GREY, borderColor: NAMED_COLORS.DARK_GREY }
  )
  return (
    <Table {...rest}>
      <Thead>
        <Tr>
          {columns.map(column => (
            <Th
              textTransform={textTransform}
              px="1rem !important"
              _first={{ pl: '2rem !important' }}
              _last={{ pr: '2rem !important' }}
              key={column.key}
            >
              {column.label}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody borderColor={$colors.borderColor}>
        {data?.map((item, index) => (
          <Tr
            key={item?.id || `load-${index}`}
            bg={$colors.bg}
            mb="1rem"
            border="0.063rem solid"
            borderRadius="0.25rem"
            borderColor="inherit"
            boxShadow="0 0.25rem 0.668rem rgba(0, 0, 0, 0.04)"
            p={{ base: '1rem 0', lg: '1rem' }}
            cursor={item && onRowClick ? 'pointer' : 'default'}
            onClick={() => item && onRowClick && onRowClick(item)}
          >
            {columns.map(column => (
              <Td
                key={column.key}
                {...column.WrapperProps}
                px={{
                  base: '1rem !important',
                  lg: 'inherit',
                }}
                py={{
                  base: '1rem',
                  lg: '1.625rem',
                }}
                borderTop="inherit !important"
                borderBottom="inherit !important"
                _first={{
                  pl: '2rem !important',
                  pr: { base: '0.5rem', md: '2rem' },
                  borderLeft: 'inherit !important',
                }}
                _last={{
                  pr: '2rem !important',
                  pl: { base: '0.75rem', md: '2rem' },
                  borderRight: 'inherit !important',
                }}
              >
                {item ? column.render(item) : <RowItemSpin minW="4rem" />}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

export default SimpleTable
