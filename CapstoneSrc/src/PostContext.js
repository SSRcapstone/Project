import React, { createContext, useState, useEffect } from 'react';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  // Initialize posts as an empty array
  const [posts, setPosts] = useState([]);

  // Fetch posts from the backend on mount
  useEffect(() => {
    fetch("http://localhost:5000/posts")
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts);
      })
      .catch(err => console.error("Error fetching posts:", err));
  }, []);

  return (
    <PostContext.Provider value={{ posts, setPosts }}>
      {children}
    </PostContext.Provider>
  );
};
