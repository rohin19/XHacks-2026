import { Moon, Sun } from 'lucide-react';

interface DarkModeToggleProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

export function DarkModeToggle({ isDarkMode, setIsDarkMode }: DarkModeToggleProps) {
  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className="w-12 h-12 rounded-full bg-white border-2 border-[#E1E8ED] shadow-lg flex items-center justify-center hover:bg-[#F8FAFC] transition-all"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? (
        <Sun size={20} className="text-[#F59E0B]" />
      ) : (
        <Moon size={20} className="text-[#1E3A8A]" />
      )}
    </button>
  );
}