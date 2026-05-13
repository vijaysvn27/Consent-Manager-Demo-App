import { DemoProvider, useDemo } from './store/store'
import AMSetup from './flows/AMSetup'
import LandingPage from './flows/LandingPage'
import AuthFlow from './flows/AuthFlow'
import ConsenTick from './flows/ConsenTick'
import DemoShell from './DemoShell'

function AppInner() {
  const { state } = useDemo()
  const { stage } = state

  if (stage === 'am-setup') return <AMSetup />
  if (stage === 'landing') return <LandingPage />
  if (stage === 'auth-login' || stage === 'auth-otp') return <AuthFlow />
  if (stage === 'consent-notice') return <ConsenTick />
  if (stage === 'app') return <DemoShell />
  return null
}

export default function App() {
  return (
    <DemoProvider>
      <AppInner />
    </DemoProvider>
  )
}
