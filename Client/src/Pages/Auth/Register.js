import { message } from 'antd'
import { useAuthContext } from 'Context/AuthContext'
import { useProfileContext } from 'Context/ProfileContext'
import { useProfileImageContext } from 'Context/ProfileImageContext'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Register() {

  // -------------- Auth Context --------------
  const { isAuth, setIsAuth, user, setUser } = useAuthContext()
  // -------------- Profile Image  Context --------------
const { fetchData } = useProfileImageContext();
const { fetchData: fetchProfileData } = useProfileContext();

  // -------------- State --------------
  const [state, setState] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // -------------- Handle Change --------------
  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  // -------------- Handle Register --------------
  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const { email, username, password, cPassword } = state

      if (!email || !username || !password || !cPassword) {
        message.error("Please fill all inputs")
        return
      }

      if (password !== cPassword) {
        message.error("Passwords don't match")
        return
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(state)
      })

      const result = await response.json()

      if (result.success) {
        message.success(result.message)

        const userData = {
          email,
          username,
          id: result.user._id,
          role: result.user.role,
          profile: result.profileImg
        }
        setIsAuth(true)
        setUser(userData)
        localStorage.setItem("token", "true")
        localStorage.setItem("user", JSON.stringify(userData))
        fetchData()
        fetchProfileData(userData.id)

      } else {
        message.error(result.message)
      }
    } catch (error) {
      message.error("Something went wrong, please try again later.")
      console.error("Registration error:", error)
    }
    finally {
      setState({})
      document.getElementsByName("email")[0].value = ""
      document.getElementsByName("username")[0].value = ""
      document.getElementsByName("password")[0].value = ""
      document.getElementsByName("cPassword")[0].value = ""
      setIsLoading(false)
    }
  }


  return (
    <main className='form-body'>
      <h1 className="text-center text-dark mt-2 mb-0" style={{ "fontSize": "70px", "fontWeight": "800" }}>
        Register
      </h1>
      <form className='auth-form'>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            name='email'
            onChange={handleChange}
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            name='username'
            onChange={handleChange}
            type="text"
            className="form-control"
            id="username"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            name='password'
            onChange={handleChange}
            type="password"
            className="form-control"
            id="exampleInputPassword1"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPasssword" className="form-label">
            Confirm Password
          </label>
          <input
            name='cPassword'
            onChange={handleChange}
            type="password"
            className="form-control"
            id="confirmPasssword"
          />
        </div>
        <div className="d-flex justify-content-between align-items-md-center align-items-baseline flex-md-row flex-column">
          <button type="submit" className="form-btn register-btn" onClick={handleRegister}>
            {
              !isLoading
                ?
                "Register"
                :
                <div className="spinner-grow" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
            }
          </button>
          <Link to={"/auth"}>
            Already have an Account ! Log in
          </Link>
        </div>
      </form>

    </main>
  )
}
