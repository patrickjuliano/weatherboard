import React from 'react';
import '../App.css';
import { checkString, checkEmail } from '../validation';
import { Button, Box, OutlinedInput, InputLabel, FormControl, TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, Login, PersonAdd, Google } from '@mui/icons-material';

import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LogIn({ setIsLoggedIn, setCurrentUserEmail, setCurrentUserID }) {
	const [data, setData] = React.useState({
		email: '',
		password: '',
		showPassword: false,
	});

	const handleChange = (prop) => (event) => {
		setData({ ...data, [prop]: event.target.value });
	}

	const handleShowPassword = () => {
		setData({ ...data, showPassword: !data.showPassword });
	}

	const navigate = useNavigate();

	//Issue when not nested, sorry about readability :(
	const handleLogin = async () => {
		try {
			let cleanEmail = checkString(data.email);
			setData({...data, email: cleanEmail});
			let cleanPassword = checkString(data.password);
			setData({...data, password: cleanPassword});
			try {
				checkEmail(data.email);
				try {
					const authentication = getAuth();
					await setPersistence(authentication, browserLocalPersistence);
					let response = await signInWithEmailAndPassword(authentication, data.email, data.password);
					sessionStorage.setItem('Auth Token', response.user.accessToken);
					sessionStorage.setItem('Email', response.user.email);
					setCurrentUserEmail(response.user.email);
					setCurrentUserID(response.user.uid);
					setIsLoggedIn(true);
					toast.success('All set. Welcome Back!');
					navigate('/');
				} catch { toast.error('Email or password entered is incorrect, please try again') }
			} catch { toast.error('Email entered is not a valid email, please try again') }
		} catch { toast.error('Email or password entered are not valid strings, please try again') }
	}

	const provider = new GoogleAuthProvider();
	const handleGoogle = async () => {
		try {
			const authentication = getAuth();
			await setPersistence(authentication, browserLocalPersistence);
			let result = await signInWithPopup(authentication, provider);
			sessionStorage.setItem('Auth Token', result.user.accessToken);
			sessionStorage.setItem('Email', result.user.email);
			setCurrentUserEmail(result.user.email);
			setCurrentUserID(result.user.uid);
			setIsLoggedIn(true);
			toast.success('All set. Welcome back!');
			navigate('/');
		} catch (error) {
			toast.error("Error signing in with Google, please try again");
		}
	}

	const handlePreventDefault = (event) => {
		event.preventDefault();
	}

	return (
		<div>
            <h1>Log In</h1>
			<Box 
				sx={{
					width: 350,
					height: 500,
				}}
			>
				<FormControl variant='outlined' id="loginSignupEmailContainer">
					<TextField
						label='Email'
						id='loginEmail'
						value={data.email}
						onChange={handleChange('email')}
						variant='outlined'
					/>
				</FormControl>
				<FormControl variant='outlined' id='loginSignupPasswordContainer'>
					<InputLabel htmlFor='loginPassword'>Password</InputLabel>
					<OutlinedInput 
						label = 'Password'
						id='loginPassword' 
						type={data.showPassword ? 'text' : 'password'}
						value={data.password}
						onChange={handleChange('password')}
						endAdornment={
							<InputAdornment position='end'>
								<IconButton 
									aria-label='Toggle Password Visibility' 
									onClick={handleShowPassword}
									onMouseDown={handlePreventDefault}
									edge='end'
								>
									{data.showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						}
					/>
				</FormControl>
				<Button 
					label='Log In'
					sx={{ backgroundColor: '#181818', '&:hover': { backgroundColor: 'black'}, }}
					variant='contained' 
					endIcon={<Login />}
					onClick={handleLogin}
					onMouseDown={handlePreventDefault}
					id="loginSignupDeleteButton">
						Log in
				</Button>
				<div id='loginSignupTextContainer'>
					<p>Not a member? <Link 
							to="/Signup" 
							id="loginSignupLink">
								Sign up here <span id="loginSignupIcon"><PersonAdd /></span>
						</Link>
					</p>
					<Button 
						label='Log in with Google'
						sx={{ width: '50', color: 'black', backgroundColor: 'white', '&:hover': { backgroundColor: '#f2f2f2'}, }}
						variant='contained'
						startIcon={<Google />}
						onClick={handleGoogle}
						onMouseDown={handlePreventDefault}
						id='loginSignupGoogle'>
							Log in with Google
					</Button>
				</div>
			</Box>
		</div>
	);
}