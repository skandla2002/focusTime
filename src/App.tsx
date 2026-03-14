import './App.css'
import { useAppStore } from './store/appStore'
import { Navigation } from './components/Navigation'
import { InterstitialAd } from './components/InterstitialAd'
import { HomeScreen } from './screens/HomeScreen'
import { TimerScreen } from './screens/TimerScreen'
import { StatisticsScreen } from './screens/StatisticsScreen'
import { GoalScreen } from './screens/GoalScreen'

export function App() {
  const { screen, navigate } = useAppStore()

  return (
    <div className="app">
      {screen === 'home' && <HomeScreen />}
      {screen === 'timer' && <TimerScreen />}
      {screen === 'statistics' && <StatisticsScreen />}
      {screen === 'goal' && <GoalScreen />}

      <Navigation current={screen} onNavigate={navigate} />
      <InterstitialAd />
    </div>
  )
}
