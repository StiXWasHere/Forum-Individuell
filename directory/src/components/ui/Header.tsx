'use client'
import React from 'react'
import { useRouter } from 'next/navigation';

function header() {

  const router = useRouter()

  const token = sessionStorage.getItem('forum/token')

  const logout = () => {
    sessionStorage.removeItem('forum/token');
    location.reload()
  }

  return (
    <div className='header'>
        <div className="header-container">
            <div className="header-container-left">
                <h1 id='headerTitle' onClick={() => router.push('/')}>Threads</h1>
            </div>
            <div className="header-container-right">

                {token? (
                  <>
                    <button className='user-btn' onClick={logout}>Log out</button>
                  </>
                ): (                  
                  <>
                    <button className='user-btn' onClick={() => router.push('/signup')}>Sign up</button>
                    <button className='user-btn' onClick={() => router.push('/signin')}>Sign in</button>
                  </>
                )}

            </div>
        </div>

    </div>
  )
}

export default header