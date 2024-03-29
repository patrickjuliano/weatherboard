import React, {useState, useEffect} from 'react';
import '../App.css';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Autocomplete, Collapse, Divider, List, ListItem, ListItemButton, ListItemText, ListItemIcon, ListSubheader, TextField, Icon, Tooltip, Tabs, Tab, Card, CardContent, Typography, CardHeader, CardActions, IconButton, Button, Alert } from '@mui/material';
import { WiDaySunny, WiDaySunnyOvercast, WiNightClear, WiNightAltPartlyCloudy, WiCloud, WiCloudy, WiShowers, WiRain, WiThunderstorm, WiSnowflakeCold, WiDust, WiBarometer, WiThermometer, WiHumidity, WiStrongWind, WiCloudyGusts, WiDirectionRight, WiRaindrop, WiWindy, WiWindDeg, WiSprinkle, WiSnow, WiStormWarning, WiSunrise, WiSunset, WiMoonrise, WiMoonset, WiMoonFull, WiMoonNew, WiMoonWaningCrescent1, WiMoonFirstQuarter, WiMoonWaxingGibbous1, WiMoonWaningGibbous1, WiMoonThirdQuarter, WiMoonWaxingCrescent1, WiMoonAltWaxingCrescent1, WiMoonAltWaxingGibbous1, WiMoonAltWaningGibbous1, WiMoonAltWaningCrescent1, WiMoonAltThirdQuarter, WiMoonAltFull, WiMoonAltFirstQuarter, WiMoonAltNew, WiMoonAltWaxingCrescent3, WiMoonAltWaxingGibbous3, WiMoonAltWaningGibbous3, WiMoonAltWaningCrescent3 } from 'react-icons/wi';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { IconContext } from 'react-icons';
import { checkNumber, checkString } from '../validation';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';

// Generate random id
function randomId() {
	return `id-${uuidv4()}`;
}

// Codes consist of two digits followed by a letter ('d' for day, 'n' for night)
function getWeatherIcon(code) {
	const weatherIcons = {
		'01': {
			'd': <WiDaySunny id={randomId()} />,
			'n': <WiNightClear id={randomId()} />
		},
		'02': {
			'd': <WiDaySunnyOvercast id={randomId()} />,
			'n': <WiNightAltPartlyCloudy id={randomId()} />
		},
		'03': <WiCloud id={randomId()} />,
		'04': <WiCloudy id={randomId()} />,
		'09': <WiShowers id={randomId()} />,
		'10': <WiRain id={randomId()} />,
		'11': <WiThunderstorm id={randomId()} />,
		'13': <WiSnowflakeCold id={randomId()} />,
		'50': <WiDust id={randomId()} />
	}

	let icon = weatherIcons[code.slice(0, 2)];
	if ('d' in icon && 'n' in icon) icon = icon[code.slice(-1)];
	return icon;
}

function getOpenArray(tabIndex) {
	let size = 0;
	switch (tabIndex) {
		case 0:
			size = 25;
			break;
		case 1:
			size = 8;
			break;
	}
	return Array(size).fill(false);
}

