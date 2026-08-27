import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Disclaimer } from './Disclaimer';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9EE] text-[#26332D]">
      <Header />
      
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        
        <main className="flex-1 px-4 sm:px-8 py-6 pb-28 sm:pb-12 max-w-4xl w-full mx-auto">
          <Outlet />
          <Disclaimer />
        </main>
      </div>

      <BottomNav />
    </div>
  );
};
