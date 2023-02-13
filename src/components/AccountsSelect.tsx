import { FC, useMemo, useEffect } from 'react'
import { FlexProps, SelectField } from '@ironfish/ui-kit'
import { OptionType } from '@ironfish/ui-kit/dist/components/SelectField'
import useAccounts from 'Hooks/accounts/useAccounts'
import CutAccount from 'Types/CutAccount'
import { formatOreToTronWithLanguage } from 'Utils/number'

interface AccountsSelectProps extends FlexProps {
  accountId: string
  label: string
  onSelectOption?: (account: CutAccount) => void
}

const getAccountOptions = (accounts: CutAccount[] = []): OptionType[] => {
  return accounts.map(account => ({
    label: account.name,
    value: account,
    helperText:
      formatOreToTronWithLanguage(
        account?.balances?.default?.confirmed || BigInt(0)
      ) +
      ' ' +
      account?.balances?.default?.asset?.name,
  }))
}

const AccountsSelect: FC<AccountsSelectProps> = ({
  accountId,
  onSelectOption,
  ...props
}) => {
  const [{ data }] = useAccounts()

  const options = useMemo(
    () => getAccountOptions(data),
    [
      JSON.stringify(data, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      ),
    ]
  )

  useEffect(() => {
    const selectedOption =
      options.find(({ value }) => value.id === accountId) || options[0]
    onSelectOption(selectedOption?.value || options[0]?.value)
  }, [options])

  return (
    <SelectField
      options={options}
      value={options.find(({ value }) => value.id === accountId)}
      onSelectOption={option => onSelectOption(option.value)}
      {...props}
    />
  )
}

export default AccountsSelect
