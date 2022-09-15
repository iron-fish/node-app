const useImportAccount = () => {
  return [
    window.DemoDataManager.importAccountBySpendingKey,
    window.DemoDataManager.importAccountByMnemonicPhrase,
    window.DemoDataManager.importAccountByFile,
  ] as const
}

export default useImportAccount
