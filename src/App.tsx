import { NavProvider } from './app/navigation';
import { useNav } from './app/nav-context';
import { SessionProvider } from './state/session';
import { HomeScreen } from './screens/HomeScreen';
import { IdentifyScreen } from './screens/IdentifyScreen';
import { LevelSelectScreen } from './screens/LevelSelectScreen';
import { GameScreen } from './screens/GameScreen';
import { ResultScreen } from './screens/ResultScreen';
import './App.css';

/** Renderiza a tela correspondente à rota atual. */
function CurrentScreen() {
  const { route } = useNav();

  switch (route.name) {
    case 'home':
      return <HomeScreen />;
    case 'identify':
      return <IdentifyScreen />;
    case 'levels':
      return <LevelSelectScreen />;
    case 'game':
      return <GameScreen difficulty={route.difficulty} />;
    case 'result':
      return <ResultScreen difficulty={route.difficulty} />;
  }
}

export default function App() {
  return (
    <SessionProvider>
      <NavProvider>
        <CurrentScreen />
      </NavProvider>
    </SessionProvider>
  );
}
