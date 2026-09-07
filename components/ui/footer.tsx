// components/ui/footer.tsx
import { FaGithub } from 'react-icons/fa';

export function Footer() {
  return (
    <footer
      className="border-[#262b23] px-4 py-2 text-center font-mono text-[10px] uppercase tracking-[1px] text-[#6b7268]"
    >
      <p className="flex items-center justify-center gap-2">
        <span>© {new Date().getFullYear()}</span>
        <a
          href="https://github.com/ifrah-ashraf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#8a5f00] hover:text-[#ffb000] hover:underline"
        >
          Ifrah Ashraf
        </a>
        <span>·</span>
        <a
          href="https://github.com/ifrah-ashraf/blotter"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-[#d8dcd4] hover:underline"
        >
          <FaGithub className="inline-block text-[10px]" /> 
          source
        </a>
      </p>
    </footer>
  );
}