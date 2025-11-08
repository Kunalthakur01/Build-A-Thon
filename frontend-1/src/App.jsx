import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import LoginPage from './pages/login/Login';
import Signup from './pages/signup/Signup';

const router = createBrowserRouter(createRoutesFromElements(
  <>
    <Route path='/' element={<LoginPage/>} action={ LoginPage.action }/>
    <Route path='/signup' element={<Signup/>} action={ Signup.action }/>
    <Route path='/doctor' element={<h1>Doctor Dashboard</h1>}>
      <Route path='dashboard' element={<h1>Doctor Dashboard</h1>}/>
    </Route>
    <Route path='/patient' element={<h1>Patient Dashboard</h1>}>
      <Route path='dashboard' element={<h1>Patient Dashboard</h1>}/>
    </Route>
  </>
));

const App = () => {
  return(
    <RouterProvider router={router}/>
  )
}

export default App;