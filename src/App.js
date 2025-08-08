import React from 'react'
import axios from 'axios'
import MainRoutes from './routes';
import { Components } from './components'
import { useLocation, useNavigate } from 'react-router-dom';

axios.defaults.baseURL = 'http://127.0.0.1:8000/api';

function App() {
  const path = useLocation().pathname

  const navigate = useNavigate();
  React.useEffect(() => {
    if(path !== '/login'){
      const token = localStorage.getItem('token')
      if(!token){
        navigate('/login')
      }
    }
  }, [path]);
  return (
    <div>
      <MainRoutes />
      <Components.Footer />
    </div>
  )
}

export default App