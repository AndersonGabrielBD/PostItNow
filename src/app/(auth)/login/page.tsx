"use client"
import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider} from '@/app/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try { 
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center  text-[#8B5FD4]">Login</h1>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1  text-[#8B5FD4]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-[#8B5FD4] focus:ring-2 focus:ring-[#8B5FD4] focus:border-[#8B5FD4] outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-[#8B5FD4]">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-[#8B5FD4] focus:ring-2 focus:ring-[#8B5FD4] focus:border-[#8B5FD4] outline-none "
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={` w-full py-2 px-4 bg-[#8B5FD4] text-white rounded hover:bg-[#6A28D9] ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? 'Entrando...' : 'Entrar com Email'}
          </button>
        </form>

        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-gray-300 "></div>
          <span className="mx-2  text-[#8B5FD4]">ou</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="  text-[#8B5FD4] w-full py-2 px-4 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
        >
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            className="w-5 h-5 mr-2" 
          />
          Entrar com Google
        </button>

        <div className="mt-4 text-center">
          <Link href="/register" className="text-[#8B5FD4] hover:underline">
            Criar uma conta
          </Link>
        </div>
      </div>
    </div>
  );
}