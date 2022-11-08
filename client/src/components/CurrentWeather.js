import React, {useState, useEffect} from 'react';
import '../App.css';
import axios from 'axios';
import { Autocomplete, Collapse, Divider, List, ListItem, ListItemButton, ListItemText, ListItemIcon, ListSubheader, TextField, Icon, Tooltip } from '@mui/material';
import { WiDaySunny, WiDaySunnyOvercast, WiNightClear, WiNightAltPartlyCloudy, WiCloud, WiCloudy, WiShowers, WiRain, WiThunderstorm, WiSnowflakeCold, WiDust, WiBarometer, WiThermometer, WiHumidity, WiStrongWind, WiCloudyGusts, WiDirectionRight, WiRaindrop, WiWindy, WiWindDeg, WiSprinkle, WiSnow, WiStormWarning } from 'react-icons/wi';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { IconContext } from 'react-icons';
import { checkNumber } from '../validation';

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

const CurrentWeather = (props) => {
	const [ location, setLocation ] = useState(null);
	const [ currentWeatherData, setCurrentWeatherData ] = useState(null);
	const [ hourlyWeatherData, setHourlyWeatherData ] = useState(null);
	const [ dailyWeatherData, setDailyWeatherData ] = useState(null);
	const [ open, setOpen ] = useState(Array(25).fill(false));
	const [ loading, setLoading ] = useState(true);
	const [ error, setError ] = useState(false);

	const handleClick = (index) => {
		const newValue = !open[index];
		const newOpen = Array(25).fill(false);
		newOpen[index] = newValue;
		setOpen(newOpen);
	};

	useEffect(() => {
		async function fetchData() {
			try {
				if (location === null) {
					setCurrentWeatherData(null);
					setHourlyWeatherData(null);
				} else {
					setLoading(true);
					
					location.coordinates.lat = checkNumber(location.coordinates.lat);
					location.coordinates.lon = checkNumber(location.coordinates.lon);

					const { data: currentWeather } = await axios.get(`http://localhost:4000/weather/current?lat=${location.coordinates.lat}&lon=${location.coordinates.lon}`);
					setCurrentWeatherData(currentWeather);

					const { data: hourlyWeather } = await axios.get(`http://localhost:4000/weather/hourly?lat=${location.coordinates.lat}&lon=${location.coordinates.lon}`);
					setHourlyWeatherData(hourlyWeather);
				}
				setLoading(false);
			} catch (e) {
				alert(e);
				console.log(e);
			}
		}
		fetchData();
	}, [ location ]);

	// Set location to value selected from Autocomplete component
	function onInputChange(_, value) {
		setLocation(value);
	}

	const savedLocations = [
		{label: 'Hoboken, NJ', coordinates: {lat: 40.744052, lon: -74.0270745}}, 
		{label: 'Worcester, MA', coordinates: {lat: 42.2625621, lon: -71.8018877}}
	]

	if (error) {
		var content = <p>Error!</p>
	} else if (loading) {
		var content = <p>Loading...</p>
	} else {
		const currentHour = hourlyWeatherData ? hourlyWeatherData[0].dt : null;
		var content =
			<div>
				{
					hourlyWeatherData &&
						<IconContext.Provider value={{size: 50}}>
							<List subheader={<ListSubheader>Hourly Forecast</ListSubheader>} sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
								{hourlyWeatherData.slice(0, 25).map((data, index) => (
									<div>
										<ListItemButton divider onClick={() => handleClick(index)}>
											<ListItemIcon>
												{getWeatherIcon(data.weather[0].icon)}
											</ListItemIcon>
											<ListItemText primary={Math.round(data.temp) + ' ºF'} secondary={data.dt === currentHour ? 'Now' : (new Date(data.dt * 1000)).toLocaleString('en-US', { hour: 'numeric', hour12: true })} />
											{open[index] ? <ExpandLess /> : <ExpandMore />}
										</ListItemButton>
										<Collapse in={open[index]} timeout='auto' unmountOnExit>
											<IconContext.Provider value={{className: 'nestedListIcon', color: '#757575', size: 30}}>
												<List component='div'>
													{'feels_like' in data &&
														<ListItem sx={{ pl: 5 }}>
															<WiThermometer />
															<ListItemText primary={`Feels Like: ${data.feels_like} ºF`} />
														</ListItem>
													}
													{'pressure' in data && <ListItem sx={{ pl: 5 }}>
														<WiBarometer />
														<ListItemText primary={`Pressure: ${data.pressure} hPa`} />
													</ListItem>}
													{'humidity' in data && <ListItem sx={{ pl: 5 }}>
														<WiHumidity />
														<ListItemText primary={`Humidity: ${data.humidity}%`} />
													</ListItem>}
													{'dew_point' in data && <ListItem sx={{ pl: 5 }}>
														<WiRaindrop />
														<ListItemText primary={`Dew Point: ${data.dew_point} ºF`} />
													</ListItem>}
													{'uvi' in data && <ListItem sx={{ pl: 5 }}>
														<WiDaySunny />
														<ListItemText primary={`UV Index: ${data.uvi}`} />
													</ListItem>}
													{'clouds' in data && <ListItem sx={{ pl: 5 }}>
														<WiCloud />
														<ListItemText primary={`Cloudiness: ${data.clouds}%`} />
													</ListItem>}
													{'visibility' in data && <ListItem sx={{ pl: 5 }}>
														<WiDust />
														<ListItemText primary={`Visibility: ${data.visibility} m`} />
													</ListItem>}
													{'wind_speed' in data && <ListItem sx={{ pl: 5 }}>
														<WiWindy />
														<ListItemText primary={`Wind Speed: ${data.wind_speed} mph`} />
													</ListItem>}
													{'wind_gust' in data && <ListItem sx={{ pl: 5 }}>
														<WiCloudyGusts />
														<ListItemText primary={`Wind Gust: ${data.wind_gust} mph`} />
													</ListItem>}
													{'wind_deg' in data && <ListItem sx={{ pl: 5 }}>
														<WiWindDeg />
														<ListItemText primary={`Wind Direction: ${data.wind_deg}º`} />
													</ListItem>}
													{'pop' in data && <ListItem sx={{ pl: 5 }}>
														<WiSprinkle />
														<ListItemText primary={`Precipiation: ${data.pop * 10}%`} />
													</ListItem>}
													{'rain' in data && '1h' in data.rain && <ListItem sx={{ pl: 5 }}>
														<WiRain />
														<ListItemText primary={`Rain: ${data.rain['1h']} mm`} />
													</ListItem>}
													{'snow' in data && '1h' in data.snow && <ListItem sx={{ pl: 5 }}>
														<WiSnow />
														<ListItemText primary={`Snow: ${data.snow['1h']} mm`} />
													</ListItem>}
													{'weather' in data && 'main' in data.weather && <ListItem sx={{ pl: 5 }}>
														<WiStormWarning />
														<ListItemText primary={`Weather: ${data.weather.main}`} />
													</ListItem>}
												</List>
											</IconContext.Provider>
										</Collapse>
									</div>
								))}
							</List>
						</IconContext.Provider>
				}
				{
					dailyWeatherData &&
						<p>TODO: DAILY WEATHER</p>
				}
			</div>
	}

	return (
		<div>
			<h2>Current Weather</h2>
			<div>
				<p className='selectLabel'>Select a location:</p>
				<Autocomplete className='selectLocation' defaultValue={location} onChange={onInputChange} options={savedLocations} renderInput={(params) => <TextField {...params} label='Location' />} sx={{width: 300}} filterOptions={(x) => x} />
			</div>
			{content}
		</div>
	);
};

export default CurrentWeather;
