import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-5xl font-extrabold text-zinc-900 dark:text-white sm:text-6xl">
          Welcome to{" "}
          <span className="text-blue-600 dark:text-blue-400">SDS Final Project</span>
        </h1>

        <div className="mt-10 flex w-full max-w-2xl flex-col items-center sm:items-start">
          <p className="mb-6 text-lg text-zinc-700 dark:text-zinc-300">
            This is the web application for the SDS Final Project. Explore the features and enjoy the experience!
          </p>
        </div>
      </main>
    </div>
  );
}
