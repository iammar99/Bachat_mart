import React, { createContext, useContext, useEffect, useState } from 'react'
import logo from "../Assets/default.png"

const ProfileImageContext = createContext()



export default function ProfileImageContextProvider({ children }) {

    const [profileImg, setProfileImg] = useState(null)


    const fetchData = async () => {
        const user = JSON.parse(localStorage.getItem("user"))
        if(!user){
            return
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/navImage/${user.id}`, {
                method: "GET",
                credentials: "include",
            })
            const result = await response.json()
            setProfileImg(result.img || logo)
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        fetchData()
    }, [])

    return (
        <ProfileImageContext.Provider value={{ profileImg, setProfileImg, fetchData }}>
            {children}
        </ProfileImageContext.Provider>
    )
}


export const useProfileImageContext = () => useContext(ProfileImageContext)