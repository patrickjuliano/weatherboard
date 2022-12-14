import React from 'react';
import '../App.css';
import { checkString, checkEmail, checkMatchingStrings } from '../validation';
import { Button, Box, OutlinedInput, InputLabel, FormControl, TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, PersonAdd, Login, Google } from '@mui/icons-material';

import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignUp({ setIsLoggedIn, setCurrentUserEmail, setCurrentUserID }) {
	const [data, setData] = React.useState({
		email: '',
		password: '',
		confirmPassword: '',
		showPassword: false,
		showConfirmPassword: false,
	});

	const handleChange = (prop) => (event) => {
		setData({ ...data, [prop]: event.target.value });
	}

	const handleShowPassword = () => {
		setData({ ...data, showPassword: !data.showPassword });
	}

	const handleShowConfirmPassword = () => {
		setData({ ...data, showConfirmPassword: !data.showConfirmPassword });
	}

	const navigate = useNavigate();

	//Issue when not nested, sorry about readability :(
	const handleSignUp = async () => {
		try {
			let cleanEmail = checkString(data.email);
			setData({...data, email: cleanEmail});
			let cleanPassword = checkString(data.password);
			setData({...data, password: cleanPassword});
			let cleanConfirmPassword = checkString(data.confirmPassword);
			setData({...data, confirmPassword: cleanConfirmPassword});
			try {
				checkEmail(data.email);
				try {
					checkMatchingStrings(data.password, data.confirmPassword);
					try {
						const authentication = getAuth();
						await setPersistence(authentication, browserLocalPersistence);
						let response = await createUserWithEmailAndPassword(authentication, data.email, data.password);
						sessionStorage.setItem('Auth Token', response.user.accessToken);
						sessionStorage.setItem('Email', response.user.email);
						setCurrentUserEmail(response.user.email);
						setCurrentUserID(response.user.uid);
						setIsLoggedIn(true);
						toast.success('All set. Welcome to Weatherboard!');
						navigate('/');
					} catch (e) { 
						if (e.code === 'auth/email-already-in-use') {
							toast.error('Email already in use');
						} else toast.error('Error signing up, please try again');
					}
				} catch { toast.error('Provided passwords do not match, please try again') }
			} catch { toast.error('Email entered is not a valid email, please try again') }
		} catch { toast.error('Email or passwords entered are not valid strings, please try again') }
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
			toast.success('All set. Welcome to Weatherboard!');
			navigate('/');
		} catch (error) {
			toast.error("Error signing up with Google, please try again");
		}
	}

	const handlePreventDefault = (event) => {
		event.preventDefault();
	}

	return (
		<div>
            <h1>Sign Up</h1>
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
				<FormControl variant='outlined' id='signupConfirmPasswordContainer'>
					<InputLabel htmlFor='loginConfirmPassword'>Confirm Password</InputLabel>
					<OutlinedInput 
						label = 'Confirm Password'
						id='loginConfirmPassword' 
						type={data.showConfirmPassword ? 'text' : 'password'}
						value={data.confirmPassword}
						onChange={handleChange('confirmPassword')}
						endAdornment={
							<InputAdornment position='end'>
								<IconButton 
									aria-label='Toggle Confirm Password Visibility' 
									onClick={handleShowConfirmPassword}
									onMouseDown={handlePreventDefault}
									edge='end'
								>
									{data.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						}
					/>
				</FormControl>
				<Button 
					label='Sign up'
					sx={{ backgroundColor: '#181818', '&:hover': { backgroundColor: 'black'}, }}
					variant='contained' 
					endIcon={<PersonAdd />}
					onClick={handleSignUp}
					onMouseDown={handlePreventDefault}
					id="loginSignupDeleteButton">
						Sign up
				</Button>
				<div id='loginSignupTextContainer'>
					<p>Have an account? <Link 
							to="/Login" 
							id="loginSignupLink">
								Log in here <span id="loginSignupIcon"><Login /></span>
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
							Sign up with Google
					</Button>
				</div>
			</Box>
		</div>
	);
}