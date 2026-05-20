import React, { useContext, useEffect, useState } from 'react'
import './LoginPopUp.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../context/StoreContext'
import axios from "axios"
import { toast } from 'react-toastify'

const LoginPopUp = ({ setShowLogIn }) => {
  const { url, setToken } = useContext(StoreContext)

  const [currState, setCurrState] = useState("Sign Up")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  })

  // Autofocus first input
  useEffect(() => {
    const firstInput = document.querySelector("input[name='email']")
    if (firstInput) firstInput.focus()
  }, [currState])

  const onChangeHandler = (event) => {
    const { name, value } = event.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  const validateInputs = () => {
    if (!data.email.includes("@")) {
      toast.error("Please enter a valid email address.")
      return false
    }
    if (data.password.length < 8) {
      toast.error("Password must be at least 8 characters long.")
      return false
    }
    if (currState === "Sign Up" && data.name.trim().length < 2) {
      toast.error("Please enter your full name.")
      return false
    }
    return true
  }

  const onLogin = async (event) => {
    event.preventDefault()

    if (!validateInputs()) return

    let newUrl = url
    if (currState === "Login") {
      newUrl += "api/user/login"
    } else {
      newUrl += "api/user/register"
    }

    const cleanedData = {
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password.trim(),
    }

    try {
      setLoading(true)
      const response = await axios.post(newUrl, cleanedData)

      if (response.data.success) {
        setToken(response.data.token)
        localStorage.setItem("token", response.data.token)
        toast.success(
          currState === "Login"
            ? "Welcome back!"
            : "Account created successfully 🎉"
        )
        setShowLogIn(false)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error("Error during login/signup:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogIn(false)}
            src={assets.cross_icon}
            alt="close"
          />
        </div>

        <div className="login-popup-inputs">
          {currState === "Login" ? null : (
            <input
              name='name'
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder='Your Name'
              required
            />
          )}

          <input
            name='email'
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder='Your Email'
            required
          />

          <div className="password-field">
            <input
              name='password'
              onChange={onChangeHandler}
              value={data.password}
              type={showPassword ? "text" : "password"}
              placeholder='Password'
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        <button type='submit' disabled={loading}>
          {loading
            ? "Please wait..."
            : currState === "Sign Up"
            ? "Create Account"
            : "Login"}
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>

        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  )
}

export default LoginPopUp
