"use client"
import { useState, useEffect, useRef } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  MouseSensor, 
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter
} from '@dnd-kit/core';
import { 
  SortableContext,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { db, auth } from '@/app/lib/firebase';
import { doc, setDoc, collection, onSnapshot, deleteDoc } from 'firebase/firestore';
import { CircleX } from 'lucide-react';

type NoteType = {
  id: string;
  text: string;
  color: string;
  x: number;
  y: number;
  createdAt: number;
};

function SortableNote({ 
  id, 
  text, 
  color,
  x,
  y,
  onDelete
}: {
  id: string;
  text: string;
  color: string;
  x: number;
  y: number;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: 'absolute' as const,
    left: `${x}px`,
    top: `${y}px`,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: color,
    zIndex: isDragging ? 1 : 0,
    width: '200px', // Tamanho fixo de 200px
    height: '200px', // Altura fixa de 200px
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-4 shadow-lg rounded-lg cursor-move flex flex-col text-gray-800"
      {...attributes}
      {...listeners}
    >
      <div className="flex justify-end">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="text-xs text-red-600 px-2 py-1 rounded cursor-pointer"
        >
          <CircleX />
        </button>
      </div>
      <div className="flex-1 overflow-auto break-words mt-2 text-sm">
        {text}
      </div>
    </div>
  );
}

const NotesBoard = () => {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [user, setUser] = useState(auth.currentUser);
  const containerRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = onSnapshot(
      collection(db, 'users', user.uid, 'notes'),
      (snapshot) => {
        const notesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as NoteType[];
        
        // Organiza as notas em grid com largura mínima de 200px
        const organizedNotes = notesData.map((note, index) => {
          if (note.x && note.y) return note;
          
          const notesPerRow = Math.floor(window.innerWidth / 100); // 200px + 20px de margem
          const row = Math.floor(index / notesPerRow);
          const col = index % notesPerRow;
          
          return {
            ...note,
            x: 20 + col * 100, // 200px + 20px de espaçamento
            y: 20 + row * 100  // 200px + 20px de espaçamento
          };
        });
        
        setNotes(organizedNotes);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const getContainerBounds = () => {
    if (!containerRef.current) return { width: 0, height: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height
    };
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, delta } = event;
    
    if (!user?.uid) return;

    const noteId = active.id.toString();
    const note = notes.find(n => n.id === noteId);
    
    if (!note) return;

    const container = getContainerBounds();
    const noteWidth = 200; // Largura fixa
    const noteHeight = 200; // Altura fixa

    let newX = Math.max(0, Math.min(note.x + delta.x, container.width - noteWidth));
    let newY = Math.max(0, Math.min(note.y + delta.y, container.height - noteHeight));

    await setDoc(doc(db, 'users', user.uid, 'notes', noteId), {
      x: newX,
      y: newY
    }, { merge: true });
  };

  const handleDeleteNote = async (id: string) => {
    if (!user?.uid) return;
    if (confirm('Tem certeza que deseja excluir esta nota?')) {
      await deleteDoc(doc(db, 'users', user.uid, 'notes', id));
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[70vh] overflow-auto border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50"
      style={{
        minHeight: '4000px',
        minWidth: '200px'
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={notes.map(note => note.id)}
          strategy={rectSortingStrategy}
        >
          {notes.map((note) => (
            <SortableNote
              key={note.id}
              id={note.id}
              text={note.text}
              color={note.color}
              x={note.x || 20}
              y={note.y || 20}
              onDelete={handleDeleteNote}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default NotesBoard;