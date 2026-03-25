// Components
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Pages
import Home from "./Pages/Home";
import PostPage from "./Pages/PostPage";
import UserPage from "./Pages/UserPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/post/:id' element={<PostPage />} />
          <Route path='/user/:id' element={<UserPage />} />
          <Route
            path='*'
            element={<div style={{ color: "white" }}>Page not found</div>}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
