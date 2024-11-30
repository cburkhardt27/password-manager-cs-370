import { useState, useEffect } from 'react'
// Figure out how to call this outside.
export default function StrengthCheck() {
    // Password security strength meter.
  const [password, setPassword] = useState('')
  const [strength, setStrength] = useState(0)
  const [recommend, setRecommend] = useState('Recommendations')

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
    checkStrength(event.target.value)
    checkRecommend(event.target.value)
    // handleChange(event) // New version here?
  }

  const checkLength = (password) => password.length >= 8
  const checkUppercase = (password) => /[A-Z]/.test(password)
  const checkLowercase = (password) => /[a-z]/.test(password)
  const checkNumbers = (password) => /\d/.test(password)
  const checkSpecialChars = (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password)

  const checkStrength = (password) => {
    let s = 0
    if (checkLength(password)) s += 1
    if (checkUppercase(password)) s += 1
    if (checkLowercase(password)) s += 1
    if (checkNumbers(password)) s += 1
    if (checkSpecialChars(password)) s += 1
    setStrength(s / 6)
  };

  const checkRecommend = (password) => {
    if (!checkLength(password)) setRecommend('At least 8 characters')
    else if (!checkUppercase(password)) setRecommend('Add uppercase')
    else if (!checkLowercase(password)) setRecommend('Add lowercase')
    else if (!checkNumbers(password)) setRecommend('Add numbers')
    else if (!checkSpecialChars(password)) setRecommend('Add special characters')
    else setRecommend('Secure!')
  }
}