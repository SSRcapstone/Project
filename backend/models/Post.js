import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  author: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String },
  content: { type: String, required: true },
  mediaURL: { type: String },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Post", postSchema);
