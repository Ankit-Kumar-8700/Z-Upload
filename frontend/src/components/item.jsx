import styled from '@emotion/styled';
import { Check, Close, Delete, Download, Edit } from '@mui/icons-material';
import { Box, IconButton, TextField, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import Image from './image';
import { saveAs } from 'file-saver';
import { Document, Page } from 'react-pdf';


function Item({item, number, link, setItems, defaultValue}) {

    const theme = useTheme();
    const {editable,userId} = useSelector((state)=>state.linkData)
    const serverLink=useSelector((state)=>state.serverLink);
    const token = useSelector((state) => state.token);
    const {_id} = useSelector((state) => state.user)

    const [editOn,setEditOn]=useState(false);

    const handleUpdateItem=async () => {
        const desc=document.getElementById(`outlined-read-only-input-${item._id}`);
        if(desc.value===""){
            return alert("You can't keep the textbox empty");
        }
        console.log(desc.value);

        const response = await fetch(`${serverLink}/item/${link}/text/${item._id}`, {
            // mode: "no-cors",
            method: "PATCH",
            headers: { "Content-Type": "application/json",Authorization: `Bearer ${token}` },
            body: JSON.stringify({data:desc.value})
          });
          const data = await response.json();
          if(data && !data.message){
            setEditOn(false);
            setItems(data);
          } else {
            console.log(data.message);
          }
    }


    const handleDeleteItem = async () => {
        const response = await fetch(`${serverLink}/item/${link}/${item._id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json",Authorization: `Bearer ${token}` }
          });
          const data = await response.json();
          if(data && !data.message){
            setItems(data);
          } else {
            console.log(data.message);
          }
    }


    const handleDownloadItem = (link,name) => {
      saveAs(link, name);
    }

    const FlexBetween=styled(Box)({
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
    });

  return (
    <Box
      width={item.itemType==="text"?"100%":"220px"}
    //   mt={isNonMobileScreens ? undefined : "2rem"}
      borderRadius="0.75rem"
      backgroundColor={theme.palette.background.alt}
      margin="20px auto"
    >
        <FlexBetween>
            <Typography width="100%" padding="0.5rem" fontSize="clamp(0.5rem, 1rem, 0.8rem)" sx={{
                background:"rgba(0,0,0,0.2)"
            }}>
                Item #{number+1} : 
            </Typography>
            <FlexBetween>
                {item.itemType==="text" && !editOn && ( editable || _id===userId ) && <IconButton onClick={()=>setEditOn(true)}>
                    <Edit />
                </IconButton>}
                {item.itemType==="text" && editOn && ( editable || _id===userId ) && <IconButton onClick={handleUpdateItem}>
                    <Check />
                </IconButton>}
                {item.itemType==="text" && editOn && ( editable || _id===userId ) && <IconButton onClick={()=>{
                    setEditOn(false);
                    document.getElementById(`outlined-read-only-input-${item._id}`).value=item.data;
                }}>
                    <Close />
                </IconButton>}
                {item.itemType!=="text" && <IconButton onClick={()=>{handleDownloadItem(`${serverLink}/${item.itemType}s/${item.data}`,`${item.data}`)}}>
                    <Download />
                </IconButton>}
                { ( editable || _id===userId ) && <IconButton onClick={handleDeleteItem}>
                    <Delete />
                </IconButton>}
            </FlexBetween>
        </FlexBetween>
            {item.itemType==="text" && <TextField
            id={`outlined-read-only-input-${item._id}`}
            sx={{
                width:"100%",
                overflowY:"scroll"
            }}
            multiline
            rows={10}
            // label="Read Only"
            defaultValue={defaultValue}
            InputProps={{
                readOnly: !editOn,
            }}
            />}
            {item.itemType==="image" && <Image size="100%" link={true} rectangle={true} image={`${item.itemType}s/${item.data}`} />}
            {item.itemType==='pdf' && <Image size="100%" link={true} rectangle={true} image={`assets/pdfImage.png`} name={item.data.slice(9)} />
            }
    </Box>
  )
}

export default Item
