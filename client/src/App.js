import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { IconContext } from 'react-icons';
import { RiHome2Fill, RiShowersFill, RiTimeFill, RiSkipForwardFill, RiHistoryFill, RiMapPin2Fill, RiSettings3Fill, RiEdit2Fill, RiMoonFill, RiLoginBoxFill, RiAddBoxFill } from 'react-icons/ri';
import './App.css';

import Home from './components/Home';
import CurrentWeather from './components/CurrentWeather';
import ForecastWeather from './components/ForecastWeather';
import HistoricalWeather from './components/HistoricalWeather';
import Locations from './components/Locations';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import Error from './components/Error';

function App() {
  return (
    <Router>
      <div className='App'>
        <header>
          <h1 className='title'>Weatherboard</h1>
          <IconContext.Provider value={{size: 28}}>
            <Sidebar className='sidebar' backgroundColor='#1E1E1E' transitionDuration={0}>
              <Menu>
                <MenuItem className='menuItem' icon={<RiHome2Fill />} routerLink={<Link to='/' />}>Home</MenuItem>
                <SubMenu className='subMenu' icon={<RiShowersFill />} label='Weather'>
                  <MenuItem className='subMenuItem' icon={<RiTimeFill />} routerLink={<Link to='/weather/current' />}>Current</MenuItem>
                  <MenuItem className='subMenuItem' icon={<RiSkipForwardFill />} routerLink={<Link to='/weather/forecast' />}>Forecast</MenuItem>
                  <MenuItem className='subMenuItem' icon={<RiHistoryFill />} routerLink={<Link to='/weather/historical' />}>Historical</MenuItem>
                </SubMenu>
                <MenuItem className='menuItem' icon={<RiMapPin2Fill />} routerLink={<Link to='/locations' />}>Locations</MenuItem>
                <SubMenu className='subMenu' icon={<RiSettings3Fill />} label='Settings'>
                  <MenuItem className='subMenuItem' icon={<RiEdit2Fill />}>Credentials</MenuItem>
                  <MenuItem className='subMenuItem' icon={<RiMoonFill />}>Theme</MenuItem>
                </SubMenu>
                <MenuItem className='menuItem' icon={<RiLoginBoxFill />} routerLink={<Link to='/login' />}>Log In</MenuItem>
                <MenuItem className='menuItem' icon={<RiAddBoxFill />} routerLink={<Link to='/signup' />}>Sign Up</MenuItem>
              </Menu>
            </Sidebar>
          </IconContext.Provider>
        </header>
        <div className='App-body'>
          <Routes>
						<Route path='/' element={<Home />} />

						<Route path='/weather/current' element={<CurrentWeather />} />
						<Route path='/weather/forecast' element={<ForecastWeather />} />
						<Route path='/weather/historical' element={<HistoricalWeather />} />

						<Route path='/locations' element={<Locations />} />

						<Route path='/login' element={<LogIn />} />
						<Route path='/signup' element={<SignUp />} />

            <Route path='/error' element={<Error />} />
            <Route path='*' element={<Navigate to={'/error'} replace />} />
					</Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
