import { Alert, Button, FormControl, IconButton, InputLabel, List, ListItem, ListItemButton, ListItemText, ListSubheader, MenuItem, Select, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import React, { useEffect, useState } from 'react';
import '../App.css';
import axios from 'axios';
import { checkNumber, checkString } from '../validation';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

const Locations = ({ currentUserID }) => {
	const [ category, setCategory ] = useState('Name');
	const [ name, setName ] = useState(undefined);
	const [ coordinates, setCoordinates ] = useState(undefined);
	const [ error, setError ] = useState(undefined);
	const [ loading, setLoading ] = useState(false);
	const [ locationData, setLocationData ] = useState(undefined);
	const [ addLocation, setAddLocation ] = useState(undefined);
	const [ removeLocation, setRemoveLocation ] = useState(undefined);
	const [ savedLocations, setSavedLocations ] = useState(undefined);

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
			if (addLocation) {
				try {
					setLoading(true);

					const id = checkString(currentUserID);
					const name = checkString(addLocation.name);
					const lat = checkNumber(addLocation.lat);
					const lon = checkNumber(addLocation.lon);
					const country = checkString(addLocation.country);
					let state;
					if ('state' in addLocation) state = checkString(addLocation.state);

					const { data } = await axios.post(`http://localhost:4000/account/${id}/location?name=${name}&lat=${lat}&lon=${lon}&country=${country}${'state' in addLocation ? `&state=${state}` : ''}`);
					setSavedLocations(data.savedLocations);
				} catch (e) {
					setError(e);
				}
				setAddLocation(null);
				setLoading(false);
			}
		}
		fetchData();
	}, [addLocation]);

	useEffect(() => {
		async function fetchData() {
			if (removeLocation) {
				try {
					setLoading(true);

					const id = checkString(currentUserID);
					const name = checkString(removeLocation.name);
					const lat = checkNumber(removeLocation.lat);
					const lon = checkNumber(removeLocation.lon);

					const { data } = await axios.delete(`http://localhost:4000/account/${id}/location?name=${name}&lat=${lat}&lon=${lon}`);
					setSavedLocations(data.savedLocations);
				} catch (e) {
					setError(e);
				}
				setRemoveLocation(null);
				setLoading(false);
			}
		}
		fetchData();
	}, [removeLocation]);

	useEffect(() => {
		async function fetchData() {
			if (name) {
				try {
					setLoading(true);

					const { data } = await axios.get(`http://localhost:4000/location/name?name=${name}`);
					setLocationData(data);
					setError(null);
				} catch (e) {
					setLocationData(null);
					setError('Location not found');
				}
				setName(null);
				setLoading(false);
			}
		}
		fetchData();
	}, [ name ]);

	useEffect(() => {
		async function fetchData() {
			if (coordinates) {
				try {
					const { data } = await axios.get(`http://localhost:4000/location/coordinates?lat=${coordinates.latitude}&lon=${coordinates.longitude}`);
					setLocationData(data);
					setError(null);
				} catch (e) {
					setLocationData(null);
					setError('Location not found');
				}
			}
		}
		fetchData();
	}, [ coordinates ]);

	const isSaved = (lat, lon) => {
		return savedLocations.find((location) => location.lat === lat && location.lon === lon) !== undefined;
	}

	const toggleLocation = (add, data) => {
		if (add) {
			setAddLocation(data);
		} else {
			setRemoveLocation(data);
		}
	}

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

	return (
		<div>
            <h1>Locations</h1>
			<div>
				{currentUserID &&
					<form onSubmit={handleSubmit}>
						{/* <FormControl>
							<InputLabel id='categoryLabel'>Category</InputLabel>
							<Select idLabel='categoryLabel' label='Category' value={category} onChange={handleChange} sx={{ width: 150, mr: 1 }}>
								<MenuItem value='Name'>Name</MenuItem>
								<MenuItem value='Coordinates'>Coordinates</MenuItem>
							</Select>
						</FormControl> */}
						{/* {
							category === 'Name' ?
								<TextField id='nameField' className='nonRoundedCornersRight' label='Location' sx={{ width: 300 }} />
							:
								<div className='sideBySide'>
									<TextField id='latitudeField' className='nonRoundedCornersRight' label='Latitude' sx={{ width: 150, borderRight: 0 }} />
									<TextField id='longitudeField' className='nonRoundedCornersLeft nonRoundedCornersRight' label='Longitude' sx={{ width: 150 }} />
									<IconButton aria-label='search' color='primary' type='submit' sx={{ height: 56, width: 56 }}><SearchIcon /></IconButton>
								</div>
						} */}
					<Typography className='selectLabel' sx={{ mr: 1 }}>Search location:</Typography>

						<TextField id='nameField' className='nonRoundedCornersRight' label='Location' sx={{ width: 300 }} />
						<Button type='submit' variant='contained' aria-label='submit' sx={{ height: 56, width: 56, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, boxShadow: 0 }}><SearchIcon /></Button>
					</form>
				}

				{error && <Alert severity='error' variant='filled' sx={{ mt: 1 }}>{error}</Alert>}
				{!error && !loading && locationData && 
					<List subheader={<ListSubheader>Results</ListSubheader>} sx={{ width: '100%', maxWidth: 340, bgcolor: 'background.paper' }}>
						{locationData.map((data, index) => (
							<ListItem secondaryAction={
								isSaved(data.lat, data.lon) ?
									<IconButton aria-label='toggle' onClick={() => toggleLocation(false, data)} disabled={loading}>
										<RemoveCircleOutline />
									</IconButton> :
									<IconButton aria-label='toggle' onClick={() => toggleLocation(true, data)} disabled={loading}>
										<AddCircleOutline />
									</IconButton>
							}>
								<ListItemText primary={`${data.name}${'state' in data ? `, ${data.state}` : ('country' in data ? `, ${data.country}` : '')}`} secondary={`(${data.lat}, ${data.lon})`} />
							</ListItem>
						))}
					</List>
				}
				{savedLocations && savedLocations.length > 0 &&
					<List subheader={<ListSubheader>Saved</ListSubheader>} sx={{ width: '100%', maxWidth: 340, bgcolor: 'background.paper' }}>
						{savedLocations.map((data, index) => (
							<ListItem secondaryAction={
									<IconButton aria-label='toggle' onClick={() => toggleLocation(false, data)} disabled={loading}>
										<RemoveCircleOutline />
									</IconButton>
							}>
								<ListItemText primary={`${data.name}${data.state ? `, ${data.state}` : ('country' in data ? `, ${data.country}` : '')}`} secondary={`(${data.lat}, ${data.lon})`} />
							</ListItem>
						))}
					</List>
				}
			</div>
		</div>
	);
};

export default Locations;