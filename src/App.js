import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postResponse = await fetch('https://dummyjson.com/posts');
        const postData = await postResponse.json();
        const first10Posts = postData.posts.slice(0, 10);
        setPosts(first10Posts);

        const userPromises = first10Posts.map((post) =>
          fetch(`https://dummyjson.com/users/${post.userId}`)
        );
        const userResponses = await Promise.all(userPromises);

        const userData = {};
        for (let i = 0; i < userResponses.length; i++) {
          const user = await userResponses[i].json();
          const userId = first10Posts[i].userId;
          userData[userId] = {
            firstName: user.firstName,
            lastName: user.lastName,
          };
        }
        setUsers(userData);
      } catch (error) {
        console.error('Error fetching posts or users:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Container>
      <PostGrid>
        {posts.map((post) => (
          <PostCard key={post.id}>
            <PostTitle>{post.title}</PostTitle>
            {users[post.userId] && (
              <PostAuthor>
                {users[post.userId].firstName} {users[post.userId].lastName}
              </PostAuthor>
            )}
          </PostCard>
        ))}
      </PostGrid>
    </Container>
  );
};

export default App;

const Container = styled.div`
  padding: 20px;
`;

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`;

const PostCard = styled.div`
  background-color: #f8f8f8;
  padding: 23px;
  border-radius: 10px;
  box-shadow: 10px 10px lightblue;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 15px 15px lightblue; 
  }
`;

const PostTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 13px;
`;

const PostAuthor = styled.p`
  font-size: 17px;
  color: #555;
  font-weight: bold; 
  transition: color; 

  &:hover {
    color: #007bff;

`;
