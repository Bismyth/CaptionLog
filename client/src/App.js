import React,{useState,useEffect} from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [data,setData] = useState({});
  const [loaded, isLoaded] = useState(false);
  useEffect(() => {
      const fetchUser = async () => {
          const res = await axios({
              method: 'GET',
              url: '/express_backend',
          });
          setData(res.data);
          isLoaded(true);
      }
      fetchUser();
  },[]);
  return (
    loaded
    ? <div>{data.express}</div>
    : <div>LOADING</div>
  );
}

export default App;
