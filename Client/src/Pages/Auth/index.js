import React from 'react'
import Login from './Login'
import Register from './Register'
import { Routes, Route } from 'react-router-dom'

export default function Auth() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    )
}
