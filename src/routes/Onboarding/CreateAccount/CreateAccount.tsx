import { Flex, chakra, NAMED_COLORS, useIronToast } from '@ironfish/ui-kit'
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
  const [{ data: phrase, loaded: phraseLoaded }, createAccount] =
    useCreateAccount()
  const toast = useIronToast({
    title: 'Account Created',
    containerStyle: {
      mb: '1rem',
    },
  })

  const handleCreateAccount = () =>
    createAccount(accountName).then(() => {
      onCreate()
      toast()
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
        phrase={phrase}
        phraseLoaded={phraseLoaded}
        handleCreateAccount={handleCreateAccount}
        onNext={() => setCurrentStep(1)}
        desktopMode={desktopMode}
      />
    </Flex>
  )
}

export default CreateAccount
