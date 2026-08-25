import { NavProvider } from './app/navigation';
import { useNav } from './app/nav-context';
import { SessionProvider } from './state/session';
import { HomeScreen } from './screens/HomeScreen';
import { IdentifyScreen } from './screens/IdentifyScreen';
import { LevelSelectScreen } from './screens/LevelSelectScreen';
import { ActivitySelectScreen } from './screens/ActivitySelectScreen';
import { GameScreen } from './screens/GameScreen';
import { ResultScreen } from './screens/ResultScreen';

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
    case 'activities':
      return <ActivitySelectScreen difficulty={route.difficulty} />;
    case 'game':
      return (
        <GameScreen difficulty={route.difficulty} activity={route.activity} />
      );
    case 'result':
      return (
        <ResultScreen difficulty={route.difficulty} activity={route.activity} />
      );
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
