import { FC, useMemo, useEffect } from 'react'
import { FlexProps, SelectField } from '@ironfish/ui-kit'
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
  const { data } = useAccounts()

  const options = useMemo(() => getAccountOptions(data), [JSON.stringify(data)])

  useEffect(() => {
    const selectedOption = options.find(({ value }) => value === address)
    onSelectOption(selectedOption || options[0])
  }, [options])

  return (
    <SelectField
      options={options}
      value={options.find(({ value }) => value === address)}
      {...props}
    />
  )
}

export default AccountsSelect
