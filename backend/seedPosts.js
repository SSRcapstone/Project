import mongoose from "mongoose";
import Post from "./models/Post.js";

(async function seedPosts() {
  try {
    await mongoose.connect("mongodb://localhost:27017/bizcon", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Clear existing posts
    await Post.deleteMany({});
    console.log("Cleared existing posts");

    // Create 5 sample posts (using dummy ObjectIDs for the user field)
    const samplePosts = [
      {
        author: "AliceWonder",
        user: new mongoose.Types.ObjectId(), 
        title: "Launch Update",
        content: "Excited to share our new project launch!",
        mediaURL: "test.jpg",
        likes: [],
        comments: []
      },
      {
        author: "BobBuilder",
        user: new mongoose.Types.ObjectId(),
        title: "Revolution App",
        content: "Just built a revolutionary app, check it out!",
        mediaURL: "",
        likes: [],
        comments: []
      },
      {
        author: "CharlieChaplin",
        user: new mongoose.Types.ObjectId(),
        title: "Innovation Tips",
        content: "Innovation is the key to success, embrace change!",
        mediaURL: "test.jpg",
        likes: [],
        comments: []
      },
      {
        author: "DianaPrince",
        user: new mongoose.Types.ObjectId(),
        title: "BizCon Love",
        content: "Networking made easy with BizCon, love it!",
        mediaURL: "",
        likes: [],
        comments: [{ user: new mongoose.Types.ObjectId(), text: "Absolutely agree!", createdAt: new Date() }]
      },
      {
        author: "EdwardScissorhands",
        user: new mongoose.Types.ObjectId(),
        title: "Tech Update",
        content: "Creativity meets technology in our new update.",
        mediaURL: "test.jpg",
        likes: [],
        comments: []
      }
    ];

    await Post.insertMany(samplePosts);
    console.log("Seeded 5 posts successfully.");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  } catch (error) {
    console.error("Error seeding posts:", error);
  }
})();
