import { Box, Button, TextField, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { setLink } from '../state/state';
import { useDispatch, useSelector } from 'react-redux';

function InputPassword({setMessage,link}) {

    const navigate=useNavigate();
    const serverLink=useSelector((state)=> state.serverLink);
    const token = useSelector((state) => state.token);
    const dispatch=useDispatch();


    const checkPassword=async () => {
        const desc=document.getElementById("protectedPassword");
      if(desc.value.length<8){
        alert("Password should have at least 8 characters!");
        return;
      }
      const response = await fetch(`${serverLink}/link/${link}/pass/${desc.value}`, {
        method: "GET",
        headers: { "Content-Type": "application/json",Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if(data){
        if(data.message==="Wrong Password"){
            alert("Wrong Password! Kindly try again.")
        } else {
            setMessage(data.message);
            dispatch(setLink({linkData:data.linkData}));
            desc.value="";
        }
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
        Enter Password
      </Typography>
      <Typography
      fontSize="clamp(0.5rem, 1rem, 1.1rem)"
      color="primary"
      >
        This link is protected by the owner. Kindly enter the correct password to access it:
      </Typography>
      <TextField label="Password" id="protectedPassword" type='password' 
      sx={{"margin":'20px 0', "width":"100%", "fontSize":"clamp(0.5rem, 1rem, 1.1rem)"}} />
      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
        <Button sx={{backgroundColor:"rgba(0,0,0,0.2)", border:"1px solid transparent", "&:hover":{
            border:"1px solid"
        }}} onClick={()=>navigate('/')}>
            Cancel
        </Button>
        <Button sx={{backgroundColor:"rgba(0,0,0,0.2)", border:"1px solid transparent", "&:hover":{
            border:"1px solid"
        }}} onClick={checkPassword}>
            Proceed
        </Button>
      </Box>
        </Box>

    </Box>
  )
}

export default InputPassword
