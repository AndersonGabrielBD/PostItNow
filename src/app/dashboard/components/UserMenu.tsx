// app/dashboard/components/UserMenu.tsx
"use client"
import { auth } from '@/app/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function UserMenu() {
  const router = useRouter();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 rounded-full bg-[#8B5FD4] flex items-center justify-center text-white">
        {user?.email?.charAt(0).toUpperCase()}
      </div>
      <button
        onClick={handleLogout}
        className="text-sm text-gray-600 cursor-pointer hover:text-gray-900"
      >
        Sair
      </button>
    </div>
  );
}