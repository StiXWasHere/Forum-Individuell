'use client'
import React from 'react';
import LandingPage from './components/Page';
import Header from '@/components/ui/Header';

const App: React.FC = () => {
  return (
    <main>
      <div>
        <Header/>
      <LandingPage />
      </div>
    </main>
  );
};

export default App;