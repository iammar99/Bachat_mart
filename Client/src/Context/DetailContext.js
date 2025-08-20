import React, { createContext, useContext, useState } from 'react'

const DetailContext = createContext()

export default function DetailContextProvider({ children }) {
    
    const [productDetail , setProductDetail] = useState({})
    
    return (
        <DetailContext.Provider value={{productDetail , setProductDetail}}>
            {children}
        </DetailContext.Provider>
    )
}


export const useDeatilContext = () => useContext(DetailContext)