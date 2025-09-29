import { useState, useEffect } from 'react'
import { useSubscribeDev } from '@subscribe.dev/react'
import './ClockApp.css'

type ClockSettings = {
  format24h: boolean
  showSeconds: boolean
  timezone: string
  lastUpdated?: number
}

type ErrorType = {
  message: string
  type?: string
  retryAfter?: number
}

function ClockApp() {
  const {
    client,
    usage,
    subscribe,
    subscriptionStatus,
    useStorage,
    signOut,
    user
  } = useSubscribeDev()

  const [settings, setSettings, syncStatus] = useStorage<ClockSettings>('clock-settings', {
    format24h: false,
    showSeconds: true,
    timezone: 'local'
  })

  const [currentTime, setCurrentTime] = useState(new Date())
  const [aiQuote, setAiQuote] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ErrorType | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()

    if (settings.format24h) {
      const h = hours.toString().padStart(2, '0')
      const m = minutes.toString().padStart(2, '0')
      const s = seconds.toString().padStart(2, '0')
      return settings.showSeconds ? `${h}:${m}:${s}` : `${h}:${m}`
    } else {
      const h = hours % 12 || 12
      const m = minutes.toString().padStart(2, '0')
      const s = seconds.toString().padStart(2, '0')
      const period = hours >= 12 ? 'PM' : 'AM'
      return settings.showSeconds ? `${h}:${m}:${s} ${period}` : `${h}:${m} ${period}`
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const generateQuote = async () => {
    if (!client) return

    setLoading(true)
    setError(null)

    try {
      const currentHour = currentTime.getHours()
      let timeOfDay = 'day'
      if (currentHour < 12) timeOfDay = 'morning'
      else if (currentHour < 18) timeOfDay = 'afternoon'
      else timeOfDay = 'evening'

      const { output } = await client.run('openai/gpt-4o', {
        input: {
          messages: [
            {
              role: 'system',
              content: 'You are a poetic AI that creates short, inspirational quotes about time. Keep responses to 1-2 sentences.'
            },
            {
              role: 'user',
              content: `Generate an inspirational quote about time for the ${timeOfDay}. The current time is ${formatTime(currentTime)}.`
            }
          ]
        }
      })

      setAiQuote(output[0] as string)
      setSettings({
        ...settings,
        lastUpdated: Date.now()
      })
    } catch (err: any) {
      if (err.type === 'insufficient_credits') {
        setError({
          message: 'Insufficient credits. Please upgrade your plan to generate more quotes.',
          type: 'insufficient_credits'
        })
      } else if (err.type === 'rate_limit_exceeded') {
        setError({
          message: `Rate limit exceeded. Please try again in ${Math.ceil((err.retryAfter || 0) / 1000)} seconds.`,
          type: 'rate_limit_exceeded',
          retryAfter: err.retryAfter
        })
      } else {
        setError({
          message: 'Failed to generate quote. Please try again.',
          type: 'network'
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleFormat = () => {
    setSettings({
      ...settings,
      format24h: !settings.format24h
    })
  }

  const toggleSeconds = () => {
    setSettings({
      ...settings,
      showSeconds: !settings.showSeconds
    })
  }

  const handleUpgrade = () => {
    if (subscribe) {
      subscribe()
    }
  }

  return (
    <div className="clock-app">
      <header className="app-header">
        <div className="header-left">
          <span className="clock-icon-small">🕐</span>
          <span className="app-title">Clock App</span>
        </div>
        <div className="header-right">
          <div className="user-info">
            {user?.avatarUrl && (
              <img src={user.avatarUrl} alt="User avatar" className="user-avatar" />
            )}
            <span className="user-email">{user?.email}</span>
          </div>
          <button onClick={() => setShowSettings(!showSettings)} className="icon-button" aria-label="Settings">
            ⚙️
          </button>
          <button onClick={signOut} className="icon-button" aria-label="Sign out">
            🚪
          </button>
        </div>
      </header>

      {showSettings && (
        <div className="settings-panel">
          <h3>Settings</h3>
          <div className="settings-group">
            <label>
              <input
                type="checkbox"
                checked={settings.format24h}
                onChange={toggleFormat}
              />
              24-hour format
            </label>
            <label>
              <input
                type="checkbox"
                checked={settings.showSeconds}
                onChange={toggleSeconds}
              />
              Show seconds
            </label>
          </div>
          <div className="sync-status">
            Sync: <span className={`sync-indicator sync-${syncStatus}`}>{syncStatus}</span>
          </div>
        </div>
      )}

      <main className="clock-main">
        <div className="clock-display">
          <div className="time">{formatTime(currentTime)}</div>
          <div className="date">{formatDate(currentTime)}</div>
        </div>

        <div className="quote-section">
          <h2>AI-Generated Time Quote</h2>
          {aiQuote && <blockquote className="quote">{aiQuote}</blockquote>}
          {!aiQuote && !loading && !error && (
            <p className="quote-prompt">Generate an inspirational quote about time</p>
          )}

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <p>{error.message}</p>
              {error.type === 'insufficient_credits' && (
                <button onClick={handleUpgrade} className="upgrade-button">
                  Upgrade Plan
                </button>
              )}
              {error.type !== 'insufficient_credits' && (
                <button onClick={generateQuote} className="retry-button">
                  Try Again
                </button>
              )}
            </div>
          )}

          <button
            onClick={generateQuote}
            disabled={loading}
            className="generate-button"
          >
            {loading ? 'Generating...' : 'Generate Quote'}
          </button>

          {settings.lastUpdated && (
            <p className="last-updated">
              Last generated: {new Date(settings.lastUpdated).toLocaleString()}
            </p>
          )}
        </div>

        <div className="subscription-info">
          <div className="info-card">
            <h3>Plan Status</h3>
            <p className="plan-name">{subscriptionStatus?.plan?.name ?? 'Free'}</p>
            <p className={`plan-status status-${subscriptionStatus?.status}`}>
              {subscriptionStatus?.status ?? 'none'}
            </p>
          </div>

          <div className="info-card">
            <h3>Credits</h3>
            <div className="credits-display">
              <span className="credits-remaining">{usage?.remainingCredits ?? 0}</span>
              <span className="credits-separator">/</span>
              <span className="credits-total">{usage?.allocatedCredits ?? 0}</span>
            </div>
            <div className="credits-bar">
              <div
                className="credits-bar-fill"
                style={{
                  width: `${usage ? (usage.remainingCredits / usage.allocatedCredits) * 100 : 0}%`
                }}
              />
            </div>
          </div>

          <button onClick={handleUpgrade} className="manage-subscription-button">
            Manage Subscription
          </button>
        </div>
      </main>
    </div>
  )
}

export default ClockApp