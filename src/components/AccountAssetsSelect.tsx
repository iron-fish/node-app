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

const getAssetOptions = (assets: AccountBalance[] = []): OptionType[] => {
  return assets.map(asset => ({
    label: asset.asset.name,
    value: asset,
    helperText: formatOreToTronWithLanguage(asset?.confirmed || BigInt(0)),
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
      options={options}
      value={options.find(({ value }) => value.asset.id === selected.asset?.id)}
      onSelectOption={option => onSelectOption(option.value)}
      {...props}
    />
  )
}

export default AccountAssetsSelect
