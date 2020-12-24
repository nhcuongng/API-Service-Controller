import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { APIService } from './API/APIService';
import { ApiResponse, ApiArticleResponse, ApiRequestAuthor } from './types';
import { APIResult, Endpoints } from "./constants";
import { GetPosts } from './components/getPosts';
import { GetTodos } from './components/getTodos';

const App: React.FC = () => {

  useEffect(() => {
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
