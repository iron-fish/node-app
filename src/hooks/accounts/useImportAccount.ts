const useImportAccount = () => {
  return [
    window.DemoDataManager.accounts.importBySpendingKey,
    window.DemoDataManager.accounts.importByMnemonicPhrase,
    window.DemoDataManager.accounts.importByFile,
  ] as const
}

export default useImportAccount
