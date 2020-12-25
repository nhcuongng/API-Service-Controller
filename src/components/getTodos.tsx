import React, { useCallback, useState } from 'react';
import { Todo } from '../API/Todo';
import { DisplayResult } from './displayResults';

export const GetTodos: React.FC = () => {
  const [res, setRes] = useState('');

  const handleGetTodos = useCallback(async () => {
    const _res = await Todo.getTodos();
    setRes(JSON.stringify(_res, null, 2))
  }, [])

  const clearTodos = useCallback(() => setRes(''),[])

  return (
    <>
      <div>
        <button onClick={handleGetTodos}>Get todos</button>
        <button onClick={clearTodos}>Clear todos</button>
      </div>
      <DisplayResult txt={res} />
    </>
  )
}