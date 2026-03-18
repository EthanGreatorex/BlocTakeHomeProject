// Components
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Styles
import "./App.css";

// Pages
import Home from "./Pages/Home";
import PostPage from "./Pages/PostPage";
import UserPage from "./Pages/UserPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/user/:id" element={<UserPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
