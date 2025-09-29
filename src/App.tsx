import { useSubscribeDev } from '@subscribe.dev/react'
import './App.css'
import SignInScreen from './components/SignInScreen'
import ClockApp from './components/ClockApp'

function App() {
  const { isSignedIn } = useSubscribeDev()

  if (!isSignedIn) {
    return <SignInScreen />
  }

  return <ClockApp />
}

export default App