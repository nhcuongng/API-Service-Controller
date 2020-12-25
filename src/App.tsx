import React, { useEffect } from 'react';
import { APIService } from './API/APIService';
import { GetPosts } from './components/getPosts';
import { GetTodos } from './components/getTodos';

const App: React.FC = () => {

  useEffect(() => {
    // set urlBase cho APIService
    APIService.urlBase = 'https://jsonplaceholder.typicode.com';
  }, [])

  return (
    <div>
      <GetPosts />
      <GetTodos />
    </div>
  );
}

export default App;
