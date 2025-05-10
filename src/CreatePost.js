import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CreatePost.css";
import { AuthContext } from "./AuthContext";
import { PostContext } from "./PostContext";

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { setPosts } = useContext(PostContext);
  const [postData, setPostData] = useState({ title: "", content: "" });
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    setMedia(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to create a post", { autoClose: 2000 });
      return;
    }
    const formData = new FormData();
    formData.append("title", postData.title);
    formData.append("content", postData.content);
    formData.append("author", user.username);
    if (media) {
      formData.append("mediaFile", media);
    }
    try {
      const response = await fetch("http://127.0.0.1:5000/createPost", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        setPosts((prevPosts) => [result.newPost, ...prevPosts]);
        toast.success("Post created successfully!", { autoClose: 2000 });
        setPostData({ title: "", content: "" });
        setMedia(null);
        setMediaPreview(null);
        navigate("/");
      } else {
        toast.error(result.message, { autoClose: 2000 });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create post", { autoClose: 2000 });
    }
  };

  return (
    <div className="create-post-container">
      <ToastContainer />
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={postData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="Content"
          value={postData.content}
          onChange={handleChange}
          required
        />
        <input type="file" accept="image/*,video/*" onChange={handleMediaChange} />
        {mediaPreview && (
          <div className="media-preview">
            {media.type.startsWith("video/") ? (
              <video src={mediaPreview} controls />
            ) : (
              <img src={mediaPreview} alt="Media Preview" />
            )}
          </div>
        )}
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default CreatePost;