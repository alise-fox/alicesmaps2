// app/_layout.tsx
import { Slot } from 'expo-router';
import { DatabaseProvider } from '../context/DatabaseContext';

export default function Layout() {
  return (
    <DatabaseProvider>
      <Slot />
    </DatabaseProvider>
  );
}