import React, { useCallback, useState } from 'react';
import { PostApi } from '../APIs/Post';
import { DisplayResult } from './displayResults';

export const GetPosts: React.FC = () => {
  const [res, setRes] = useState('');

  const handlegetPosts = useCallback(async () => {
    const _res = await PostApi.getPosts();
    setRes(JSON.stringify(_res, null, 2))
  }, [])

  const handlegetPost = useCallback(async (id: number) => {
    const _res = await PostApi.getPost(id);
    setRes(JSON.stringify(_res, null, 2))
  }, [])

  const handleCreatePost = useCallback(async () => {
    const _res = await PostApi.createPost({
      title: 'create new blog with API Service Manager',
      body: 'Dummy code...',
      userId: 123,
    });
    setRes(JSON.stringify(_res, null, 2))
  }, [])

  const clearPost = useCallback(() => setRes(''),[])

  return (
    <>
      <div>
        <button onClick={handlegetPosts}>Get posts</button>
        <button onClick={handleCreatePost}>Create posts</button>
        <button onClick={() => handlegetPost(1)}>Get post specified (edit in code)</button>
        <button onClick={clearPost}>Clear posts</button>
      </div>
      <DisplayResult txt={res} />
    </>
  )
}