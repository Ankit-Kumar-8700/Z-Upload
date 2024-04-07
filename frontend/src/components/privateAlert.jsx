import { Box, Button, TextField, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { setLink } from '../state/state';

function PrivateAlert() {

    const navigate=useNavigate();

  return (
    <Box position="fixed" width="100vw" height="100vh" zIndex="10000" backgroundColor="rgb(99 99 99 / 50%)" display="flex" alignItems="center" justifyContent="center">
        <Box maxWidth="min(90vw, 400px)" padding="1rem 2rem" borderRadius="2rem" backgroundColor="rgba(0,0,0,0.3)">
        <Typography
        textAlign="center"
        fontWeight="bold"
        fontSize="clamp(0.7rem, 1.4rem, 1.6rem)"
        color="primary"
      >
        Private Link
      </Typography>
      <Typography
      fontSize="clamp(0.5rem, 1rem, 1.1rem)"
      color="primary"
      >
        This link can only be accessed by the owner. It's a private link.
      </Typography>
      
      <Box display="flex" justifyContent="center" alignItems="center" width="100%">
        <Button sx={{backgroundColor:"rgba(0,0,0,0.2)", border:"1px solid transparent", "&:hover":{
            border:"1px solid"
        }}} onClick={()=>navigate('/')}>
            OK
        </Button>
      </Box>
        </Box>

    </Box>
  )
}

export default PrivateAlert
