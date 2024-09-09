'use client'
import React from 'react'
import bcrypt from 'bcryptjs'
import { useState } from 'react'
import { Router, useRouter } from 'next/router'
import { redirect } from 'react-router-dom'


async function hashPassword(password: string): Promise<string | undefined> {
  const saltRounds = 10
  
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
  } catch (error) {
    console.error('Error hashing password:', error)
  }
}

async function storeUsername(username:string): Promise<void> {

  try {
    localStorage.setItem('username', username)
    console.log('Username stored')
  }
  catch(error) {
    console.error('Error setting username', error)
  }
  
}


function page() {

  const [registerUsername, setRegisterUsername] = useState<string>('')
  const [registerPassword, setRegisterPassword] = useState<string>('')
  const [protectedPassword, setProtectedPassword] = useState<string>('')
  const [statusMsg, setStatusMsg] = useState<string>('')

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterUsername(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterPassword(e.target.value)
    handlePasswordProtection()
  }

  const handlePasswordProtection = async () => {

    try {
      const hashedPassword = await hashPassword(registerPassword)
      if (hashedPassword) {
        setProtectedPassword(hashedPassword)
      }
    } catch (error) {
      console.error('Error hashing the password:', error)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const newSubject:User = {
        userName:registerUsername,
        userId:crypto.randomUUID(),
        password:protectedPassword,
      }

      const newSubjectString = JSON.stringify(newSubject)

      const oldStorage = localStorage.getItem('forum/users')
      let allUsers: User[] = []

      if(oldStorage !==  null){
       allUsers = JSON.parse(oldStorage)
      }

      if (registerUsername.trim() === "") return setStatusMsg('Please enter a username')
      if (protectedPassword.trim() === "") return setStatusMsg('Please enter a password')

      const usernameExists = allUsers.some((user: User) => user.userName === registerUsername)

      if (usernameExists) {
        setStatusMsg('Username is already taken. Please choose another one.')
        return
      }

      allUsers.push(newSubject)


       localStorage.setItem("forum/users", JSON.stringify(allUsers))

       console.log('New user saved')

      setStatusMsg('New user saved')
    } catch (error) {
      console.log('could not create new user',error)
      setStatusMsg('Something went wrong')
    }
  }

  return (
    <div className='signup'>
      <div className="signup-container">
        <div className="signup-container-top">
          <h3 id='signupTitle'>Sign up</h3>
          <form onSubmit={handleSubmit} id='signupForm'>
            <label htmlFor="signupUsername">Username</label>
            <input type="text" id='signupUsername' value={registerUsername} onChange={handleUsernameChange}/>
            <label htmlFor="signupPassword">Password</label>
            <input type="password" id='signupPassword' value={registerPassword} onChange={handlePasswordChange}/>
            <span>{statusMsg}</span>
            <div className="signup-form-btn">
              <button type='submit' id='signupBtn'>Sign up</button>
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

