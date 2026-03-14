import { useState } from 'react'
import { signInWithGoogle } from '../utils/cloudStorage'
import { useAppStore } from '../store/appStore'

export function LoginScreen() {
  const { navigate } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGoogleLogin() {
    setLoading(true)
    setError(null)
    try {
      await signInWithGoogle()
      // OAuth 리다이렉트 후 subscribeAuthState 가 user 를 세팅
    } catch {
      setError('로그인에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  function handleSkip() {
    navigate('home')
  }

  return (
    <div className="screen login-screen">
      <div className="login-hero">
        <div className="login-icon">⏱</div>
        <h1 className="login-title">FocusTimer</h1>
        <p className="login-subtitle">집중 기록을 클라우드에 저장하고{'\n'}어느 기기에서든 이어서 공부하세요.</p>
      </div>

      <div className="login-actions">
        <button
          type="button"
          className="btn-google"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <span className="btn-google-icon">G</span>
          {loading ? '로그인 중...' : 'Google로 계속하기'}
        </button>

        {error && <p className="login-error">{error}</p>}

        <button
          type="button"
          className="btn-skip"
          onClick={handleSkip}
        >
          로그인 없이 시작하기
        </button>

        <p className="login-notice">
          로그인하지 않으면 데이터가 이 기기에만 저장됩니다.
        </p>
      </div>
    </div>
  )
}
