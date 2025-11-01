import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import theme from './utils/theme';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Use basename from PUBLIC_URL (set in package.json homepage)
// For GitHub Pages, PUBLIC_URL will be '/shugly'
// For localhost, PUBLIC_URL will be undefined or empty
const getBasename = () => {
  const publicUrl = process.env.PUBLIC_URL;
  if (!publicUrl) return undefined;
  
  // Extract pathname from PUBLIC_URL (e.g., 'https://ya95hya.github.io/shugly' -> '/shugly')
  try {
    const url = new URL(publicUrl);
    return url.pathname !== '/' ? url.pathname : undefined;
  } catch {
    // If PUBLIC_URL is not a full URL, use it directly (e.g., '/shugly')
    return publicUrl.startsWith('/') ? publicUrl : undefined;
  }
};

const basename = getBasename();

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter
        basename={basename}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);