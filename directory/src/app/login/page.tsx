'use client'
import React from 'react'
import bcrypt from 'bcryptjs'
import { useState } from 'react'


function page() {

  const [registerUsername, setRegisterUsername] = useState<string>('')
  const [registerPassword, setRegisterPassword] = useState<string>('')
  const [statusMsg, setStatusMsg] = useState<string>('')

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterUsername(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim(); // Ensure no extra spaces
    setRegisterPassword(value);
  }

  async function verifyPassword(inputPassword: string): Promise<string> {
    const oldStorage = localStorage.getItem('forum/users');
    let allUsers: User[] = [];
  
    // Parse users from local storage
    if (oldStorage !== null) {
      allUsers = JSON.parse(oldStorage);
    }
  
    // Find the user with the matching username
    const user = allUsers.find((user: User) => user.userName === registerUsername);
  
    // If user is not found, return an error message
    if (!user) {
      return 'Username not found';
    }
  
    const storedHashedPassword = user.password; // Retrieve the hashed password for the found user
  
    try {
      // Compare the input password with the stored hashed password
      const isMatch: boolean = await bcrypt.compare(inputPassword, storedHashedPassword);
      
      return isMatch ? 'Password is correct' : 'Password is incorrect';
    } catch (error) {
      console.error('Error verifying password:', error);
      return 'Error verifying password';
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const result = await verifyPassword(registerPassword)
    setStatusMsg(result)
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