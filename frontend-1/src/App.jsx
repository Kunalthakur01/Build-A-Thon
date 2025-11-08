import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>
  },
  {
    path: "/signup",
    element: <Signup/>
  }
])

const App = () => {
  return(
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App;