import { FC, useState } from 'react'
import { Badge, NAMED_COLORS } from '@ironfish/ui-kit'
import AccountBalance from 'Types/AccountBalance'
import AssetsAmountPreviewModal from './AssetsAmountPreview/AssetsAmountPreviewModal'

interface AssetsBadgeProps {
  assets: AccountBalance[]
}

const AssetsBadge: FC<AssetsBadgeProps> = ({ assets }) => {
  const [showAssetsInfo, setShowAssetsInfo] = useState(false)

  return assets && assets.length ? (
    <>
      <Badge
        _hover={{
          outline: `0.0625rem solid ${NAMED_COLORS.GREY}`,
        }}
        textTransform="capitalize"
        p="0.125rem 0.875rem"
        borderRadius="3.125rem"
        bgColor={NAMED_COLORS.LIGHTER_GREY}
        color={NAMED_COLORS.GREY}
        _dark={{
          bgColor: NAMED_COLORS.LIGHTER_GREY,
          color: NAMED_COLORS.GREY,
          _hover: {
            outline: `0.0625rem solid ${NAMED_COLORS.PALE_GREY}`,
          },
        }}
        onClick={e => {
          e.stopPropagation()
          setShowAssetsInfo(true)
        }}
      >
        <h5>{`+${assets.length} Asset${assets.length === 1 ? '' : 's'}`}</h5>
      </Badge>
      {showAssetsInfo && (
        <AssetsAmountPreviewModal
          header="Assets"
          assetAmounts={assets.map(({ confirmed, asset }) => ({
            value: confirmed,
            asset,
          }))}
          isOpen={showAssetsInfo}
          onClose={() => setShowAssetsInfo(false)}
        />
      )}
    </>
  ) : null
}

export default AssetsBadge
