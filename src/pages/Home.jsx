import React, { useEffect } from "react";

/* components */
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "./Footer";
import BrowseCars from "../components/BrowseCars";
import { useAuth } from "../context/AuthContext";

const Home = () => {
   const { user } = useAuth();
  useEffect(()=>{
 console.log("user",user);
  },[])
  return (
    <div>
      <Navbar />
      {/*  <CarFilter/> */}
      <Hero />
      <BrowseCars />
      {/* <Cars /> */}
      <Footer />
    </div>
  );
};

export default Home;
