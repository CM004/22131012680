import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Header from './components/Header';
import ShortenerPage from './pages/ShortenerPage';
import { log } from './logger';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  React.useEffect(() => {
    log('frontend', 'info', 'page', 'Application initialized');
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<ShortenerPage />} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
}

export default App; 