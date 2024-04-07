import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import {addFile} from "./controllers/item.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import linkRoutes from "./routes/link.js";
import itemRoutes from "./routes/item.js";
import { verifyToken } from "./middleware/auth.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "100mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/zips", express.static(path.join(__dirname, "zips")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/pdfs", express.static(path.join(__dirname, "pdfs")));



/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let location="assets";
      // console.log(req.params);
      if(req.params.itemType==="image"){
        location="images";
      } else if(req.params.itemType==="pdf"){
        location="pdfs";
      } else if(req.params.itemType==="zip"){
        location="zips";
      }
      cb(null, location);
    },
    filename: function (req, file, cb) {
      // console.log(req.body);
      const preName=Math.floor(Math.random() * 1000000000);
      const temp=`${preName}${file.originalname}`;
      req.body.data=temp;
      cb(null, temp);
    },
  });
  const upload = multer({ storage });


  app.post("/:link/file/:itemType",verifyToken,upload.single("file"),addFile);


  app.use("/auth",authRoutes);
  app.use("/user",userRoutes);
  app.use("/link",linkRoutes);
  app.use("/item",itemRoutes);


  const PORT = process.env.PORT || 6001;
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      app.listen(PORT, () => console.log(`Server Port: ${PORT} connected`));
  
      /* ADD DATA ONE TIME */
      // User.insertMany(users);
      // Post.insertMany(posts);
    })
    .catch((error) => console.log(`${error} did not connect`));