import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Box,
  Link,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LinkIcon from '@mui/icons-material/Link';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TimerIcon from '@mui/icons-material/Timer';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import { getUrlStats } from '../api/shorturl';
import { log } from '../logger';

function StatsPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (code) {
      fetchStats();
    }
    
    log('frontend', 'info', 'page', `StatsPage component mounted for code: ${code}`);
    console.log("Stats page loaded for code:", code);
    
    return () => {
      log('frontend', 'debug', 'page', 'StatsPage component unmounted');
    };
  }, [code]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      log('frontend', 'info', 'page', `Fetching stats for code: ${code}`);
      
      let data = await getUrlStats(code);
      console.log("Got stats:", data);
      setStats(data);
      
      log('frontend', 'debug', 'page', `Stats fetched successfully for code: ${code}`);
    } catch (error) {
      console.log("Error fetching stats:", error);
      log('frontend', 'error', 'page', `Error fetching stats: ${error.message}`);
      setError(`Failed to fetch statistics: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    log('frontend', 'info', 'page', 'Navigating back to home page');
    navigate('/');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" color="error" gutterBottom>
            Error
          </Typography>
          <Typography variant="body1">{error}</Typography>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={goBack}
            variant="contained" 
            sx={{ mt: 2 }}
          >
            Back to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!stats) {
    return (
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            URL Not Found
          </Typography>
          <Typography variant="body1">
            The requested short URL could not be found.
          </Typography>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={goBack}
            variant="contained" 
            sx={{ mt: 2 }}
          >
            Back to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  // Format date for display
  function formatDate(dateString) {
    let date = new Date(dateString);
    return date.toLocaleString();
  }

  return (
    <Container maxWidth="md">
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={goBack}
        sx={{ mt: 4, mb: 2 }}
      >
        Back to Home
      </Button>
      
      <Typography variant="h4" gutterBottom>
        URL Statistics
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom display="flex" alignItems="center">
          <LinkIcon sx={{ mr: 1 }} />
          Short URL
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" component="div">
            <Link 
              href={stats.shortLink}
              target="_blank" 
              rel="noopener noreferrer"
            >
              {stats.shortLink}
            </Link>
          </Typography>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h5" gutterBottom display="flex" alignItems="center">
          <LinkIcon sx={{ mr: 1 }} />
          Original URL
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" component="div" sx={{ wordBreak: 'break-all' }}>
            <Link 
              href={stats.originalUrl}
              target="_blank" 
              rel="noopener noreferrer"
            >
              {stats.originalUrl}
            </Link>
          </Typography>
        </Box>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                  <VisibilityIcon sx={{ mr: 1 }} />
                  Total Clicks
                </Typography>
                <Typography variant="h3" color="primary" align="center">
                  {stats.totalClicks || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                  <CalendarTodayIcon sx={{ mr: 1 }} />
                  Created At
                </Typography>
                <Typography variant="body1" align="center">
                  {formatDate(stats.createdAt)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {stats.lastVisit && (
            <Grid item xs={12} sm={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                    <AccessTimeIcon sx={{ mr: 1 }} />
                    Last Visit
                  </Typography>
                  <Typography variant="body1" align="center">
                    {formatDate(stats.lastVisit)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
          
          {stats.expiryDate && (
            <Grid item xs={12} sm={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                    <TimerIcon sx={{ mr: 1 }} />
                    Expires At
                  </Typography>
                  <Typography variant="body1" align="center">
                    {formatDate(stats.expiryDate)}
                  </Typography>
                  {stats.isExpired ? (
                    <Chip 
                      label="Expired" 
                      color="error" 
                      size="small" 
                      sx={{ mt: 1, display: 'block', mx: 'auto' }} 
                    />
                  ) : (
                    <Chip 
                      label="Active" 
                      color="success" 
                      size="small" 
                      sx={{ mt: 1, display: 'block', mx: 'auto' }} 
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
        
        {stats.clicks && stats.clicks.length > 0 && (
          <>
            <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
              Click History
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Referrer</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>User Agent</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.clicks.map((click, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDate(click.timestamp)}</TableCell>
                      <TableCell>{click.referrer}</TableCell>
                      <TableCell>{click.location}</TableCell>
                      <TableCell sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {click.userAgent}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Paper>
    </Container>
  );
}

export default StatsPage; 