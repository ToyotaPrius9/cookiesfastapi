import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TodoAppContainer.css';

const TodoAppContainer = ({ user }) => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []); // Fetch todos when component mounts

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/todos/${user.uid}`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async (title, description) => {
    try {
      await axios.post('http://localhost:8000/todos', {
        title,
        description,
        uid: user.uid,
      });
      fetchTodos(); // Refresh todos after adding
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      await axios.delete(`http://localhost:8000/todos/${todoId}`);
      fetchTodos(); // Refresh todos after deleting
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div>
      <h1>Todo App</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <div>
              <h3>{todo.title}</h3>
              <p>{todo.description}</p>
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const title = e.target.elements.title.value;
          const description = e.target.elements.description.value;
          addTodo(title, description);
          e.target.reset();
        }}
      >
        <input type="text" name="title" placeholder="Todo Title" required />
        <textarea name="description" placeholder="Todo Description" required />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
};

export default TodoAppContainer;
