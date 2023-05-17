import { FC, ReactNode, useMemo } from 'react'
import { SelectField, Flex, Box, Tooltip } from '@ironfish/ui-kit'
import { OptionType } from '@ironfish/ui-kit/dist/components/SelectField'

const Option: FC<{ label: ReactNode }> = ({ label }) => {
  return (
    <Flex
      p="0.375rem 1rem"
      minH="1.875rem"
      alignItems="center"
      cursor="pointer"
    >
      <Box overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
        {label}
      </Box>
    </Flex>
  )
}

interface NodeWorkersSelectProps {
  onSelectOption?: (option: OptionType) => void
  value: string
}

const NodeWorkersSelect: FC<NodeWorkersSelectProps> = ({
  value,
  onSelectOption,
}) => {
  const selectOptions = useMemo(() => {
    let options = [...new Array(window.navigator.hardwareConcurrency || 0)]
    options = [
      {
        value: -1,
        label: 'Auto-detect',
      },
      {
        value: 0,
        label: 'Disable',
      },
    ].concat(
      ...options.map((_, index) => ({
        value: index + 1,
        label: (index + 1).toString(),
      }))
    )

    return options
  }, [])

  return (
    <Tooltip
      label={
        'The number of CPU workers to use for long-running node operations, \
         like creating transactions and verifying blocks. 0 disables workers \
          (this is likely to cause performance issues), and -1 auto-detects \
           based on the number of CPU cores. Each worker uses several hundred \
            MB of memory, so try a lower value to reduce memory consumption.'
      }
      placement="top"
    >
      <Box>
        <SelectField
          h="69px"
          value={selectOptions.find(option => option?.value === Number(value))}
          onSelectOption={onSelectOption}
          options={selectOptions}
          label="Node workers"
          renderOption={option => <Option label={option.label} />}
        />
      </Box>
    </Tooltip>
  )
}

export default NodeWorkersSelect
