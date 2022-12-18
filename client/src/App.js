import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { IconContext } from 'react-icons';
import { RiHome2Fill, RiShowersFill, RiTimeFill, RiSkipForwardFill, RiHistoryFill, RiMapPin2Fill, RiSettings3Fill, RiEdit2Fill, RiMoonFill, RiLoginBoxFill, RiLogoutBoxFill } from 'react-icons/ri';
import './App.css';

import Home from './components/Home';
import WeatherForecast from './components/WeatherForecast';
import Locations from './components/Locations';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import Error from './components/Error';
import Credentials from './components/Credentials';
import ProfilePic from './components/ProfilePic';
import WeatherPredictionService from './components/WeatherPredictionService';
import { AppBar, Box, CssBaseline, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tab, Tabs, Toolbar, Typography } from '@mui/material';

import MoonLoader from 'react-spinners/MoonLoader'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebase-config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const sidebarWidth = 200;


function App() {
  const [ isLoggedIn, setIsLoggedIn ] = React.useState(false);
  const [ currentUserEmail, setCurrentUserEmail ] = React.useState('');
  const [ currentUserID, setCurrentUserID ] = React.useState('');
  const [ loading, setLoading ] = React.useState(true);

  React.useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      //Ensures that react state/sessionStorage is properly initialized
      if(user){
        setIsLoggedIn(true);
        setCurrentUserEmail(user.email);
        setCurrentUserID(user.uid);
        sessionStorage.setItem('Email', user.email);
        sessionStorage.setItem('Auth Token', user.accessToken);
      } else {
        setIsLoggedIn(false);
        setCurrentUserEmail('');
        setCurrentUserID(null);
      }
      setLoading(false);
    });
  }, [])

  //For ability to logout through entire application
  const handleLogout = async () => {
    const auth = getAuth();
    sessionStorage.removeItem('Auth Token');
    sessionStorage.removeItem('Email');
    setCurrentUserEmail('');
    setCurrentUserID(null);
    setIsLoggedIn(false);
    try {
      await auth.signOut();
    } catch {
      //Never ran into this error but adding it just in case
      toast.error('Trouble logging out. Please try again or exit the webpage.')
    }
    toast.info('Successfully logged out. Come back soon!')
  }

  const loaderCss = {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "40vh",
  }

  const sidebarTabs = [
    {
      route: "/",
      label: "Home",
      icon: <RiHome2Fill />
    }
  ]
  if (isLoggedIn) {
    sidebarTabs.push({
      route: "/locations",
      label: "Locations",
      icon: <RiMapPin2Fill />
    });
    sidebarTabs.push({
      route: "/weather/current",
      label: "Forecast",
      icon: <RiShowersFill />
    });
    sidebarTabs.push({
      route: "/weather/future",
      label: "Weather Predictor",
      icon: <RiHistoryFill />
    });
    sidebarTabs.push({
      route: "/credentials",
      label: "Account",
      icon: <ProfilePic currentUserID={currentUserID} />
    });
    sidebarTabs.push({
      route: '/login',
      label: 'Log Out',
      icon: <RiLogoutBoxFill />,
      onClick: handleLogout
    });
  } else {
    sidebarTabs.push({
      route: '/login',
      label: 'Log In',
      icon: <RiLoginBoxFill />
    });
  }

  const sidebar = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {sidebarTabs.map((tab, index) => (
          <ListItem key={tab.label} disablePadding>
            <ListItemButton component={Link} to={tab.route} onClick={tab.onClick}>
              <ListItemIcon>
                <IconContext.Provider value={{size: 24}}>
                  {tab.icon}
                </IconContext.Provider>
              </ListItemIcon>
              <ListItemText primary={tab.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  if (loading) {
    return(
      <MoonLoader 
        color={'black'} 
        loading={loading} 
        cssOverride={loaderCss}
        aria-label="Loading spinner"
        data-testid="loader"
      />
    );
  } else {
  return (
    <Router>
      <div className='App'>
      <ToastContainer />
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar
            position='fixed'
            sx={{
              width: `calc(100% - ${sidebarWidth}px)`,
              ml: `${sidebarWidth}px`,
            }}
          >
            <Toolbar>
              <Typography variant='h6' component='div' noWrap>
                Weatherboard
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            sx={{
              width: sidebarWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: sidebarWidth,
                boxSizing: 'border-box',
              },
            }}
            variant='permanent'
          >
            {sidebar}
          </Drawer>
          <Box
            component='main'
            sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
          >
            <Toolbar />
            <div className='App-body'>
              <Routes>
                <Route path='/' element={<Home currentUserID={currentUserID} />} />

                <Route path='/weather/current' element={!currentUserID ? <Navigate replace to='/login' /> : <WeatherForecast currentUserID={currentUserID} />} />
                <Route path='/weather/future' element={!currentUserID ? <Navigate replace to='/login' /> : <WeatherPredictionService currentUserID={currentUserID} />} />

                {/* <Route path='/weather/forecast' element={<ForecastWeather />} />
                <Route path='/weather/historical' element={<HistoricalWeather />} /> */}

                <Route path='/locations' element={!currentUserID ? <Navigate replace to='/login' /> : <Locations currentUserID={currentUserID} />} />

                <Route path='/login' element={currentUserID ? <Navigate replace to='/' /> : <LogIn setIsLoggedIn={setIsLoggedIn} setCurrentUserEmail={setCurrentUserEmail} setCurrentUserID={setCurrentUserID} />} />
                <Route path='/signup' element={<SignUp setIsLoggedIn={setIsLoggedIn} setCurrentUserEmail={setCurrentUserEmail} setCurrentUserID={setCurrentUserID} />} />
                <Route path='/credentials' element={!currentUserID ? <Navigate replace to='/login' /> : <Credentials setIsLoggedIn={setIsLoggedIn} currentUserEmail={currentUserEmail} currentUserID={currentUserID} />} /> 
                <Route path='/error' element={<Error />} />
                <Route path='*' element={<Navigate to={'/error'} replace />} />
              </Routes>
            </div>
          </Box>
        </Box>










        {/* <header>
          <h1 className='title'>Weatherboard</h1>
          <IconContext.Provider value={{size: 28}}>
            <Sidebar className='sidebar' backgroundColor='#1E1E1E' transitionDuration={0}>
              <Menu className='menu'>
                <MenuItem className='menuItem' icon={<RiHome2Fill />} routerLink={<Link to='/' />}>Home</MenuItem>
                <SubMenu className='subMenu' icon={<RiShowersFill />} label='Weather'>
                  <MenuItem className='subMenuItem' icon={<RiTimeFill />} routerLink={<Link to='/weather/current' />}>Current</MenuItem>
                  <MenuItem className='subMenuItem' icon={<RiSkipForwardFill />} routerLink={<Link to='/weather/forecast' />}>Forecast</MenuItem>
                  <MenuItem className='subMenuItem' icon={<RiHistoryFill />} routerLink={<Link to='/weather/historical' />}>Historical</MenuItem>
                </SubMenu>
                <MenuItem className='menuItem' icon={<RiMapPin2Fill />} routerLink={<Link to='/locations' />}>Locations</MenuItem>
                <SubMenu className='subMenu' icon={<RiSettings3Fill />} label='Settings'>
                  {isLoggedIn && <MenuItem className='subMenuItem' icon={<RiEdit2Fill />} routerLink={<Link to='/credentials' />}>Credentials</MenuItem> }
                  <MenuItem className='subMenuItem' icon={<RiMoonFill />}>Theme</MenuItem>
                </SubMenu>
                {isLoggedIn
                  ? <MenuItem className='menuItem' icon={<RiLogoutBoxFill />} onClick={handleLogout} routerLink={<Link to='/login' />}>Log Out</MenuItem>
                  : <MenuItem className='menuItem' icon={<RiLoginBoxFill />} routerLink={<Link to='/login' />}>Log In</MenuItem>
                }
              </Menu>
            </Sidebar>
          </IconContext.Provider>
        </header> */}
        {/* <div className='App-body'>
          <Routes>
						<Route path='/' element={<Home currentUserEmail={currentUserEmail} />} />

						<Route path='/weather/current' element={<WeatherForecast currentUserID={currentUserID} />} />
						<Route path='/weather/forecast' element={<ForecastWeather />} />
						<Route path='/weather/historical' element={<HistoricalWeather />} />

						<Route path='/locations' element={<Locations currentUserID={currentUserID} />} />

						<Route path='/login' element={<LogIn setIsLoggedIn={setIsLoggedIn} setCurrentUserEmail={setCurrentUserEmail} setCurrentUserID={setCurrentUserID} />} />
						<Route path='/signup' element={<SignUp setIsLoggedIn={setIsLoggedIn} setCurrentUserEmail={setCurrentUserEmail} setCurrentUserID={setCurrentUserID} />} />
            <Route path='/credentials' element={<Credentials setIsLoggedIn={setIsLoggedIn} currentUserEmail={currentUserEmail} />} /> 

            <Route path='/error' element={<Error />} />
            <Route path='*' element={<Navigate to={'/error'} replace />} />
					</Routes>
        </div> */}
      </div>
    </Router>
  );
  }
}

export default App;
