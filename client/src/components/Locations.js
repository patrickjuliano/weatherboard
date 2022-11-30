import { Alert, Button, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import React, { useEffect, useState } from 'react';
import '../App.css';
import axios from 'axios';
import { checkNumber, checkString } from '../validation';

const Locations = () => {
	const [ category, setCategory ] = useState('Name');
	const [ name, setName ] = useState(undefined);
	const [ coordinates, setCoordinates ] = useState(undefined);
	const [ error, setError ] = useState(undefined);
	const [ locationData, setLocationData ] = useState(undefined);

	const handleChange = (event) => {
		setCategory(event.target.value);
		setError(null);
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		if (category === 'Name') {
			const nameField = document.getElementById('nameField');
			nameField.value = nameField.value.trim();
			try {
				const name = checkString(nameField.value);
				setName(name);
			} catch (e) {
				setLocationData(null);
				setError(e);
			}
		} else if (category === 'Coordinates') {
			const latitudeField = document.getElementById('latitudeField');
			const longitudeField = document.getElementById('longitudeField');
			latitudeField.value = latitudeField.value.trim();
			longitudeField.value = longitudeField.value.trim();
			try {
				const latitude = checkNumber(latitudeField.value);
				const longitude = checkNumber(longitudeField.value);
				setCoordinates({latitude: latitude, longitude: longitude});
			} catch (e) {
				setLocationData(null);
				setError(e);
			}
		}
	}

	useEffect(() => {
		async function fetchData() {
			if (name) {
				try {
					const { data: location } = await axios.get(`http://localhost:4000/location/name?name=${name}`);
					setLocationData(location);
					setError(null);
				} catch (e) {
					setLocationData(null);
					setError('Location not found');
				}
			}
		}
		fetchData();
	}, [ name ])

	useEffect(() => {
		async function fetchData() {
			if (coordinates) {
				try {
					const { data: location } = await axios.get(`http://localhost:4000/location/coordinates?lat=${coordinates.latitude}&lon=${coordinates.longitude}`);
					setLocationData(location);
					setError(null);
				} catch (e) {
					setLocationData(null);
					setError('Location not found');
				}
			}
		}
		fetchData();
	}, [ coordinates ])

	return (
		<div>
            <h2>Locations</h2>
			<div>
				<form onSubmit={handleSubmit}>
					<FormControl>
						<InputLabel id='categoryLabel'>Category</InputLabel>
						<Select idLabel='categoryLabel' label='Category' value={category} onChange={handleChange} sx={{ width: 150, mr: 1 }}>
							<MenuItem value='Name'>Name</MenuItem>
							<MenuItem value='Coordinates'>Coordinates</MenuItem>
						</Select>
					</FormControl>
					{
						category === 'Name' ?
							// <TextField label='Location' InputProps={{ endAdornment: <IconButton aria-label='search' color='primary' type='submit' sx={{ mr: -1 }}><SearchIcon /></IconButton> }} sx={{ width: 300 }} />
							<TextField id='nameField' className='nonRoundedCornersRight' label='Location' sx={{ width: 300 }} />
						:
							<div className='sideBySide'>
								<TextField id='latitudeField' className='nonRoundedCornersRight' label='Latitude' sx={{ width: 150, borderRight: 0 }} />
								<TextField id='longitudeField' className='nonRoundedCornersLeft nonRoundedCornersRight' label='Longitude' sx={{ width: 150 }} />
								{/* <IconButton aria-label='search' color='primary' type='submit' sx={{ height: 56, width: 56 }}><SearchIcon /></IconButton> */}
							</div>
					}
					<Button type='submit' variant='contained' sx={{ height: 56, width: 56, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, boxShadow: 0 }}><SearchIcon /></Button>
				</form>

				{error && <Alert severity='error' variant='filled' sx={{ mt: 1 }}>{error}</Alert>}
				{locationData && <p>{locationData[0].name}, ({locationData[0].lat}, {locationData[0].lon})</p>}
			</div>
		</div>
	);
};

export default Locations;