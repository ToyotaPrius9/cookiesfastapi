import React from 'react';
import Login from './Login';
import Register from './Register';
import Reset from './Reset';
import TodoAppContainer from './TodoAppContainer'
import TodoApp from './TodoApp'
import Dashboard from './Dashboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/TodoApp" element={<TodoApp />} />
          <Route path="/TodoAppContainer" element={<TodoAppContainer />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;