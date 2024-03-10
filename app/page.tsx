import DomainGenerator from "./components/DomainGenerator";
import { Heart } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24 overflow-clip mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg w-full">
        <div className="text-slate-500 justify-start w-full md:hidden">
          🌱 domainsprout.com
        </div>
        <DomainGenerator />
      </div>
      <div className="flex gap-1 text-slate-500">Made with <Heart className="p-[2px]" /> by <a href="https://www.mattbarty.com/projects" target="_blank" className='text-teal-500 font-semibold hover:text-teal-400 hover:underline underline-offset-2'>Matt Barty</a></div>
    </main>
  );
}
