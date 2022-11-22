import React, {useState, useEffect} from 'react';
import '../App.css';
import axios from 'axios';
import { Autocomplete, Collapse, Divider, List, ListItem, ListItemButton, ListItemText, ListItemIcon, ListSubheader, TextField, Icon, Tooltip, Tabs, Tab } from '@mui/material';
import { WiDaySunny, WiDaySunnyOvercast, WiNightClear, WiNightAltPartlyCloudy, WiCloud, WiCloudy, WiShowers, WiRain, WiThunderstorm, WiSnowflakeCold, WiDust, WiBarometer, WiThermometer, WiHumidity, WiStrongWind, WiCloudyGusts, WiDirectionRight, WiRaindrop, WiWindy, WiWindDeg, WiSprinkle, WiSnow, WiStormWarning, WiSunrise, WiSunset, WiMoonrise, WiMoonset, WiMoonFull, WiMoonNew, WiMoonWaningCrescent1, WiMoonFirstQuarter, WiMoonWaxingGibbous1, WiMoonWaningGibbous1, WiMoonThirdQuarter, WiMoonWaxingCrescent1, WiMoonAltWaxingCrescent1, WiMoonAltWaxingGibbous1, WiMoonAltWaningGibbous1, WiMoonAltWaningCrescent1, WiMoonAltThirdQuarter, WiMoonAltFull, WiMoonAltFirstQuarter, WiMoonAltNew, WiMoonAltWaxingCrescent3, WiMoonAltWaxingGibbous3, WiMoonAltWaningGibbous3, WiMoonAltWaningCrescent3 } from 'react-icons/wi';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { IconContext } from 'react-icons';
import { checkNumber } from '../validation';
import { Box } from '@mui/system';

const weatherIcons = {
	'01': {
		'd': <WiDaySunny />,
		'n': <WiNightClear />
	},
	'02': {
		'd': <WiDaySunnyOvercast />,
		'n': <WiNightAltPartlyCloudy />
	},
	'03': <WiCloud />,
	'04': <WiCloudy />,
	'09': <WiShowers />,
	'10': <WiRain />,
	'11': <WiThunderstorm />,
	'13': <WiSnowflakeCold />,
	'50': <WiDust />
}

