import mongoose from "mongoose";

const itemSchema = mongoose.Schema(
  {
    link: {
      type: String,
      required: true,
    },
    itemType: {
      type: String,
      required: true,
      default: "text"
    },
    data: {
      type: String,
      required: true,
      default: ""
    },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);

export default Item;