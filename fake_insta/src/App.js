import { useEffect } from 'react';
import './App.css';
import axios from 'axios'
import Header from './Header';
import Slider from './Slider'
import Catalog from './Catalog';

// const URL = "https://fakestoreapi.com"
// const UserId = 2

function App() {

  // const getAllUsers = async ()=>{
  //   const response = await axios.get(`${URL}/products`)
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
      <Slider/>
      <Catalog/>
    </>

  );
}

export default App;
