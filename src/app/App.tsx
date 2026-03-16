import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AppProvider } from './context';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </AppProvider>
  );
}
