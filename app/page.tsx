import DomainGenerator from "./components/DomainGenerator";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24 overflow-clip">
      <DomainGenerator />
    </main>
  );
}
