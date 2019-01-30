const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
  name: { type: String, required: true },
  isRoot: { type: Boolean, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, required: false, ref: "Category" },
  // add these as empty arrays when creating new category
  services: { type: [], required: true },
  children: { type: [], required: true },
});

module.exports = mongoose.model("Category", categorySchema);
