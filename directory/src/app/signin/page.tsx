'use client'
import React from 'react'
import bcrypt from 'bcryptjs'
import { useState } from 'react'
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';




function page() {

  const [registerUsername, setRegisterUsername] = useState<string>('')
  const [registerPassword, setRegisterPassword] = useState<string>('')
  const [statusMsg, setStatusMsg] = useState<string>('')

  const router = useRouter()

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterUsername(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    setRegisterPassword(value)
  }

  async function verifyPassword(inputPassword: string): Promise<string> {
    const oldStorage = localStorage.getItem('forum/users')
    let allUsers: User[] = []
  
    if (oldStorage !== null) {
      allUsers = JSON.parse(oldStorage)
    }
  
    const user = allUsers.find((user: User) => user.userName === registerUsername)
  
    if (!user) {
      return 'Username not found'
    }
  
    const storedHashedPassword = user.password
  
    try {
      const isMatch: boolean = await bcrypt.compare(inputPassword, storedHashedPassword)
      
      return isMatch ? 'Password is correct' : 'Password is incorrect'
    } catch (error) {
      console.error('Error verifying password:', error)
      return 'Error verifying password'
    }
  }

  const generateToken = (username: string): string => {
    const expiry = new Date()
    expiry.setHours(expiry.getHours() + 1)
    return btoa(`${username}:${expiry.toISOString()}`) // Base64 encode
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const result = await verifyPassword(registerPassword)
    setStatusMsg(result)

    if(result == 'Password is correct') {
      const token = generateToken(registerUsername)
      sessionStorage.setItem('forum/token', token)


      router.push('/')
    }
  }

  return (
<div className='signup'>
  <div className="signup-container">
    <div className="signup-container-top">
      <h3 id='signupTitle'>Sign in</h3>
      <form onSubmit={handleSubmit} id='signupForm'>
        <label htmlFor="signupUsername">Username</label>
        <input type="text" id='signupUsername' value={registerUsername} onChange={handleUsernameChange}/>
        <label htmlFor="signupPassword">Password</label>
        <input type="password" id='signupPassword' value={registerPassword} onChange={handlePasswordChange}/>
        <span>{statusMsg}</span>
        <div className="signup-form-btn">
          <button type='submit' id='signupBtn'>Sign in</button>
        </div>
        
      </form>
    </div>
    <div className="signup-container-bottom">
      
    </div>
  </div>
</div>
)
}

export default page