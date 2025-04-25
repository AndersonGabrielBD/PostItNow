"use client"
import { auth } from '@/app/lib/firebase';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import AddNoteForm from './components/AddNoteForm';
import NotesBoard from './components/NotesBoard';
import UserMenu from './components/UserMenu';
import Image from 'next/image';
import Logo from '../../imgs/logo (2).png'

export default function Dashboard() {
  useEffect(() => {
    if (!auth.currentUser) {
      redirect('/login');
    }
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <header className="flex justify-between items-center h-20 relative">
        <div className="w-[40px]"></div>
        
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Image 
            src={Logo} 
            alt="Logo do aplicativo" 
            className="mx-auto" 
          />
        </div>
        
      
        <UserMenu />
      </header>
      
      <AddNoteForm />
      <NotesBoard />
    </div>
  );
}