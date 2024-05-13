import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Cookies from 'js-cookie';

function Dashboard() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user name from backend when component mounts
    fetchUserName();
  }, []);

  const fetchUserName = async () => {
    try {
      const token = Cookies.get('token'); // Retrieve token from cookie
      const response = await fetch(`http://localhost:8000/user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'  // Include credentials for cross-origin requests
      });

      if (response.ok) {
        const userData = await response.json();
        setUsername(userData.username);
      } else {
        console.error('Failed to fetch user data:', response.status);
        alert('An error occurred while fetching user data');
        navigate('/'); // Redirect to login page on error or unauthorized access
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      alert('An error occurred while fetching user data');
      navigate('/'); // Redirect to login page on error
    }
  };

  const handleLogout = async () => {
    try {
      const token = Cookies.get('token'); // Retrieve token from cookie
      const response = await fetch(`http://localhost:8000/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'  // Include credentials for cross-origin requests
      });

      if (response.ok) {
        // Clear local state
        setUsername('');
        // Remove token cookie
        Cookies.remove('token');
        navigate('/');
      } else {
        console.error('Logout failed');
        alert('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('An error occurred during logout');
    }
  };

  const goToTodoContainer = () => {
    navigate('/TodoApp');
  };

  const displayToken = () => {
    const token = Cookies.get('token'); // Retrieve token from cookie
    alert(`Token: ${token}`);
  };

  return (
    <div className="dashboard">
      <div className="dashboard__container">
        <div>
          {/* Display user information */}
          Logged in as: {username}
        </div>
        <button className="dashboard__btn" onClick={handleLogout}>
          Logout
        </button>
        <button className="dashboard__btn" onClick={displayToken}>
          Display Token
        </button>
        <button className="dashboard__btn" onClick={goToTodoContainer}>
          Go to Todo App
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
