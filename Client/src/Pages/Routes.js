import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'


import Header from 'Components/Header'
import Footer from 'Components/Footer'
import Frontend from './Frontend'
import Auth from './Auth'
import Dashboard from './Dashboard'
import PrivateRoute from './PrivateRoute'
import { useAuthContext } from 'Context/AuthContext'

export default function Index() {

  const { isAuth } = useAuthContext()

  return (
    <>
      <Routes>
        <Route path='/*' element={<Frontend />} />
        <Route path='/dashboard/*' element={<PrivateRoute Component={Dashboard} />} />
        <Route path='/auth/*' element={isAuth ? <Navigate to={"/"} /> : <Auth />} />
      </Routes>
    </>
  )
}