// Codes consist of two digits followed by a letter ('d' for day, 'n' for night)
function getWeatherIcon(code) {
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

const CurrentWeather = (props) => {
	const [ location, setLocation ] = useState(null);
	const [ currentWeatherData, setCurrentWeatherData ] = useState(null);
	const [ hourlyWeatherData, setHourlyWeatherData ] = useState(null);
	const [ dailyWeatherData, setDailyWeatherData ] = useState(null);
	const [ historicalWeatherData, setHistoricalWeatherData ] = useState(null);
	const [ tabIndex, setTabIndex ] = useState(null);
	const [ open, setOpen ] = useState(getOpenArray(0));
	const [ loading, setLoading ] = useState(false);
	const [ error, setError ] = useState(false);

	const handleClick = (index) => {
		const newValue = !open[index];
		const newOpen = Array(25).fill(false);
		newOpen[index] = newValue;
		setOpen(newOpen);
	};

	useEffect(() => {
		async function fetchData() {
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
					location.coordinates.lat = checkNumber(location.coordinates.lat);
					location.coordinates.lon = checkNumber(location.coordinates.lon);

					const { data: currentWeather } = await axios.get(`http://localhost:4000/weather/current?lat=${location.coordinates.lat}&lon=${location.coordinates.lon}`);
					setCurrentWeatherData(currentWeather);

					const { data: hourlyWeather } = await axios.get(`http://localhost:4000/weather/hourly?lat=${location.coordinates.lat}&lon=${location.coordinates.lon}`);
					setHourlyWeatherData(hourlyWeather);

					const { data: dailyWeather } = await axios.get(`http://localhost:4000/weather/daily?lat=${location.coordinates.lat}&lon=${location.coordinates.lon}`);
					setDailyWeatherData(dailyWeather);
				} catch (e) {
					// alert(e);
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
			return { name: 'New Moon', icon: <WiMoonAltNew /> };
		} else if (value < .25) {
			return { name: 'Waxing Crescent', icon: <WiMoonAltWaxingCrescent3 /> };
		} else if (value === .25) {
			return { name: 'First Quarter Moon', icon: <WiMoonAltFirstQuarter /> };
		} else if (value < .5) {
			return { name: 'Waxing Gibbous', icon: <WiMoonAltWaxingGibbous3 /> };
		} else if (value === .5) {
			return { name: 'Full Moon', icon: <WiMoonAltFull /> };
		} else if (value < .75) {
			return { name: 'Waning Gibbous', icon: <WiMoonAltWaningGibbous3 /> };
		} else if (value === .75) {
			return { name: 'Third Quarter Moon', icon: <WiMoonAltThirdQuarter /> };
		} else {
			return { name: 'Waning Crescent', icon: <WiMoonAltWaningCrescent3 /> };
		}
	}

	// Create attribute with specified properties
	function createAttribute(tooltip, icon, label, value, units = '', addSpace = false) {
		let text = `${label}: ${value}${addSpace ? ' ' : ''}${units}`;
		return (
			<Tooltip title={tooltip} placement='right' arrow >
				<ListItemButton sx={{ pl: 5 }}>
					{icon}
					<ListItemText primary={text} />
				</ListItemButton>
			</Tooltip>
		);
	}

	// Acquire attributes for a given weather data object
	function createAttributeList(data) {
		switch (tabIndex) {
			case (0):
				return (
					<List component='div'>
						{'feels_like' in data &&
							createAttribute(
								'Temperature accounting for the human perception of weather',
								<WiThermometer />,
								'Feels Like',
								data.feels_like,
								'ºF',
								true
							)
						}
						{'pressure' in data &&
							createAttribute(
								'Atmospheric pressure on the sea level',
								<WiBarometer />,
								'Pressure',
								data.pressure,
								'hPa',
								true
							)
						}
						{'humidity' in data &&
							createAttribute(
								'Amount of water vapor in the air',
								<WiHumidity />,
								'Humidity',
								data.humidity,
								'%'
							)
						}
						{'dew_point' in data &&
							createAttribute(
								'Atmospheric temperature (varying according to pressure and humidity) below which water droplets begin to condense and dew can form',
								<WiRaindrop />,
								'Dew Point',
								data.dew_point,
								'ºF',
								true
							)
						}
						{'uvi' in data &&
							createAttribute(
								'Strength of ultraviolet radiation',
								<WiDaySunny />,
								'UV Index',
								data.uvi
							)
						}
						{'clouds' in data &&
							createAttribute(
								'Measure of cloudiness',
								<WiCloud />,
								'Clouds',
								data.clouds,
								'%'
							)
						}
						{'visibility' in data &&
							createAttribute(
								'Average visibility (capped at 10 km)',
								<WiDust />,
								'Visibility',
								data.visibility,
								'm',
								true
							)
						}
						{'wind_speed' in data &&
							createAttribute(
								'Speed at which wind travels',
								<WiWindy />,
								'Wind Speed',
								data.wind_speed,
								'mph',
								true
							)
						}
						{'wind_gust' in data &&
							createAttribute(
								'Peak wind speed',
								<WiCloudyGusts />,
								'Wind Gust',
								data.wind_gust,
								'mph',
								true
							)
						}
						{'wind_deg' in data &&
							createAttribute(
								'Direction from which wind travels',
								<WiWindDeg />,
								'Wind Direction',
								data.wind_deg,
								'º'
							)
						}
						{'pop' in data &&
							createAttribute(
								'Probability of precipitation',
								<WiSprinkle />,
								'Precipiation',
								data.pop * 10,
								'%'
							)
						}
						{'rain' in data && '1h' in data.rain &&
							createAttribute(
								'Rain volume',
								<WiRain />,
								'Rain',
								data.rain['1h'],
								'mm',
								true
							)
						}
						{'snow' in data && '1h' in data.snow &&
							createAttribute(
								'Snow volume',
								<WiSnow />,
								'Snow',
								data.snow['1h'],
								'mm',
								true
							)
						}
						{'weather' in data && 'main' in data.weather &&
							createAttribute(
								'Weather condition',
								<WiStormWarning />,
								'Weather',
								data.weather.main
							)
						}
					</List>
				);
			case (1):
				return (
					<List component='div'>
						{'sunrise' in data &&
							createAttribute(
								'Time of sunrise',
								<WiSunrise />,
								'Sunrise',
								(new Date(data.sunrise * 1000)).toLocaleString('en-US', { hour: 'numeric', hour12: true })
							)
						}
						{'sunset' in data &&
							createAttribute(
								'Time of sunset',
								<WiSunset />,
								'Sunset',
								(new Date(data.sunset * 1000)).toLocaleString('en-US', { hour: 'numeric', hour12: true })
							)
						}
						{'moonrise' in data &&
							createAttribute(
								'Time of moonrise',
								<WiMoonrise />,
								'Moonrise',
								(new Date(data.moonrise * 1000)).toLocaleString('en-US', { hour: 'numeric', hour12: true })
							)
						}
						{'moonset' in data &&
							createAttribute(
								'Time of moonset',
								<WiMoonset />,
								'Moonset',
								(new Date(data.moonset * 1000)).toLocaleString('en-US', { hour: 'numeric', hour12: true })
							)
						}
						{'moon_phase' in data &&
							createAttribute(
								'Phase of the moon',
								getMoonPhase(data.moon_phase).icon,
								'Moon Phase',
								getMoonPhase(data.moon_phase).name
							)
						}
						{'temp' in data && 'min' in data.temp &&
							createAttribute(
								'Minimum daily temperature',
								<WiThermometer />,
								'Low Temperature',
								data.temp.min,
								'ºF',
								true
							)
						}
						{'temp' in data && 'max' in data.temp &&
							createAttribute(
								'Maximum daily temperature',
								<WiThermometer />,
								'High Temperature',
								data.temp.max,
								'ºF',
								true
							)
						}
					</List>
				);
		}
	}

	const savedLocations = [
		{label: 'Hoboken, NJ', coordinates: {lat: 40.744052, lon: -74.0270745}}, 
		{label: 'Worcester, MA', coordinates: {lat: 42.2625621, lon: -71.8018877}}
	]

	if (error) {
		var content = <p>Error!</p>
	} else if (loading) {
		var content = <p>Loading...</p>
	} else if (tabIndex !== null) {
		if (tabIndex === 0 && hourlyWeatherData) {
			var weatherData = hourlyWeatherData;
			var header = 'Hourly Forecast';
			var end = 25;
			var current = hourlyWeatherData[0].dt;
		} else if (tabIndex === 1 && dailyWeatherData) {
			var weatherData = dailyWeatherData;
			var header = 'Daily Forecast';
			var end = 8;
			var current = dailyWeatherData[0].dt;
		}

		var content =
			<div>
				{
					weatherData &&
						<IconContext.Provider value={{size: 50}}>
							<List subheader={<ListSubheader>{header}</ListSubheader>} sx={{ width: '100%', maxWidth: 340, bgcolor: 'background.paper' }}>
								{weatherData.slice(0, end).map((data, index) => (
									<div>
										<ListItemButton divider onClick={() => handleClick(index)}>
											<ListItemIcon>
												{getWeatherIcon(data.weather[0].icon)}
											</ListItemIcon>
											<ListItemText primary={tabIndex === 0 ? Math.round(data.temp) + ' ºF' : `${Math.round(data.temp.min)}ºF-${Math.round(data.temp.max)}ºF`} secondary={data.dt === current ? (tabIndex === 0 ? 'Now' : 'Today') : (tabIndex === 0 ? (new Date(data.dt * 1000)).toLocaleString('en-US', { hour: 'numeric', hour12: true }) : new Date(data.dt * 1000)).toLocaleString('en-US', { weekday: 'long' })} />
											{open[index] ? <ExpandLess /> : <ExpandMore />}
										</ListItemButton>
										<Collapse in={open[index]} timeout='auto' unmountOnExit>
											<IconContext.Provider value={{className: 'nestedListIcon', color: '#757575', size: 30 }}>
												{createAttributeList(data)}
											</IconContext.Provider>
										</Collapse>
									</div>
								))}
							</List>
						</IconContext.Provider>
				}
			</div>
	}

	return (
		<div>
			<h2>Current Weather</h2>
			<div>
				<p className='selectLabel'>Select a location:</p>
				<Autocomplete className='selectLocation' defaultValue={location} onChange={onInputChange} options={savedLocations} renderInput={(params) => <TextField {...params} label='Location' />} sx={{ width: 300 }} />
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<Tabs value={tabIndex} onChange={selectTab}>
						<Tab label="Hourly Forecast" disabled={!location} tabIndex={0} />
						<Tab label="Daily Forecast" disabled={!location} tabIndex={0} />
						<Tab label="Historical Data" disabled={!location} tabIndex={0} />
					</Tabs>
				</Box>
			</div>
			{content}
		</div>
	);
};

export default CurrentWeather;
