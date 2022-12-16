import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

const Home = ({ currentUserID }) => {
	return (
		<div>
            <h1 sx={{ variant: 'h3' }}>Home</h1>
			<p>
				Weatherboard is a web application that queries the OpenWeatherMap API to supply users with real-time and forecasted global weather data. It was developed via the MERN stack and implements various other technologies, including Firebase Authentication, Redis, Flask, and ImageMagick.
			</p>
			{currentUserID ?
				<div>
					<p>To add or remove saved locations, click <Link to='/locations'>here.</Link></p>
					<p>To view real-time and forecasted weather data for your saved locations, click <Link to='/weather/current'>here.</Link></p>
					<p>To edit your credentials, click <Link to='/credentials'>here.</Link></p>
				</div>
			:
				<p>To get started, sign up or log in <Link to='/login'>here.</Link></p>
			}
		</div>
	);
};

export default Home;
