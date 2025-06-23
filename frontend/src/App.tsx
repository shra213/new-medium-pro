import React from "react";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import AuthLayout from "./Authlayoiut";
import MyPosts from "./components/myPosts";
import Blog from "./pages/Blog";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Blogs from "./pages/Blogs";
import CreatePost from "./pages/CreatePost";
import Layout from "./components/Layout";
function App() {
  return (
    <BrowserRouter>
      {/* <Routes> */}
      {/* <Route path="/signup" element={<Signup/>}/>
        <Route path="/signin" element={<Signin/>} /> */}
      <AnimatedRoutes />
      {/* </Routes> */}
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Blogs />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/myPosts" element={<MyPosts />} />
          {/* <Route path="/post/update" element={<} */}
        </Route>
        <Route path="/create" element={<CreatePost />} />
      </Routes>
    </BrowserRouter>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </AnimatePresence>
  );
}
export default App;
