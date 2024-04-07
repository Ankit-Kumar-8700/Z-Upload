import { Box, Divider, Drawer, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import React, { useState } from 'react'
import Navbar from '../components/navbar'
import { Add, ArrowRight, Check, DeleteOutlined, EditOutlined, ManageAccounts, Upload } from "@mui/icons-material";
import styled from "@emotion/styled";
import logo from '../images/logo.png'
import Image from "../components/image";
import { useNavigate, useParams } from "react-router-dom";
import Dropzone from "react-dropzone";
import InputPassword from "../components/inputPassword";
import PrivateAlert from "../components/privateAlert";
import OwnLink from "../components/ownLink";
import { setLink } from "../state/state";
import Item from "../components/item";

function LinkPage() {

    const navigate=useNavigate();
    const {link}=useParams();

  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id,name } = useSelector((state) => state.user);
  const linkData=useSelector((state)=>state.linkData)
  const serverLink=useSelector((state)=> state.serverLink);
  const token = useSelector((state) => state.token);
  const dispatch=useDispatch();


  const theme = useTheme();
  const primaryMain = theme.palette.primary.main;
  const medium = theme.palette.neutral.medium;
  
  const [open, setOpen] = useState(false);
  const [fileType, setFileType] = useState('text');
  const [privacy, setPrivacy] = useState('private');
  const [editable, setEditable] = useState(false);
  const [message,setMessage] = useState("");
  const [items,setItems]=useState([]);
  const [file, setFile] = useState(null);


  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

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

  const FlexBetween=styled(Box)({
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    width:"100%"
});

  const CenteredBox=styled(Box)({
    display:"flex",
    alignItems:"center",
    justifyContent:"center"
  });


  const getItems=async (fileType) => {
    setFile(null);
    const response = await fetch(`${serverLink}/item/${link}/${fileType}`, {
      method: "GET",
      headers: { "Content-Type": "application/json",Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if(data){
      setItems(data);
    }
  }


  const addTextItem=async () => {
    const response = await fetch(`${serverLink}/item/${link}/text/new`, {
      method: "POST",
      headers: { "Content-Type": "application/json",Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if(!data.error){
      setItems(data);
      setFileType("text");
    } else {
      console.log(data.error);
    }
  }


  const addFile=async () => {
    const formData=new FormData();
    if(!file){
      return alert(`Select the ${fileType} before adding it.`)
    }

    if (fileType==="image" && !file.name.match(/\.(jpg|jpeg|png|gif)$/i)){
      return alert('Upload an image. Selected file is not an image!');
    }
    if (fileType==="pdf" && !file.name.match(/\.(pdf)$/i)){
      return alert('Upload a pdf. Selected file is not pdf!');
    }
    
    formData.append("file",file);
    formData.append("data",file.name);
    // console.log(formData);

    try {
      const response = await fetch(`${serverLink}/${link}/file/${fileType}`, {
        // mode: "no-cors",
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      setItems(data);
      setFile(null);
    } catch (error) {
      console.log(error);
    }
  }


  const getInitialLinkData= async () => {
    const response = await fetch(`${serverLink}/link/${link}/pass/null`, {
      method: "GET",
      headers: { "Content-Type": "application/json",Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    setMessage(data.message);
    if(data.message==="Data sent"){
      dispatch(setLink({linkData:data.linkData}));
      setPrivacy(data.linkData.privacy);
      setEditable(data.linkData.editable);
      getItems("text");
    }
  }


  useState(()=>{
    getInitialLinkData();
  },[]);


  const updateLinkSettings= async () => {
    let password="";
    if(privacy==="protected"){
      const desc=document.getElementById("changePassword");
      if((linkData.privacy==="protected" && desc.value==="") || desc.value.length>7){
        password=desc.value;
      } else {
        return alert("New Password should have at least 8 characters!");
      }
    }

    const response = await fetch(`${serverLink}/link/${link}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json",Authorization: `Bearer ${token}` },
      body: JSON.stringify({password:password, privacy:privacy, editable:editable})
    });
    const data = await response.json();
    if(data && !data.message){
      dispatch(setLink({linkData:data}));
    } else {
      alert("Internal Server Error");
      navigate('/');
    } 
  }

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
        {/* <Box margin="10px 5px" display="flex" flexWrap="wrap">
            <Typography
            color="#c5b458">
               This link is owned by <b style={{fontWeight:"bold", margin:"0", padding:"0"}}>{name}</b>
            </Typography>
        </Box> */}
        <Divider />
        <Box margin="0 10px">
        <FormControl margin="20px" sx={{
          color:`#c5b458`
        }}>
      <FormLabel sx={{color:"#a59438"}} id="file-type-radio">Select File-Type :</FormLabel>
      <RadioGroup
        aria-labelledby="file-type-radio"
        defaultValue="text"
        name="file-type-radio-buttons-group"
        value={fileType}
        onChange={(e)=>{setFileType(e.target.value); getItems(e.target.value);}}
      >
        <FlexBetween>
        <FormControlLabel value="text" control={<Radio  sx={{
    color: "#c5b458",
    '&.Mui-checked': {
      color: "#c5b458"
    }}}/>} label="Text" />
    <IconButton>
      <Add onClick={addTextItem} sx={{color:"#c5b458", outline:"1px solid #e5d458", padding:"5px", borderRadius:"50%"}} />
    </IconButton>
    </FlexBetween>
    <FlexBetween>
        <FormControlLabel value="image" control={<Radio sx={{
    color: "#c5b458",
    '&.Mui-checked': {
      color: "#c5b458"
    }}}/>} label="Images" />
    </FlexBetween>
    <FlexBetween>
        <FormControlLabel value="pdf" control={<Radio sx={{
    color: "#c5b458",
    '&.Mui-checked': {
      color: "#c5b458"
    }}}/>} label="Pdf's" />
    </FlexBetween>
      </RadioGroup>
      </FormControl>
      <Divider />
      </Box>
    { linkData && linkData.userId===_id &&
      <>
      <Box margin="0 10px">
      <FormControl sx={{
    color: "#c5b458",
    '&.Mui-checked': {
      color: "#c5b458"
    }}}>
      <FormLabel sx={{color:"#a59438"}} id="privacy-radio">Privacy :</FormLabel>
      <RadioGroup
        aria-labelledby="privacy-radio"
        defaultValue={linkData.privacy}
        name="privacy-radio-buttons-group"
        value={privacy}
        onChange={(e)=>setPrivacy(e.target.value)}
      >
        <FormControlLabel value="private" control={<Radio sx={{
    color: "#c5b458",
    '&.Mui-checked': {
      color: "#c5b458"
    }}}/>} label="Private" />
        <FormControlLabel value="protected" control={<Radio sx={{
    color: "#c5b458",
    '&.Mui-checked': {
      color: "#c5b458"
    }}}/>} label="Protected" />
        {privacy==='protected' && <TextField margin="0 10px"
                  label="Change Password (Protected Mode)"
                  id="changePassword"
        />}
        <FormControlLabel value="public" control={<Radio sx={{
    color: "#c5b458",
    '&.Mui-checked': {
      color: "#c5b458"
    }}}/>} label="Public" />
      </RadioGroup>
      <Box height="1rem" />
      <FormLabel sx={{color:"#a59438"}} id="editable-radio">Others can edit files :</FormLabel>
      <RadioGroup
        aria-labelledby="editable-radio"
        defaultValue={linkData.editable}
        name="editable-radio-buttons-group"
        value={editable}
        onChange={(e)=>setEditable(e.target.value)}
      >
        <FormControlLabel value={true} control={<Radio sx={{
    color: "#c5b458",
    '&.Mui-checked': {
      color: "#c5b458"
    }}}/>} label="Yes" />
        <FormControlLabel value={false} control={<Radio sx={{
    color: "#c5b458",
    '&.Mui-checked': {
      color: "#c5b458"
    }}}/>} label="No" />
      </RadioGroup>

    </FormControl>
    </Box>

    <Typography
            fontWeight="bold"
            fontSize="clamp(0.7rem, 1.4rem, 1.1rem)"
            color="#c5b458"
            borderRadius="30px"
            padding="0 10px"
            margin="5px 15px"
            backgroundColor="rgba(0,0,0,0.2) !important"
            onClick={updateLinkSettings}
            sx={{
              "&:hover": {
                color: "#958636",
                cursor: "pointer",
                backgroundColor: `${primaryMain} !important`,
                boxShadow: `10px 0px darkblue, -10px 0px darkblue`,
              },
            }}>
                Update Settings
            </Typography>
            </>
        }
      </VerticalFlex>
    </Box>
  );


  return (
    <Box minHeight="100vh">
      
      { message==="Password Required" && <InputPassword setMessage={setMessage} link={link} /> }
      { message==="Private link" && <PrivateAlert /> }
      { message==="Unregistered Link" && <OwnLink link={link} setMessage={setMessage} /> }
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
        
        { message==="Data sent" && <Box
          flexBasis={isNonMobileScreens ? "70%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
          borderRadius="0.75rem"
          // backgroundColor={theme.palette.background.alt}
          margin={isNonMobileScreens?"20px auto":"20px"}
        >
          {fileType!=="text" && (linkData.editable===true || linkData.userId===_id) && 
          <Box
            border={`1px solid ${medium}`}
            borderRadius="5px"
            mt="1rem"
            p="1rem"
            width="100%"
          >
            <Dropzone
              acceptedFiles=".jpg,.jpeg,.png"
              width="100%"
              multiple={false}
              onDrop={(acceptedFiles) => setFile(acceptedFiles[0])}
            >
              {({ getRootProps, getInputProps }) => (
                <FlexBetween>
                  <Box
                    {...getRootProps()}
                    border={`2px dashed ${theme.palette.primary.main}`}
                    p="1rem"
                    width="100%"
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  >
                    <input {...getInputProps()} />
                    {!file ? (
                      <p>Add {fileType} Here</p>
                    ) : (
                      <FlexBetween>
                        <Typography>{file.name}</Typography>
                        <EditOutlined />
                      </FlexBetween>
                    )}
                  </Box>
                  {file && (
                    <IconButton
                      onClick={() => setFile(null)}
                      sx={{ width: "40px" }}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  )}
                  {file && (
                    <IconButton
                      onClick={() => addFile()}
                      sx={{ width: "40px" }}
                    >
                      <Upload />
                    </IconButton>
                  )}
                </FlexBetween>
              )}
            </Dropzone>
          </Box>}
          <Box sx={{
            width:"100%",
            display: "fles",
            justifyContent:"space-evenly",
            flexWrap:"wrap"
          }}>
          {items.map((item,id)=>{
            return <Item key={id} number={id} item={item} link={link} setItems={setItems} defaultValue={item.data} />
          })}
          </Box>
        </Box>}

      </Box>
    </Box>
  )
}

export default LinkPage
