import React, { useEffect, useState } from 'react'
import logo from "../../Assets/logo.png"
import img from "../../Assets/default.png"
import { Link, NavLink } from 'react-router-dom'
import { useAuthContext } from 'Context/AuthContext'
import { message } from 'antd'
import { useProfileImageContext } from 'Context/ProfileImageContext'
import { useProfileContext } from 'Context/ProfileContext'

export default function TopNav() {
  const { isAuth, setIsAuth, user } = useAuthContext()
  const [isLoading, setIsLoading] = useState(false)
  const { profileImg, setProfileImg } = useProfileImageContext()
  const { setProfile } = useProfileContext()


  useEffect(() => {
    // setProfileImg(user.profile || "default.png")
  },[])

  const handleLogout = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const response = await fetch(`${process.env.REACT_APP_API_URL}/user/logout`, {
      method: "GET",
      credentials: "include"
    })
    const result = await response.json()
    if (result.success) {
      message.success(result.message)
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      setIsAuth(false)
      setIsAuth(false)
      setProfile({})
      setProfileImg(null)
    }
    else {
      message.error(result.message)
    }
    setIsLoading(false)
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#e2e8f0', padding: "0" }}>
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" href="#">
            <img src={logo} style={{ "width": "70px" }} alt="" />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {/* Center Navigation Links */}
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item mx-2">
                <NavLink
                  className={({ isActive }) => `nav-link px-0 ${isActive ? 'active' : ''}`}
                  to={"/"}
                >
                  Home
                </NavLink>
              </li>

              <li className="nav-item mx-2">
                <NavLink
                  className={({ isActive }) => `nav-link px-0 ${isActive ? 'active' : ''}`}
                  to={"/all-product"}
                >
                  All Products
                </NavLink>
              </li>
{/* 
              <li className="nav-item mx-2">
                <NavLink
                  className={({ isActive }) => `nav-link px-0 ${isActive ? 'active' : ''}`}
                  to={"/women"}
                >
                  Women
                </NavLink>
              </li>

              <li className="nav-item mx-2">
                <NavLink
                  className={({ isActive }) => `nav-link px-0 ${isActive ? 'active' : ''}`}
                  to={"/kid"}
                >
                  Kids
                </NavLink>
              </li> */}

              {user.role === "admin" && (
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) => `nav-link  me-4 ${isActive ? 'active' : ''}`}
                    to={"/dashboard/admin"}
                  >
                    Dashboard
                  </NavLink>
                </li>
              )}
            </ul>

            {/* Right Side Icons and Auth */}
            <div className="d-flex align-items-center">
              {/* Shopping Bag Icon */}
              {user.role !== "admin" && (
                <li className="nav-item">
                  <Link to={"/dashboard/cart"} className="btn btn-link text-muted p-2 me-3">
                    <i className="fas fa-shopping-bag fs-5"></i>
                  </Link>
                </li>
              )}

              {/* Auth Section */}
              {!isAuth ? (
                <Link className="btn btn-outline-success" to={'/auth/'}>
                  Login
                </Link>
              ) : (
                <div className="d-flex align-items-center">
                  {/* User Profile */}
                  <div className="me-3">
                    <Link to={"/dashboard/profile"}>
                      <img
                        src={`${user.profile == "default.png" ? img : profileImg}`}
                        alt="Profile"
                        className="rounded-circle"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      /></Link>
                  </div>

                  <button className="btn btn-outline-danger" onClick={handleLogout}>
                    {isLoading ? (
                      <div className="spinner-grow spinner-grow-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      "Logout"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}