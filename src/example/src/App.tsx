import React from 'react';
import axios from 'axios';
import { APIService } from './lib/APIService';
import { GetPosts } from './components/getPosts';
import { GetTodos } from './components/getTodos';

APIService._axios = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
})

const App: React.FC = () =>  (
  <>
    <GetPosts />
    <GetTodos />
  </>
);


export default App;
