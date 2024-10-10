import { Route, Routes } from "react-router-dom"

import Layout from "./pages/outlet/layout"
import MainPage from "./pages/MainPage"


function App() {

  return (
    <>
      <Routes>
          <Route element={<Layout/>}> 
            <Route path='/' element={<MainPage/>}></Route>
          </Route>
      </Routes>
    </>
  )
}

export default App
