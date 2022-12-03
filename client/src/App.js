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
import { AppBar, Box, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tab, Tabs, Toolbar, Typography } from '@mui/material';

import { app } from './firebase-config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// const sidebarWidth = 200;
// const sidebarTabs = [
//   { route: '/', text: 'Home', icon: <RiHome2Fill /> },
//   { route: '/weather/current', text: 'Weather', icon: <RiShowersFill /> },
//   { route: '/locations', text: 'Locations', icon: <RiMapPin2Fill /> },
//   { route: '/', text: 'Settings', icon: <RiSettings3Fill /> },
//   { route: '/login', text: 'Log In', icon: <RiLoginBoxFill /> },
//   { route: '/signup', text: 'Sign Up', icon: <RiAddBoxFill /> }
// ];

function App() {
  const [ isLoggedIn, setIsLoggedIn ] = React.useState(false);
  const [ currentUserEmail, setCurrentUserEmail ] = React.useState('');

  React.useEffect(() => {
    //If Auth Token still exists in session, keep user logged in
    if(!isLoggedIn && sessionStorage.getItem('Auth Token')){
      setIsLoggedIn(true);
    }
  }, [])

  //For ability to logout through entire application
  const handleLogout = () => {
    sessionStorage.removeItem('Auth Token');
    setCurrentUserEmail('');
    setIsLoggedIn(false);
    toast.info('Successfully logged out. Come back soon!')
  }

  return (
    <Router>
      <div className='App'>
      <ToastContainer />
        <header>
          <h1 className='title'>Weatherboard</h1>
          <IconContext.Provider value={{size: 28}}>
            <Sidebar className='sidebar' backgroundColor='#1E1E1E' transitionDuration={0}>
              <Menu className='menu'>
                <MenuItem className='menuItem' icon={<RiHome2Fill />} routerLink={<Link to='/' />}>Home</MenuItem>
                <SubMenu className='subMenu' icon={<RiShowersFill />} label='Weather'>
                  <MenuItem className='subMenuItem' icon={<RiTimeFill />} routerLink={<Link to='/weather/current' />}>Current</MenuItem>
                  {/* <MenuItem className='subMenuItem' icon={<RiSkipForwardFill />} routerLink={<Link to='/weather/forecast' />}>Forecast</MenuItem>
                  <MenuItem className='subMenuItem' icon={<RiHistoryFill />} routerLink={<Link to='/weather/historical' />}>Historical</MenuItem> */}
                </SubMenu>
                <MenuItem className='menuItem' icon={<RiMapPin2Fill />} routerLink={<Link to='/locations' />}>Locations</MenuItem>
                <SubMenu className='subMenu' icon={<RiSettings3Fill />} label='Settings'>
                  <MenuItem className='subMenuItem' icon={<RiEdit2Fill />}>Credentials</MenuItem>
                  <MenuItem className='subMenuItem' icon={<RiMoonFill />}>Theme</MenuItem>
                </SubMenu>
                {isLoggedIn
                  ? <MenuItem className='menuItem' icon={<RiLogoutBoxFill />} onClick={handleLogout} routerLink={<Link to='/login' />}>Log out</MenuItem>
                  : <MenuItem className='menuItem' icon={<RiLoginBoxFill />} routerLink={<Link to='/login' />}>Log In</MenuItem>
                }
              </Menu>
            </Sidebar>
          </IconContext.Provider>
        </header>
        <div className='App-body'>
          <Routes>
						<Route path='/' element={<Home />} />

						<Route path='/weather/current' element={<WeatherForecast />} />
						{/* <Route path='/weather/forecast' element={<ForecastWeather />} />
						<Route path='/weather/historical' element={<HistoricalWeather />} /> */}

						<Route path='/locations' element={<Locations />} />

						<Route path='/login' element={<LogIn setIsLoggedIn={setIsLoggedIn} setCurrentUserEmail={setCurrentUserEmail} />} />
						<Route path='/signup' element={<SignUp setIsLoggedIn={setIsLoggedIn} setCurrentUserEmail={setCurrentUserEmail} />} /> 

            <Route path='/error' element={<Error />} />
            <Route path='*' element={<Navigate to={'/error'} replace />} />
					</Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
