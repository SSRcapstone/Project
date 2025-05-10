import React, { useContext, useState } from 'react';
import { PostContext } from './PostContext';
import { FaHeart, FaComment, FaShare, FaRss } from 'react-icons/fa';

const FeedPost = ({ post }) => {
  const [likes, setLikes] = useState(post.likes || 0);
  const [comments, setComments] = useState(post.comments || []);
  
  const handleLike = () => setLikes(likes + 1);
  const handleComment = () => {
    const commentText = prompt("Enter your comment:");
    if (commentText) {
      setComments([...comments, { author: "Anonymous", text: commentText }]);
    }
  };
  const handleShare = () => alert("Post shared!");
  
  const isVideo = post.mediaURL &&
    (post.mediaURL.toLowerCase().endsWith('.mp4') ||
     post.mediaURL.toLowerCase().endsWith('.webm') ||
     post.mediaURL.toLowerCase().endsWith('.ogg'));
  
  return (
    <div className="post" style={{
      margin: '20px auto',
      maxWidth: '700px',
      border: '1px solid #ddd',
      borderRadius: '12px',
      padding: '15px',
      boxShadow: '0 6px 12px rgba(0,0,0,0.1)'
    }}>
      {/* Post Header */}
      <div className="post-header" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '10px',
        borderBottom: '1px solid #ddd',
        backgroundColor: "var(--primary-color)",
        color: "white"
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="p1.jpg" alt="Profile" className="post-profile-pic" style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginRight: '10px',
            border: '2px solid white'
          }} />
          <h3 style={{ margin: 0 }}>{post.author}</h3>
        </div>
        <button className="connect-button" style={{
          backgroundColor: 'white',
          color: 'var(--primary-color)',
          border: 'none',
          borderRadius: '5px',
          padding: '5px 10px',
          cursor: 'pointer'
        }}>
          Connect
        </button>
      </div>
      {/* Post Content */}
      <div className="post-content" style={{ padding: '10px 0', textAlign: 'left' }}>
        {post.mediaURL ? (
          isVideo ? (
            <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              controls 
              style={{ maxWidth: '100%', height: 'auto', backgroundColor: 'black' }}
              onError={(e) => console.error("Video playback error", e)}
            >
              <source src={post.mediaURL} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={post.mediaURL} alt="Post content" className="post-image" style={{
              width: '100%',
              height: '400px',
              objectFit: 'cover'
            }} />
          )
        ) : (
          <img src="test.jpg" alt="Post content" className="post-image" style={{
            width: '100%',
            height: '400px',
            objectFit: 'cover'
          }} />
        )}
        <p className="post-text" style={{ margin: '10px 0' }}>{post.content}</p>
        {comments.length > 0 && (
          <div className="post-comments">
            {comments.map((cmt, idx) => (
              <p key={idx} style={{ margin: '5px 0' }}>
                <strong>{cmt.author}:</strong> {cmt.text}
              </p>
            ))}
          </div>
        )}
      </div>
      {/* Post Actions */}
      <div className="post-actions" style={{
        display: 'flex',
        justifyContent: 'space-around',
        paddingTop: '10px',
        borderTop: '1px solid #ddd'
      }}>
        <button onClick={handleLike} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <FaHeart /> Like ({likes})
        </button>
        <button onClick={handleComment} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <FaComment /> Comment
        </button>
        <button onClick={handleShare} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <FaShare /> Share
        </button>
      </div>
    </div>
  );
};

const Feed = () => {
  const { posts } = useContext(PostContext);
  // Define sample posts to showcase the project if no posts exist in context.
  const samplePosts = [
    { id: '1', author: 'AliceWonder', content: 'Excited to share our new project launch!', mediaURL: 'test.jpg', likes: 10, comments: [{ author: 'Bob', text: 'Congratulations!' }] },
    { id: '2', author: 'BobBuilder', content: 'Just built a revolutionary app, check it out!', mediaURL: '', likes: 8, comments: [] },
    { id: '3', author: 'CharlieChaplin', content: 'Innovation is the key to success, embrace change!', mediaURL: 'test.jpg', likes: 15, comments: [] },
    { id: '4', author: 'DianaPrince', content: 'Networking made easy with BizCon, love it!', mediaURL: '', likes: 20, comments: [{ author: 'Alice', text: 'Absolutely agree!' }] },
    { id: '5', author: 'EdwardScissorhands', content: 'Creativity meets technology in our new update.', mediaURL: 'test.jpg', likes: 12, comments: [] }
  ];
  
  const postsToDisplay = posts.length ? posts : samplePosts;
  const adjectives = ["Innovative", "Dynamic", "Creative", "Global", "Pioneering", "Smart", "Revolutionary", "Agile", "Modern", "Prime"];
  const nouns = ["Solutions", "Technologies", "Industries", "Concepts", "Ventures", "Enterprises", "Systems", "Networks", "Strategies", "Corporation"];
  const trendingIdeas = Array.from({ length: 50 }, (_, i) => ({
    name: `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`,
    score: Math.floor(Math.random() * 100)
  })).sort((a, b) => b.score - a.score);

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      {/* Left Sidebar: Trending Ideas */}
      <aside style={{
        flex: "1",
        maxWidth: "250px", // increased from 200px to 250px
        backgroundColor: "var(--card-background-color)",
        padding: "10px",
        borderRadius: "8px"
      }}>
        <h3>Trending Ideas</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {trendingIdeas.map((idea, idx) => (
            <li key={idx} style={{ marginBottom: "5px", fontSize: "0.9rem" }}>
              {idea.name} - Score: {idea.score}
            </li>
          ))}
        </ul>
      </aside>
      {/* Main Feed Section */}
      <div style={{ flex: "2" }}>
        <h2 style={{ marginBottom: '15px' }}>
          <FaRss style={{ marginRight: '8px' }}/> Infinite Feed
        </h2>
        <p style={{ marginBottom: '20px' }}>
          Discover new ideas and engage with a thriving network of professionals.
        </p>
        {postsToDisplay.map(post => (
          <FeedPost key={post.id} post={post} />
        ))}
      </div>
      {/* Right Sidebar: Suggestions */}
      <aside style={{
        flex: "1",
        maxWidth: "250px", // increased from 200px to 250px
        backgroundColor: "var(--card-background-color)",
        padding: "10px",
        borderRadius: "8px"
      }}>
        <h3>Suggestions</h3>
        {/*
          Replace the static list with sample suggestions:
          Using the same sample suggestions from App.js.
        */}
        {[
          { id: "1", username: "AliceWonder", email: "alice@example.com", profilePic: "p1.jpg" },
          { id: "2", username: "BobBuilder", email: "bob@example.com", profilePic: "p1.jpg" },
          { id: "3", username: "CharlieChaplin", email: "charlie@example.com", profilePic: "p1.jpg" },
          { id: "4", username: "DianaPrince", email: "diana@example.com", profilePic: "p1.jpg" },
          { id: "5", username: "EdwardScissorhands", email: "edward@example.com", profilePic: "p1.jpg" }
        ].map(suggestion => (
          <div key={suggestion.id} className="suggestion-item" style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <img src={suggestion.profilePic} alt={suggestion.username} className="suggestion-img" style={{
              width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", marginRight: "10px"
            }} />
            <span>{suggestion.username}</span>
          </div>
        ))}
      </aside>
    </div>
  );
};

export default Feed;
