// app/dashboard/components/AddNoteForm.tsx
"use client"
import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '@/app/lib/firebase';
import ColorPicker from './ColorPicker';

export default function AddNoteForm() {
  const [text, setText] = useState('');
  const [color, setColor] = useState('#fef08a');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !auth.currentUser?.uid) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'users', auth.currentUser.uid, 'notes'), {
        text,
        color,
        x: Math.floor(Math.random() * 500),
        y: Math.floor(Math.random() * 300),
        createdAt: new Date()
      });
      setText('');
    } catch (error) {
      console.error("Erro ao criar nota:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg shadow">
  
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-3 border placeholder-[#8B5FD4] text-black border-gray-300 rounded mb-4 focus:ring-2 focus:ring-[#8B5FD4] focus:border-transparent"
        placeholder="Digite o texto do seu post-It"
        rows={3}
        required
      />
      
      <ColorPicker selectedColor={color} onSelect={setColor} />
      
      <button
        type="submit"
        disabled={isSubmitting}
        className={`mt-4 px-6 py-2 bg-[#8B5FD4] text-white cursor-pointer rounded-lg hover:bg-[#6A28D9] transition-colors ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Criando...' : 'Criar Nota'}
      </button>
    </form>
  );
}