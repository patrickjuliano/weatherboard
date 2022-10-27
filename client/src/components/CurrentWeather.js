import React, {useState, useEffect} from 'react';
import '../App.css';
import axios from 'axios';
import { Autocomplete, Divider, List, ListItem, ListItemText, ListItemIcon, ListSubheader, TextField, Icon } from '@mui/material';
import { WiDaySunny, WiDaySunnyOvercast, WiNightClear, WiNightAltPartlyCloudy, WiCloud, WiCloudy, WiShowers, WiRain, WiThunderstorm, WiSnowflakeCold, WiDust } from "react-icons/wi";
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
	const [ loading, setLoading ] = useState(true);
	const [ error, setError ] = useState(false);

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

					const { data: currentWeather } = await axios.get(`http://localhost:3000/weather/current?lat=${location.coordinates.lat}&lon=${location.coordinates.lon}`);
					setCurrentWeatherData(currentWeather);

					const { data: hourlyWeather } = await axios.get(`http://localhost:3000/weather/hourly?lat=${location.coordinates.lat}&lon=${location.coordinates.lon}`);
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

	function onInputChange(event, value) {
		setLocation(value);
	}

	const savedLocations = [
		{label: 'Hoboken, NJ', coordinates: {lat: 40.744052, lon: -74.0270745}}, 
		{label: 'Worcester, MA', coordinates: {lat: 42.2625621, lon: -71.8018877}}
	]

	const currentHour = hourlyWeatherData !== null ? hourlyWeatherData[0].dt : null;

	if (error) {

	} else {
		return (
			<div>
				<h2>Current Weather</h2>
				<div>
					<p className='selectLabel'>Select a location:</p>
					<Autocomplete className='selectLocation' defaultValue={location} onChange={onInputChange} options={savedLocations} renderInput={(params) => <TextField {...params} label='Location' />} sx={{width: 300}} filterOptions={(x) => x} />
				</div>
				<p>{loading ? 'Loading...' : currentWeatherData && currentWeatherData.temp ? `Current temperature: ${currentWeatherData.temp} °F`: 'No location selected!'}</p>
				
				{loading ? <p>Loading...</p> : hourlyWeatherData ? 
					<IconContext.Provider value={{size: 50}}>
						<List subheader={<ListSubheader>Hourly Forecast</ListSubheader>} sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
							{hourlyWeatherData.slice(0, 25).map(data => (
								<ListItem divider>
									<ListItemIcon>
										{getWeatherIcon(data.weather[0].icon)}
									</ListItemIcon>
									<ListItemText primary={Math.round(data.temp) + ' ºF'} secondary={data.dt === currentHour ? 'Now' : (new Date(data.dt * 1000)).toLocaleString('en-US', { hour: 'numeric', hour12: true })} />
								</ListItem>
							))}
						</List>
					</IconContext.Provider> :
				<p>No location selected!</p>}
			</div>
		);
	}
};

export default CurrentWeather;