const CurrentWeather = ({ currentUserID }) => {
	const [ location, setLocation ] = useState(null);
	const [ currentWeatherData, setCurrentWeatherData ] = useState(null);
	const [ hourlyWeatherData, setHourlyWeatherData ] = useState(null);
	const [ dailyWeatherData, setDailyWeatherData ] = useState(null);
	const [ historicalWeatherData, setHistoricalWeatherData ] = useState(null);
	const [ tabIndex, setTabIndex ] = useState(null);
	const [ open, setOpen ] = useState(getOpenArray(0));
	const [ currentOpen, setCurrentOpen ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const [ error, setError ] = useState(false);
	const [ savedLocations, setSavedLocations ] = useState(undefined);

	const handleClick = (index) => {
		const newValue = !open[index];
		const newOpen = Array(25).fill(false);
		newOpen[index] = newValue;
		setOpen(newOpen);
	};

	const handleClickCurrent = () => {
		setCurrentOpen(!currentOpen);
	}

	useEffect(() => {
		async function fetchData() {
			try {
				const id = checkString(currentUserID);

				try {
					const { data } = await axios.get(`http://localhost:4000/account/${id}`);
					setSavedLocations(data.savedLocations);
				} catch (e) {
					const { data } = await axios.post(`http://localhost:4000/account/${id}`);
					setSavedLocations(data.savedLocations);
				}
			} catch (e) {
				setError('User is not logged in');
			}
		}
		fetchData();
	}, []);

	useEffect(() => {
		async function fetchData() {
			setCurrentOpen(false);

			let currentTabIndex = tabIndex;
			if (location === null) {
				currentTabIndex = null;
				setTabIndex(currentTabIndex);
			} else {
				setLoading(true);

				if (tabIndex === null) {
					currentTabIndex = 0;
					setTabIndex(currentTabIndex);
				}

				try {
					location.lat = checkNumber(location.lat);
					location.lon = checkNumber(location.lon);
					
					const { data: currentWeather } = await axios.get(`http://localhost:4000/weather/current?lat=${location.lat}&lon=${location.lon}`);
					setCurrentWeatherData(currentWeather);

					const { data: hourlyWeather } = await axios.get(`http://localhost:4000/weather/hourly?lat=${location.lat}&lon=${location.lon}`);
					setHourlyWeatherData(hourlyWeather);

					const { data: dailyWeather } = await axios.get(`http://localhost:4000/weather/daily?lat=${location.lat}&lon=${location.lon}`);
					setDailyWeatherData(dailyWeather);

					const { data: historicalWeather } = await axios.get(`http://localhost:4000/weather/historical?lat=${location.lat}&lon=${location.lon}`);
					setHistoricalWeatherData(historicalWeather);
				} catch (e) {
					alert(e);
				}

				setLoading(false);
			}
		}
		fetchData();
	}, [ location ]);

	useEffect(() => {
		async function fetchData() {
			setOpen(getOpenArray(tabIndex));
		}
		fetchData();
	}, [ tabIndex ]);

	// Set tabIndex to value selected from Tabs component
	function selectTab(_, value) {
		setTabIndex(value);
	}

	// Set location to value selected from Autocomplete component
	function onInputChange(_, value) {
		setLocation(value);
	}

	// Get moon phase based on number between 0 and 1
	function getMoonPhase(value) {
		if (value === 0 || value === 1) {
			return { name: 'New Moon', icon: <WiMoonAltNew id={randomId()} /> };
		} else if (value < .25) {
			return { name: 'Waxing Crescent', icon: <WiMoonAltWaxingCrescent3 id={randomId()} /> };
		} else if (value === .25) {
			return { name: 'First Quarter Moon', icon: <WiMoonAltFirstQuarter id={randomId()} /> };
		} else if (value < .5) {
			return { name: 'Waxing Gibbous', icon: <WiMoonAltWaxingGibbous3 id={randomId()} /> };
		} else if (value === .5) {
			return { name: 'Full Moon', icon: <WiMoonAltFull id={randomId()} /> };
		} else if (value < .75) {
			return { name: 'Waning Gibbous', icon: <WiMoonAltWaningGibbous3 id={randomId()} /> };
		} else if (value === .75) {
			return { name: 'Third Quarter Moon', icon: <WiMoonAltThirdQuarter id={randomId()} /> };
		} else {
			return { name: 'Waning Crescent', icon: <WiMoonAltWaningCrescent3 id={randomId()} /> };
		}
	}

	// Create attribute with specified properties
	function createAttribute(current, tooltip, icon, label, value, units = '', addSpace = false) {
		let text = `${label}: ${value}${addSpace ? ' ' : ''}${units}`;
		return (
			<Tooltip title={tooltip} placement='right' arrow >
				<ListItemButton sx={{ pl: current ? 3 : 5 }}>
					{icon}
					<ListItemText primary={text} />
				</ListItemButton>
			</Tooltip>
		);
	}

	// Acquire attributes for a given weather data object
	function createAttributeList(data, current = false) {
		const index = current ? 0 : tabIndex;
			if (index !== 1) {
				return (
					<IconContext.Provider value={{ className: 'nestedListIcon', color: '#757575', size: 30 }}>
						<List component='div' sx={{ maxWidth: 340 }}>
							{'sunrise' in data &&
								createAttribute(
									current,
									'Time of sunrise',
									<WiSunrise id={randomId()} />,
									'Sunrise',
									(new Date(data.sunrise * 1000)).toLocaleString('en-US', { hour: 'numeric', hour12: true })
								)
							}
							{'sunset' in data &&
								createAttribute(
									current,
									'Time of sunset',
									<WiSunset id={randomId()} />,
									'Sunset',
									(new Date(data.sunset * 1000)).toLocaleString('en-US', { hour: 'numeric', hour12: true })
								)
							}
							{'feels_like' in data &&
								createAttribute(
									current,
									'Temperature accounting for the human perception of weather',
									<WiThermometer id={randomId()} />,
									'Feels Like',
									data.feels_like,
									'ºF',
									true
								)
							}
							{'pressure' in data &&
								createAttribute(
									current,
									'Atmospheric pressure on the sea level',
									<WiBarometer id={randomId()} />,
									'Pressure',
									data.pressure,
									'hPa',
									true
								)
							}
							{'humidity' in data &&
								createAttribute(
									current,
									'Amount of water vapor in the air',
									<WiHumidity id={randomId()} />,
									'Humidity',
									data.humidity,
									'%'
								)
							}
							{'dew_point' in data &&
								createAttribute(
									current,
									'Atmospheric temperature (varying according to pressure and humidity) below which water droplets begin to condense and dew can form',
									<WiRaindrop id={randomId()} />,
									'Dew Point',
									data.dew_point,
									'ºF',
									true
								)
							}
							{'uvi' in data &&
								createAttribute(
									current,
									'Strength of ultraviolet radiation',
									<WiDaySunny id={randomId()} />,
									'UV Index',
									data.uvi
								)
							}
							{'clouds' in data &&
								createAttribute(
									current,
									'Measure of cloudiness',
									<WiCloud id={randomId()} />,
									'Clouds',
									data.clouds,
									'%'
								)
							}
							{'visibility' in data &&
								createAttribute(
									current,
									'Average visibility (capped at 10 km)',
									<WiDust id={randomId()} />,
									'Visibility',
									data.visibility,
									'm',
									true
								)
							}
							{'wind_speed' in data &&
								createAttribute(
									current,
									'Speed at which wind travels',
									<WiWindy id={randomId()} />,
									'Wind Speed',
									data.wind_speed,
									'mph',
									true
								)
							}
							{'wind_gust' in data &&
								createAttribute(
									current,
									'Peak wind speed',
									<WiCloudyGusts id={randomId()} />,
									'Wind Gust',
									data.wind_gust,
									'mph',
									true
								)
							}
							{'wind_deg' in data &&
								createAttribute(
									current,
									'Direction from which wind travels',
									<WiWindDeg id={randomId()} />,
									'Wind Direction',
									data.wind_deg,
									'º'
								)
							}
							{'pop' in data &&
								createAttribute(
									current,
									'Probability of precipitation',
									<WiSprinkle id={randomId()} />,
									'Precipiation',
									data.pop * 10,
									'%'
								)
							}
							{'rain' in data && '1h' in data.rain &&
								createAttribute(
									current,
									'Rain volume',
									<WiRain id={randomId()} />,
									'Rain',
									data.rain['1h'],
									'mm',
									true
								)
							}
							{'snow' in data && '1h' in data.snow &&
								createAttribute(
									current,
									'Snow volume',
									<WiSnow id={randomId()} />,
									'Snow',
									data.snow['1h'],
									'mm',
									true
								)
							}
							{'weather' in data && data.weather.length > 0 && 'main' in data.weather[0] &&
								createAttribute(
									current,
									'Weather condition',
									<WiStormWarning id={randomId()} />,
									'Weather',
									data.weather[0].main
								)
							}
						</List>
					</IconContext.Provider>
				);
			} else {
				return (
					<IconContext.Provider value={{ className: 'nestedListIcon', color: '#757575', size: 30 }}>
						<List component='div'>
							{'sunrise' in data &&
								createAttribute(
									current,
									'Time of sunrise',
									<WiSunrise id={randomId()} />,
									'Sunrise',
									(new Date(data.sunrise * 1000)).toLocaleString('en-US', { hour: 'numeric', hour12: true })
								)
							}
							{'sunset' in data &&
								createAttribute(
									current,
									'Time of sunset',
									<WiSunset id={randomId()} />,
									'Sunset',
									(new Date(data.sunset * 1000)).toLocaleString('en-US', { hour: 'numeric', hour12: true })
								)
							}
							{'moonrise' in data &&
								createAttribute(
									current,
									'Time of moonrise',
									<WiMoonrise id={randomId()} />,
									'Moonrise',
									(new Date(data.moonrise * 1000)).toLocaleString('en-US', { hour: 'numeric', hour12: true })
								)
							}
							{'moonset' in data &&
								createAttribute(
									current,
									'Time of moonset',
									<WiMoonset id={randomId()} />,
									'Moonset',
									(new Date(data.moonset * 1000)).toLocaleString('en-US', { hour: 'numeric', hour12: true })
								)
							}
							{'moon_phase' in data &&
								createAttribute(
									current,
									'Phase of the moon',
									getMoonPhase(data.moon_phase).icon,
									'Moon Phase',
									getMoonPhase(data.moon_phase).name
								)
							}
							{'temp' in data && 'min' in data.temp &&
								createAttribute(
									current,
									'Minimum daily temperature',
									<WiThermometer id={randomId()} />,
									'Low Temperature',
									data.temp.min,
									'ºF',
									true
								)
							}
							{'temp' in data && 'max' in data.temp &&
								createAttribute(
									current,
									'Maximum daily temperature',
									<WiThermometer id={randomId()} />,
									'High Temperature',
									data.temp.max,
									'ºF',
									true
								)
							}
						</List>
					</IconContext.Provider>
				);
			}
	}

	if (error) {
		var content = <Alert severity='error' variant='filled' sx={{ mt: 1 }}>{error}</Alert>
	} else if (loading) {
		var content = <p>Loading...</p>
	} else if (tabIndex !== null) {
		if (tabIndex === 0 && hourlyWeatherData) {
			var weatherData = hourlyWeatherData;
			var header = `Hourly Forecast for ${location.label}`;
			var end = 25;
			var current = hourlyWeatherData[0].dt;
		} else if (tabIndex === 1 && dailyWeatherData) {
			var weatherData = dailyWeatherData;
			var header = `Daily Forecast for ${location.label}`;
			var end = 8;
			var current = dailyWeatherData[0].dt;
		} else if (tabIndex === 2 && historicalWeatherData) {
			var weatherData = historicalWeatherData;
			var header = `Historical Data for ${location.label}`;
			var end = -1;
			var current = -1;
		}

		var content =
			<div>
				{
					weatherData &&
						<List subheader={<ListSubheader>{header}</ListSubheader>} sx={{ width: '100%', maxWidth: 340, bgcolor: 'background.paper' }}>
							{weatherData.slice(0, end == -1 ? weatherData.length : end).map((data, index) => (
								<li>
									<ListItemButton divider onClick={() => handleClick(index)}>
										<ListItemIcon>
											<IconContext.Provider value={{size: 50}}>
												{getWeatherIcon(data.weather[0].icon)}
											</IconContext.Provider>
										</ListItemIcon>
										{tabIndex === 2 ?
											<ListItemText primary={Math.round(data.temp) + ' ºF'} secondary={`${new Date(data.dt * 1000).toLocaleString('en-US', { weekday: 'long' })}, ${(new Date(data.dt * 1000)).toLocaleString('en-US', { hour: 'numeric', hour12: true })}`} />
										:
											<ListItemText primary={tabIndex === 0 ? Math.round(data.temp) + ' ºF' : `${Math.round(data.temp.min)}ºF-${Math.round(data.temp.max)}ºF`} secondary={data.dt === current ? (tabIndex === 0 ? 'Now' : 'Today') : (tabIndex === 0 ? (new Date(data.dt * 1000)).toLocaleString('en-US', { hour: 'numeric', hour12: true }) : new Date(data.dt * 1000)).toLocaleString('en-US', { weekday: 'long' })} />
										}
										{open[index] ? <ExpandLess /> : <ExpandMore />}
									</ListItemButton>
									<Collapse in={open[index]} timeout='auto' unmountOnExit>
										{createAttributeList(data)}
									</Collapse>
								</li>
							))}
						</List>
				}
			</div>
	}

	return (
		<div>
			<h1>Weather Forecast</h1>
			<div>
				{savedLocations &&
					<div>
						<Typography className='selectLabel' sx={{ mr: 1 }}>Select location:</Typography>
						<Autocomplete className='selectLocation' defaultValue={location} onChange={onInputChange} options={savedLocations} disableClearable renderInput={(params) => <TextField {...params} label='Location' />} sx={{ width: 300 }} />
						<Typography className='sideBySide' sx={{ ml: 2, mr: 2, color: 'text.secondary' }}>or</Typography>
						<Button className='sideBySide' variant='contained' component={Link} to='/locations'>Add location</Button>
					</div>
				}

				{!loading && currentWeatherData && 
					<Card variant='outlined' sx={{ mt: 2, mb: 1, maxWidth: 340 }}>
						<CardHeader title={'label' in location ? location.label : 'N/A'} subheader={'dt' in currentWeatherData ? (new Date(currentWeatherData.dt * 1000)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) : 'N/A'} sx={{ pb: 0 }} />
						<CardContent sx={{ pt: 0, pb: 0 }}>
							<Typography sx={{ mb: 1, color: 'text.secondary' }}>{'weather' in currentWeatherData && currentWeatherData.weather.length > 0 && 'main' in currentWeatherData.weather[0] ? currentWeatherData.weather[0].main : 'N/A'}</Typography>
							<IconContext.Provider value={{className: 'sideBySide', size: 80 }}>
								{'weather' in currentWeatherData && currentWeatherData.weather.length > 0 && 'icon' in currentWeatherData.weather[0] && 
									getWeatherIcon(currentWeatherData.weather[0].icon)
								}
							</IconContext.Provider>
							<Typography className='sideBySide' fontSize={50}>{'temp' in currentWeatherData ? `${Math.round(currentWeatherData.temp)}ºF` : 'N/A'}</Typography>
						</CardContent>
						<CardActions sx={{ pt: 0 }}>
							<IconButton aria-label='expand' onClick={handleClickCurrent} sx={{ ml: 'auto' }}>
								{currentOpen ? <ExpandLess /> : <ExpandMore />}
							</IconButton>
						</CardActions>
						<Collapse in={currentOpen} timeout='auto' unmountOnExit>
							<Divider />
							{currentWeatherData && createAttributeList(currentWeatherData, true)}
						</Collapse>
					</Card>
				}
				{!loading && hourlyWeatherData && dailyWeatherData &&
					<Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 1 }}>
						<Tabs value={tabIndex} onChange={selectTab}>
							<Tab label="Hourly Forecast" tabIndex={0} />
							<Tab label="Daily Forecast" tabIndex={1} />
							<Tab label="Historical Data" tabIndex={2} />
						</Tabs>
					</Box>
				}
			</div>
			{content}
		</div>
	);
};

export default CurrentWeather;
