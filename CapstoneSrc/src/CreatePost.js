import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from './AuthContext';
import { PostContext } from './PostContext';  // Updated import path

const CreatePost = () => {
  const { user } = useContext(AuthContext);
  const { setPosts } = useContext(PostContext);
  const navigate = useNavigate();
  const [postData, setPostData] = useState({
    title: '',
    content: ''
  });
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setMedia(file);
    if (file) {
      setMediaPreview(URL.createObjectURL(file));
    } else {
      setMediaPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to create a post', { autoClose: 2000 });
      return;
    }
    try {
      // Simulate a POST request to backend that creates a post.
      // For demonstration, we add the post to PostContext.
      const newPost = {
        id: Date.now(),
        author: user.username,
        content: postData.content,
        title: postData.title,
        // Optionally include media URL if uploaded
        mediaURL: mediaPreview || null
      };
      setPosts(prevPosts => [newPost, ...prevPosts]);
      toast.success('Post created successfully!', { autoClose: 2000 });
      setPostData({ title: '', content: '' });
      setMedia(null);
      setMediaPreview(null);
      // Change navigation target to "/feed"
      setTimeout(() => navigate('/feed'), 2000);
    } catch (error) {
      console.error(error);
      toast.error('Failed to create post', { autoClose: 2000 });
    }
  };

  return (
    <div style={{ marginTop: '50px', padding: '20px' }}>
      <ToastContainer />
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
        <input
          type="text"
          name="title"
          placeholder="Post Title"
          value={postData.title}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <textarea
          name="content"
          placeholder="Post Content"
          value={postData.content}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', minHeight: '150px', marginBottom: '10px' }}
        />
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          style={{ marginBottom: '10px' }}
        />
        {mediaPreview && (
          <div style={{ marginBottom: '10px' }}>
            {media.type.startsWith('image') ? (
              <img src={mediaPreview} alt="Preview" style={{ maxWidth: '100%' }} />
            ) : (
              <video src={mediaPreview} controls style={{ maxWidth: '100%' }} />
            )}
          </div>
        )}
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
