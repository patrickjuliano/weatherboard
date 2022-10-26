import React, {useState, useEffect} from 'react';
import '../App.css';
import axios from 'axios';
import { Autocomplete, TextField } from '@mui/material';
import { checkNumber } from '../validation';

const CurrentWeather = (props) => {
	const [ location, setLocation ] = useState(null);
	const [ weatherData, setWeatherData ] = useState(null);
	const [ loading, setLoading ] = useState(true);
	const [ error, setError ] = useState(false);

	useEffect(() => {
		async function fetchData() {
			try {
				if (location === null) {
					setWeatherData(null);
				} else {
					setLoading(true);
					
					location.coordinates.lat = checkNumber(location.coordinates.lat);
					location.coordinates.lon = checkNumber(location.coordinates.lon);

					const { data: weather } = await axios.get(`http://localhost:3000/weather/current?lat=${location.coordinates.lat}&lon=${location.coordinates.lon}`);
					setWeatherData(weather);
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

	if (error) {

	} else {
		return (
			<div>
				<h2>Current Weather</h2>
				<div>
					<p className='selectLabel'>Select a location:</p>
					<Autocomplete className='selectLocation' defaultValue={location} onChange={onInputChange} options={savedLocations} renderInput={(params) => <TextField {...params} label='Location' />} sx={{width: 300}} filterOptions={(x) => x} />
				</div>
				<p>{loading ? 'Loading...' : weatherData && weatherData.current && weatherData.current.temp ? `Current temperature: ${weatherData.current.temp} °F`: 'No location selected!'}</p>
			</div>
		);
	}
};

export default CurrentWeather;
