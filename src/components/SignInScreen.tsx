import { useSubscribeDev } from '@subscribe.dev/react'
import './SignInScreen.css'

function SignInScreen() {
  const { signIn } = useSubscribeDev()

  return (
    <div className="signin-container">
      <div className="signin-card">
        <div className="clock-icon">🕐</div>
        <h1>Clock App</h1>
        <p className="signin-description">
          A beautiful clock app powered by AI. Sign in to access personalized features and save your preferences.
        </p>
        <button onClick={signIn} className="signin-button">
          Sign In
        </button>
        <p className="signin-footer">
          New user? Sign up with the button above
        </p>
      </div>
    </div>
  )
}

export default SignInScreen