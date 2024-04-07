import mongoose from "mongoose";

const linkSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    privacy: {
      type: String,
      required: true,
      default: "private"
    },
    password:{
      type: String,
    },
    editable: {
      type: Boolean,
      required: true,
      default: true
    },
  },
  { timestamps: true }
);

const Link = mongoose.model("Link", linkSchema);

export default Link;