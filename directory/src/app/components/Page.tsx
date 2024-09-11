import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Thread = {
  id: string;
  category: string;
  title: string;
  description: string;
  creationDate: string;
  creator: User;
  status: boolean;
};

const LandingPage: React.FC = () => {
  const router = useRouter();
  const [threads, setThreads] = useState<Thread[]>([]);

  const token = sessionStorage.getItem('forum/token')

  useEffect(() => {
    function getData() {
      const keys = Object.keys(localStorage);
      let threads = JSON.parse(localStorage.getItem("forum/threads")|| "[]" ) || []
      if(!Array.isArray(threads)){
        threads = []
      }
      console.log("getting threads", threads) 
      setThreads(threads);
    }
    getData();
  }, []);

  const updateThreadStatus = (id: string, status: boolean) => {

    if(!token) {
      return
    }
    const updatedThreads = threads.map((thread) =>
      thread.id === id ? { ...thread, status } : thread
    );

    setThreads(updatedThreads);
    localStorage.setItem("forum/threads", JSON.stringify(updatedThreads));
  };

  const handleLock = (e: React.MouseEvent<HTMLElement>, id: string) => {
    e.stopPropagation()
    updateThreadStatus(id, true);
  }
  const handleUnlock = (e: React.MouseEvent<HTMLElement>, id: string) => {
    e.stopPropagation()
    updateThreadStatus(id, false);
  }

  const handleNavigation = (id: string, status: boolean) => {
    if (!status) {
      router.push("/thread/" + id);
    }
  };

  return (
    <div>
      <div className='thread-home'>
        <div className='thread-container-home'>
          <div className="thread-btn-container">
            {token && (
              <button className='Create-Thread-Btn' onClick={() => router.push('/create')}>Create Thread</button>
            )} 
          </div>
          <div className="thread-container-top-home">
            {threads.map((thread, index) => (
              <div onClick={() => handleNavigation(thread.id, thread.status)} className='threadbox' key={`${thread.id}-${index}`}>
                <div className="threadbox-top">
                  <div className="threadbox-top-left">
                    <span className='d-thread-poster'>{thread.creator.userName}</span>
                    <h2 className='threadbox-title'>{thread.title}</h2>
                  </div>
                  <div className="threadbox-top-right">
                    {thread.status == true && (
                      <span id='threadLockedText'>Locked</span>
                    )}
                    <span>{thread.category}</span>
                  </div>

                </div>
                <div className="threadbox-center">
                  <p>{thread.description}</p>
                </div>
                <div className="threadbox-bottom">
                  {token && (
                  thread.status? (
                    <button id='btnUnlock' className='threadbox-lock-btn' onClick={(e) => handleUnlock(e, thread.id)}>Unlock thread</button>
                  ): (
                    <button id='btnLock' className='threadbox-lock-btn' onClick={(e) => handleLock(e, thread.id)}>Lock thread</button>
                  )
                  )}
                  <ul className='CreationDate'>
                    <li className='Date'>{new Date(thread.creationDate).toLocaleDateString()}</li>
                    <li className='Time'>{new Date(thread.creationDate).toLocaleTimeString()}</li>
                  </ul>
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;