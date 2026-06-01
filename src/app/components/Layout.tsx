import React from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';

export function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F6FA] font-['DM_Sans',sans-serif]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto py-4 pr-4">
        <div className="min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
