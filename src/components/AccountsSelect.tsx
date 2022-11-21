import { FC, useMemo, useEffect } from 'react'
import { FlexProps, SelectField } from '@ironfish/ui-kit'
import { OptionType } from '@ironfish/ui-kit/dist/components/SelectField'
import useAccounts from 'Hooks/accounts/useAccounts'
import CutAccount from 'Types/CutAccount'
import { CurrencyUtils } from '@ironfish/sdk/build/src/utils/currency'

interface AccountsSelectProps extends FlexProps {
  accountId: string
  label: string
  onSelectOption?: (account: CutAccount) => void
}

const getAccountOptions = (accounts: CutAccount[] = []): OptionType[] => {
  return accounts.map(account => ({
    label: account.name,
    value: account,
    helperText: CurrencyUtils.encodeIron(
      account?.balance?.confirmed || BigInt(0)
    ),
  }))
}

const AccountsSelect: FC<AccountsSelectProps> = ({
  accountId,
  onSelectOption,
  ...props
}) => {
  const [{ data }] = useAccounts()

  const options = useMemo(() => getAccountOptions(data), [JSON.stringify(data)])

  useEffect(() => {
    const selectedOption = options.find(
      ({ value }) => value.identity === accountId
    )
    onSelectOption(selectedOption?.value || options[0]?.value)
  }, [options])

  return (
    <SelectField
      options={options}
      value={options.find(({ value }) => value.identity === accountId)}
      onSelectOption={option => onSelectOption(option.value)}
      {...props}
    />
  )
}

export default AccountsSelect
