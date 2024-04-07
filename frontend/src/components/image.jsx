import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";

const Image = ({ image, size = "60px", link=false, rectangle=false, name }) => {
    const serverLink=useSelector((state)=>state.serverLink);
  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: rectangle?"0%":"50%", maxWidth:`${size}`, maxHeight:`${size}` }}
        alt="pic"
        src={link?`${serverLink}/${image}`:image}
      />
      <Typography sx={{
        textAlign:"center",
        marginBottom:"10px"
      }}>
        {name}
      </Typography>
    </Box>
  );
};

export default Image;