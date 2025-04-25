// app/dashboard/components/ColorPicker.tsx
"use client"
import { cn } from '@/app/lib/utils';

const colors = [
  '#fef08a', // amarelo
  '#bae6fd', // azul
  '#bbf7d0', // verde
  '#fecaca', // vermelho
  '#ddd6fe', // roxo
  '#fbcfe8'  // rosa
];

export default function ColorPicker({
  selectedColor,
  onSelect
}: {
  selectedColor: string;
  onSelect: (color: string) => void;
}) {
  return (
    <div className="mb-4">
      <p className="text-sm font-medium mb-2 text-[#8B5FD4]">Cor do PostIt:</p>
      <div className="flex gap-2">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onSelect(color)}
            className={cn(
              'w-8 h-8 rounded-xl transition-transform hover:scale-110',
              selectedColor === color && 'ring-2 ring-offset-2 ring-gray-400'
            )}
            style={{ backgroundColor: color }}
            aria-label={`Selecionar cor ${color}`}
          />
        ))}
      </div>
    </div>
  );
}