import DomainGenerator from "./components/DomainGenerator";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24 overflow-clip mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg w-full">
        <DomainGenerator />
      </div>
    </main>
  );
}
