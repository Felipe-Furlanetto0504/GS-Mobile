import { SafeAreaProvider } from 'react-native-safe-area-context';
import Routes from './src/routes';
import { ThemeProvider } from './src/theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Routes />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}