import { Flex, chakra, NAMED_COLORS } from '@ironfish/ui-kit'
import { FC, useState } from 'react'
import { ROUTES } from 'Routes/data'
import BackButtonLink from 'Components/BackButtonLink'
import useCreateAccount from 'Hooks/accounts/useCreateAccount'
import CreateStep from './CreateStep'
import ValidateStep from './ValidateStep'
import StepProps from './StepProps'

const STEPS: FC<StepProps>[] = [CreateStep, ValidateStep]

interface CreateAccountProps {
  desktopMode?: boolean
  onCreate?: VoidFunction
}

const CreateAccount: FC<CreateAccountProps> = ({
  desktopMode = true,
  onCreate = () => undefined,
}) => {
  const [currStep, setCurrentStep] = useState<number>(0)
  const Step = STEPS[currStep]
  const [saved, setSaved] = useState<boolean>(false)
  const [accountName, setAccountName] = useState<string>('')
  const {
    data: account,
    loaded,
    actions: { confirmAccountCreation },
  } = useCreateAccount()

  const handleCreateAccount = () =>
    confirmAccountCreation(accountName).then(() => {
      onCreate()
    })

  return (
    <Flex
      flexDirection="column"
      p={desktopMode ? '4rem' : 0}
      pb="0"
      bg="transparent"
      w="100%"
    >
      {desktopMode && (
        <>
          <BackButtonLink
            mb="2rem"
            to={currStep === 0 ? ROUTES.ONBOARDING : '#'}
            onClick={() => {
              currStep > 0 && setCurrentStep(0)
            }}
            label={'Go Back'}
          />
          <chakra.h1 mb="1.5rem" color={NAMED_COLORS.BLACK}>
            Create Account
          </chakra.h1>
        </>
      )}
      <Step
        saved={saved}
        setSaved={setSaved}
        accountName={accountName}
        setAccountName={setAccountName}
        phrase={account?.mnemonicPhrase}
        phraseLoaded={loaded}
        handleCreateAccount={handleCreateAccount}
        onNext={() => setCurrentStep(1)}
        onBack={() => setCurrentStep(0)}
        desktopMode={desktopMode}
      />
    </Flex>
  )
}

export default CreateAccount
