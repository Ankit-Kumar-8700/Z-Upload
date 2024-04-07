import { Box, Button, TextField, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { setLink, setUser } from '../state/state';
import { useDispatch, useSelector } from 'react-redux';

function OwnLink({link,setMessage}) {

    const navigate=useNavigate();
    const serverLink=useSelector((state)=> state.serverLink);
    const token = useSelector((state) => state.token);
    const dispatch=useDispatch();


    const ownLink=async () => {
      const response = await fetch(`${serverLink}/link/${link}`, {
        method: "POST",
        headers: { "Content-Type": "application/json",Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if(data){
            dispatch(setUser({user:data.user}));
            dispatch(setLink({linkData:data.linkData}));
            setMessage("Data sent");
      } else {
        alert("Internal Server Error");
        navigate('/');
      } 
    }
  return (
    <Box position="fixed" width="100vw" height="100vh" zIndex="10000" backgroundColor="rgb(99 99 99 / 50%)" display="flex" alignItems="center" justifyContent="center">
        <Box maxWidth="min(90vw, 400px)" padding="1rem 2rem" borderRadius="2rem" backgroundColor="rgba(0,0,0,0.3)">
        <Typography
        textAlign="center"
        fontWeight="bold"
        fontSize="clamp(0.7rem, 1.4rem, 1.6rem)"
        color="primary"
      >
        No Owner
      </Typography>
      <Typography
      fontSize="clamp(0.5rem, 1rem, 1.1rem)"
      color="primary"
      >
        It's an unregistered link. Do you want to own this link?
      </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
        <Button sx={{backgroundColor:"rgba(0,0,0,0.2)", border:"1px solid transparent", "&:hover":{
            border:"1px solid"
        }}} onClick={()=>navigate('/')}>
            No
        </Button>
        <Button sx={{backgroundColor:"rgba(0,0,0,0.2)", border:"1px solid transparent", "&:hover":{
            border:"1px solid"
        }}} onClick={ownLink}>
            Yes
        </Button>
      </Box>
        </Box>

    </Box>
  )
}

export default OwnLink
