import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuthContext } from './AuthContext'
import { message } from 'antd'

const ProfileContext = createContext()

export default function ProfileContextProvider({ children }) {



    const [profile, setProfile] = useState({})
    const fetchData = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile/${id}`, {
                method: "GET",
                header: {
                    "Content-Type": "aplication/json"
                },
                credentials: "include",
            })

            const result = await response.json()
            if(result.success){
                setProfile(result.data)
            }
            else{
                console.error("error While loading profile")
            }
        } catch (error) {
            console.error(error)

        }
    }

    useEffect(() => {
        var userFound = JSON.parse(localStorage.getItem("user"))
        if (userFound) {
            setTimeout(()=>{
                fetchData(userFound.id)
            },500)
        }
    }, [])
    return (
        <ProfileContext.Provider value={{ profile, setProfile, fetchData }}>
            {children}
        </ProfileContext.Provider>
    )
}


export const useProfileContext = () => useContext(ProfileContext)