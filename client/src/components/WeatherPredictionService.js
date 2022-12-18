import React, {useState, useEffect} from 'react';
import '../App.css';
import axios from 'axios';

const WeatherPredictionService = () => {
    const [ error, setError ] = useState(false);

    useEffect(() => {
		async function fetchData() {
			try {
				// const id = checkString(currentUserID);
                const { data } = await axios.get(`http://localhost:4000/flask/data/Washington/7`);
                console.log(data);
			} catch (e) {
				setError('User is not logged in');
			}
		}
		fetchData();
	}, []);


	return (
		<div>
            <h1>Weather Prediction</h1>
		</div>
	);
};

export default WeatherPredictionService;