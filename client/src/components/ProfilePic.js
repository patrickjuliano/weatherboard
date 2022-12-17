import React from 'react';
import '../App.css';
import defaultProfile from '../images/default.png'
import axios from 'axios';
import { checkString } from '../validation';

import { getAuth } from 'firebase/auth';

export default function ProfilePic({ currentUserID }) {
    const [ pfpLink, setPfpLink ] = React.useState('');

    React.useEffect(() => {
        async function fetchData() {
			const id = checkString(currentUserID);
			try {
				const { data } = await axios.get(`http://localhost:4000/account/pfpicon/${id}`);
                if (data === null || data === '') {
                    setPfpLink(defaultProfile);
                } else {
                    setPfpLink('data:image/;base64,'+data);
                }
			} catch (e) {
                console.log(e);
            }
		}
		fetchData();
    }, []);

    return(
        <img src={pfpLink} referrerPolicy="no-referrer" alt="Profile Pic" />
    );
}