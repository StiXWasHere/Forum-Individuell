import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Thread = {
  id: string;
  category: string;
  title: string;
  description: string;
  creationDate: string;
};

const LandingPage: React.FC = () => {
  const router = useRouter();
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    function getData() {
      const keys = Object.keys(localStorage);
      let threads = JSON.parse(localStorage.getItem("forum/threads")|| "[]" ) || []
      if(!Array.isArray(threads)){
        threads = []
      }
      console.log("getting threads", threads) 
      setThreads(threads);
      console.log(threads);
    }
    getData();
  }, []);

  const handleNavigation = (id: string) => {
    router.push('/thread/' + id);
  };

  return (
    <div>
      <div className='thread-home'>
        <div className='thread-container-home'>
          <div className="thread-btn-container">
            <button className='Create-Thread-Btn' onClick={() => router.push('/create')}>Create Thread</button>
          </div>
          <div className="thread-container-top-home">
            {threads.map((thread, index) => (
              <div onClick={() => handleNavigation(thread.id)} className='threadbox' key={`${thread.id}-${index}`}>
                <div className="threadbox-top">
                  <div className="threadbox-top-left">
                    <span className='d-thread-poster'>Peter</span>
                    <h2 className='threadbox-title'>{thread.title}</h2>
                  </div>
                  <div className="threadbox-top-right">
                    <span>{thread.category}</span>
                  </div>

                </div>
                <div className="threadbox-center">
                  <p>{thread.description}</p>
                </div>
                <div className="threadbox-bottom">
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