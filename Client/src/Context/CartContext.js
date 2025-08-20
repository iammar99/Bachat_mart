import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuthContext } from './AuthContext'

const CartContext = createContext()

export default function CartContextProvider({ children }) {
    const [cart, setCart] = useState([])
    const { user } = useAuthContext()

    const fetchData = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/product/cart/get/${user.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
        })
        const result = await response.json()
        setCart(result.data || [])
    }

    useEffect(() => {
        if (user) { 
            fetchData()
        }
    }, [user]) 


    return (
        <CartContext.Provider value={{ cart, setCart }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCartContext = () => useContext(CartContext)
