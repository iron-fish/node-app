import { FC, useMemo, useEffect } from 'react'
import {
  FlexProps,
  SelectField,
  useColorModeValue,
  Skeleton,
  NAMED_COLORS,
} from '@ironfish/ui-kit'
import { OptionType } from '@ironfish/ui-kit/dist/components/SelectField'
import { Account } from 'Data/types/Account'
import useAccounts from 'Hooks/accounts/useAccounts'

interface AccountsSelectProps extends FlexProps {
  address: string
  label: string
  onSelectOption?: (option: OptionType) => void
}

const getAccountOptions = (accounts: Account[] = []): OptionType[] => {
  return accounts.map(account => ({
    label: account.name,
    value: account.address,
    helperText: `${account.balance} $IRON`,
  }))
}

const AccountsSelect: FC<AccountsSelectProps> = ({
  address,
  onSelectOption,
  ...props
}) => {
  const $colors = useColorModeValue(
    { start: NAMED_COLORS.PALE_GREY, end: NAMED_COLORS.LIGHT_GREY },
    { start: NAMED_COLORS.DARK_GREY, end: NAMED_COLORS.GREY }
  )
  const { data, loaded } = useAccounts()

  const options = useMemo(() => getAccountOptions(data), [JSON.stringify(data)])

  useEffect(() => {
    const selectedOption = options.find(({ value }) => value === address)
    onSelectOption(selectedOption || options[0])
  }, [options])

  return loaded ? (
    <SelectField
      options={options}
      value={options.find(({ value }) => value === address)}
      {...props}
    />
  ) : (
    <Skeleton
      w="100%"
      h="4.375rem"
      mb="2rem"
      borderRadius="0.25rem"
      startColor={$colors.start}
      endColor={$colors.end}
    />
  )
}

export default AccountsSelect
