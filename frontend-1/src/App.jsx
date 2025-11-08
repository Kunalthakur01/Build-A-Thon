import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import LoginPage from './pages/login/Login';
import Signup from './pages/signup/Signup';

const router = createBrowserRouter(createRoutesFromElements(
  <>
    <Route path='/' element={<LoginPage/>} action={LoginPage.action}/>
    {/* <Route path='/signup' element={<Signup/>}/> */}
  </>
));

const App = () => {
  return(
    <RouterProvider router={router}/>
  )
}

export default App;