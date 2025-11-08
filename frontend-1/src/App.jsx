import React from 'react';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'

import doctorAuthCheck from './components/middleware/doctorauth';
import patientAuthCheck from './components/middleware/patientauth';

import LoginPage from './pages/login/Login';
import Signup from './pages/signup/Signup';
import PatientDash from './pages/dashboard/patient/patient';
import DoctorDash from './pages/dashboard/doctor/doctor';

const router = createBrowserRouter(createRoutesFromElements(
  <>
    <Route path='/' element={<h1>Welcome to HealthCare App</h1>}/>
    <Route path='/login' element={ <LoginPage/> } action={ LoginPage.action }/>
    <Route path='/signup' element={ <Signup/> } action={ Signup.action }/>
    <Route path='/doctor' element={ <DoctorDash/> } loader={ doctorAuthCheck }/>
    <Route path='/patient' element={ <PatientDash/> } loader={ patientAuthCheck }/>
  </>
));

const App = () => {
  return(
    <RouterProvider router={router}/>
  )
}

export default App;