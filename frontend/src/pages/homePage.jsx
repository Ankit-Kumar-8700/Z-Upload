import { Box, Divider, Drawer, IconButton, Link, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from 'react'
import Navbar from '../components/navbar'
import { ArrowRight, Check, Delete, ManageAccounts } from "@mui/icons-material";
import styled from "@emotion/styled";
import logo from '../images/logo.png'
import Image from "../components/image";
import { useNavigate } from "react-router-dom";
import { setLink, setLogout, setUser } from "../state/state";

function HomePage() {

    const navigate=useNavigate();

  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const serverLink=useSelector((state)=> state.serverLink);
  const token = useSelector((state) => state.token);
  const { _id,name,email,links } = useSelector((state) => state.user);
  const dispatch=useDispatch();

  const theme = useTheme();
  const primaryMain = theme.palette.primary.main;
  
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const getUser = async () => {
    const response = await fetch(`${serverLink}/user/${_id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if(data){
      dispatch(
        setUser({
          user: data,
        })
      );
      dispatch(setLink({linkData:{}}));
    } else {
      alert("User is not logged in.");
      // dispatch(setLogout());
    }
  };

  const changeName=async () =>{
    const desc=document.getElementById("changeName");
      if(desc.value.length===0){
        alert("Name can't be empty");
        return;
      }
    const response = await fetch(`${serverLink}/user/${_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json",Authorization: `Bearer ${token}` },
      body: JSON.stringify({name:desc.value})
    });
    const data = await response.json();
    if(data){
      dispatch(
        setUser({
          user: data,
        })
      );
      dispatch(setLink({linkData:{}}));
      desc.value="";
    } else {
      alert("User is not logged in.");
      // dispatch(setLogout());
    } 
  }

  useEffect(()=>{
    getUser();
  },[]);

  const SpecialButton=styled(IconButton)({
    backgroundColor: `${primaryMain} !important`,
    margin: "1rem",
    position: "fixed",
    zIndex: "100",
    boxShadow: "2px 2px 2px black",
    color: "black"
});

  const VerticalFlex=styled(Box)({
    display:"flex",
    flexDirection:"column"
  })

  const CenteredBox=styled(Box)({
    display:"flex",
    alignItems:"center",
    justifyContent:"center"
  })

  const FlexBetween=styled(Box)({
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center"
});

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" 
    // onClick={toggleDrawer(false)}
    >
      <VerticalFlex>
        <CenteredBox paddingLeft="20%">
            <Image image={logo} size="75%" />
        </CenteredBox>
        <CenteredBox>
            <Typography
            fontWeight="bold"
            fontSize="clamp(1rem, 2rem, 2.25rem)"
            color="#c5b458"
            borderRadius="30px"
            padding="0 10px"
            margin="5px 15px"
            onClick={() => navigate("/")}
            sx={{
              "&:hover": {
                color: "#958636",
                cursor: "pointer",
                backgroundColor: `${primaryMain} !important`,
                boxShadow: `10px 0px darkblue, -10px 0px darkblue`,
                textShadow : "3px 3px 3px darkblue"
              },
            }}>
                Z-Upload
            </Typography>
        </CenteredBox>
        <Divider />
        <CenteredBox marginTop="10px">
            <Typography fontWeight="bold"
            fontSize="clamp(0.7rem, 1.4rem, 1.1rem)"
            color="#c5b458" >
                Welcome {name}
            </Typography>
        </CenteredBox>
        <Box margin="10px 5px" display="flex" flexWrap="wrap">
            <Typography
            color="#c5b458">
               Email : <p style={{fontWeight:"bold", margin:"0", padding:"0"}}>{email}</p>
            </Typography>
        </Box>
        <Box margin="10px 5px" color="#c5b458" >
            <Typography margin="3px 0">
                Wanna change your name?..
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="center">
            <TextField 
                  label="New Name"
                  id="changeName"
                />
            <IconButton margin="0 5px" onClick={changeName} >
                <Check />
            </IconButton>
            </Box>
        </Box>
      </VerticalFlex>
    </Box>
  );

  return (
    <Box minHeight="100vh">
        <Navbar />
        <SpecialButton  onClick={toggleDrawer(true)}><ManageAccounts /> <ArrowRight /></SpecialButton>
        <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
        </Drawer>
        <Box
        width="100%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box
          flexBasis={isNonMobileScreens ? "70%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
          borderRadius="0.75rem"
          backgroundColor={theme.palette.background.alt}
          margin="20px auto"
        >
          <Typography fontWeight="bold"
            fontSize="clamp(1rem, 2rem, 2.25rem)"
            color={primaryMain}
            padding="0 10px"
            backgroundColor="rgba(0,0,0,0.3) !important">
            Owned Links :
          </Typography>
          <Box overflow="scroll" maxHeight="70vh">
          {links.map((link,id)=>{
              return <FlexBetween width="100%"><Typography width="100%" padding="5px 15px"  onClick={()=>{navigate(`/${link}`)}}><Link key={id} display="block"  padding="5px"  sx={{
                cursor:"pointer",
                width: "100%",
                borderRadius:"20px",
                textDecoration:"none",
                "&:hover": {
                    color: "darkblue",
                    fontWeight:"bold",
                cursor: "pointer",
                backgroundColor: `${primaryMain} !important`,
                boxShadow: `5px 0px darkblue, -5px 0px darkblue`,
                // textShadow : "3px 3px 3px darkblue"
                  },
            }} >{link}</Link><Divider /></Typography>
              <IconButton>
                <Delete onClick={async ()=>{
                  const response = await fetch(`${serverLink}/link/${link}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  const data = await response.json();
                  if(data){
                    console.log(data);
                    dispatch(
                      setUser({
                        user: data.user,
                      })
                    );
                    dispatch(setLink({linkData:{}}));
                  } else {
                    alert("User is not logged in.");
                    // dispatch(setLogout());
                  }
                }} />
              </IconButton>
            </FlexBetween>
          })}
          </Box>
        </Box>

      </Box>
    </Box>
  )
}

export default HomePage
