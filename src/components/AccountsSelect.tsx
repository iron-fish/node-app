import { FC, useMemo, useEffect } from 'react'
import { FlexProps, SelectField } from '@ironfish/ui-kit'
import { OptionType } from '@ironfish/ui-kit/dist/components/SelectField'
import { Account } from 'Data/types/Account'
import useAccounts from 'Hooks/accounts/useAccounts'

interface AccountsSelectProps extends FlexProps {
  value: OptionType
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

const AccountsSelect: FC<AccountsSelectProps> = props => {
  const { data, loaded } = useAccounts()

  const options = useMemo(() => getAccountOptions(data), [JSON.stringify(data)])

  useEffect(() => props.onSelectOption(options[0]), [options])

  return loaded ? <SelectField options={options} {...props} /> : null
}

export default AccountsSelect
