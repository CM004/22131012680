import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import { log } from '../logger';

function Header() {
  React.useEffect(() => {
    log('frontend', 'debug', 'component', 'Header component mounted');
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <LinkIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          URL Shortener
        </Typography>
        <Box>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/"
            onClick={() => log('frontend', 'info', 'component', 'Navigated to home page')}
          >
            Home
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header; 