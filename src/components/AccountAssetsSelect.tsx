import { FC, useMemo, useEffect } from 'react'
import { FlexProps, SelectField } from '@ironfish/ui-kit'
import { OptionType } from '@ironfish/ui-kit/dist/components/SelectField'
import { formatOreToTronWithLanguage } from 'Utils/number'
import AccountBalance from 'Types/AccountBalance'

interface AccountAssetsSelectProps extends FlexProps {
  label: string
  assets: AccountBalance[]
  selected: AccountBalance
  onSelectOption?: (assetBalance: AccountBalance) => void
}

const getAssetOptions = (
  assetsBalance: AccountBalance[] = []
): OptionType[] => {
  return assetsBalance.map(assetBalance => ({
    label: `${assetBalance.asset.name}: ${formatOreToTronWithLanguage(
      assetBalance?.confirmed || BigInt(0)
    )}`,
    value: { ...assetBalance, ...assetBalance.asset },
  }))
}

const AccountAssetsSelect: FC<AccountAssetsSelectProps> = ({
  assets,
  selected,
  onSelectOption,
  ...props
}) => {
  const options = useMemo(
    () => getAssetOptions(assets),
    [
      JSON.stringify(
        assets.map(
          (item: AccountBalance) =>
            `${item.asset.id}-${item.confirmed}-${item.unconfirmed}`
        )
      ),
    ]
  )

  useEffect(() => {
    const selectedOption =
      options.find(({ value }) => value.asset.id === selected.asset.id) ||
      options[0]
    onSelectOption(selectedOption?.value)
  }, [options])

  return (
    <SelectField
      size="small"
      options={options}
      value={options.find(({ value }) => value.asset.id === selected.asset?.id)}
      onSelectOption={option => onSelectOption(option.value)}
      {...props}
    />
  )
}

export default AccountAssetsSelect
