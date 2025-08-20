import React, { createContext, useContext, useState } from 'react'

const CheckoutConntext = createContext()

export default function CheckOutContextProvider({children}) {
  
    const [checkoutPrice , setCheckoutPrice] = useState(0)
  
    return (
    <CheckoutConntext.Provider value={{checkoutPrice , setCheckoutPrice}}>
        {children}
    </CheckoutConntext.Provider>
  )
}


export const useCheckoutContext = () => useContext(CheckoutConntext)