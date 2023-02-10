export default interface StepProps {
  saved: boolean
  setSaved: (value: boolean) => void
  accountName: string
  setAccountName: (accountName: string) => void
  phrase: string[]
  phraseLoaded: boolean
  onNext: () => void
  onBack: () => void
  desktopMode: boolean
  handleCreateAccount: () => Promise<void>
}
