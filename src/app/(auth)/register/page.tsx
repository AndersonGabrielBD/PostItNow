"use client"
import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/app/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState({
    email: false,
    google: false
  });
  const router = useRouter();

  // Registro com Email/Senha
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading({...loading, email: true});
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading({...loading, email: false});
    }
  };

  // Registro com Google
  const handleGoogleRegister = async () => {
    setLoading({...loading, google: true});
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading({...loading, google: false});
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-[#8B5FD4]">Criar Conta</h1>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailRegister} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-[#8B5FD4]">Email</label>
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
              className="w-full p-2 border border-gray-300 rounded text-[#8B5FD4] focus:ring-2 focus:ring-[#8B5FD4] focus:border-[#8B5FD4] outline-none"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-[#8B5FD4]">Confirmar Senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-[#8B5FD4] focus:ring-2 focus:ring-[#8B5FD4] focus:border-[#8B5FD4] outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading.email}
            className={`w-full py-2 px-4 bg-[#8B5FD4] text-white rounded hover:bg-[#6A28D9] transition-colors ${loading.email ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading.email ? 'Criando conta...' : 'Registrar com Email'}
          </button>
        </form>

        {/* Divisor */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-white text-sm text-[#8B5FD4]">OU</span>
          </div>
        </div>

        {/* Botão do Google */}
        <button
          onClick={handleGoogleRegister}
          disabled={loading.google}
          className={`w-full py-2 px-4 bg-white border border-[#8B5FD4] text-[#8B5FD4] rounded flex items-center justify-center hover:bg-blue-50 transition-colors ${loading.google ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            className="w-5 h-5 mr-2" 
          />
          {loading.google ? 'Registrando...' : 'Registrar com Google'}
        </button>

        <div className="mt-6 text-center text-sm">
          <span className="text-[#8B5FD4]">Já tem uma conta? </span>
          <Link href="/login" className="text-[#8B5FD4] hover:underline font-medium">
            Faça login aqui
          </Link>
        </div>
      </div>
    </div>
  );
}