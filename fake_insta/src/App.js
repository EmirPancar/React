import { useEffect } from 'react';
import './App.css';
import axios from 'axios'
import Header from './Header';

// const URL = "https://jsonplaceholder.typicode.com"
// const UserId = 2

function App() {

  // const getAllUsers = async ()=>{
  //   const response = await axios.get(`${URL}/posts`)
  //   console.log(response.data)
  // }

  // const getPostByUserId = async (userId) => {
  //   const response = await axios.get(`${URL}/posts?userId=${UserId}`)
  //   console.log(response.data)
  // }

  // useEffect(()=>{
  //   getAllUsers();
  //   getPostByUserId(UserId)
  // },[])

  return (
    <>
      <Header/>


    </>

  );
}

export default App;
