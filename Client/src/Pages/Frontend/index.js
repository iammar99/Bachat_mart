import React from 'react'
import Home from './Home'
import { Route, Routes } from 'react-router-dom'
import Header from 'Components/Header'
import Footer from 'Components/Footer'
import ProductDetail from './ProductDetail'
import AllProducts from './AllProducts'

export default function Frontend() {
    return (
        <>
            <Header />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/all-product' element={<AllProducts />} />
                <Route path='/products-detail' element={<ProductDetail/>}/>
            </Routes>
            <Footer />
        </>
    )
}
