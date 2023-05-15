import { FC, useMemo, useEffect } from 'react'
import { FlexProps, SelectField } from '@ironfish/ui-kit'
import { OptionType } from '@ironfish/ui-kit/dist/components/SelectField'
import useAccounts from 'Hooks/accounts/useAccounts'
import CutAccount from 'Types/CutAccount'
import { formatOreToTronWithLanguage } from 'Utils/number'
import { truncateHash } from 'Utils/hash'

interface AccountsSelectProps extends FlexProps {
  accountId: string
  label: string
  onSelectOption?: (account: CutAccount) => void
  showBalance?: boolean
  watchBalance?: boolean
}

const getAccountOptions = (
  accounts: CutAccount[] = [],
  showBalance: boolean
): OptionType[] => {
  return accounts.map(account => ({
    label: account.name,
    value: account,
    helperText: showBalance
      ? formatOreToTronWithLanguage(
          account?.balances?.default?.confirmed || BigInt(0)
        ) +
          ' ' +
          account?.balances?.default?.asset?.name || ''
      : truncateHash(account.publicAddress, 2, 4),
  }))
}

const AccountsSelect: FC<AccountsSelectProps> = ({
  accountId,
  onSelectOption,
  showBalance = true,
  watchBalance = false,
  ...props
}) => {
  const [{ data, loaded }, reloadAccounts] = useAccounts()

  useEffect(() => {
    let timeout: NodeJS.Timer
    if (loaded && watchBalance) {
      timeout = setInterval(reloadAccounts, 5000)
    }

    return () => timeout && clearInterval(timeout)
  }, [loaded])

  const options = useMemo(
    () => getAccountOptions(data, showBalance),
    [
      JSON.stringify(data, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      ),
    ]
  )

  useEffect(() => {
    const selectedOption =
      options.find(({ value }) => value.id === accountId) || options[0]
    onSelectOption(selectedOption?.value)
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
