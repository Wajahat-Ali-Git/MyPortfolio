
const Home = () => {
    return (
        <header className="min-h-[90vh] flex flex-col bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-black">
            <nav className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
                <div className="text-lg font-semibold">Portfolio</div>
                <div className="hidden md:flex gap-6 text-sm text-gray-700 dark:text-gray-300">
                    <a href="#about">About</a>
                    <a href="#projects">Projects</a>
                    <a href="#contact">Contact</a>
                </div>
                <button className="md:hidden px-3 py-2 rounded bg-gray-100 dark:bg-gray-800">Menu</button>
            </nav>

            <main className="max-w-7xl mx-auto flex-1 w-full px-6 flex items-center">
                <section className="w-full md:w-3/4 lg:w-1/2 py-12">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                        Hi, I'm John Doe.
                        <span className="text-indigo-600 block">I build reliable web applications.</span>
                    </h1>
                    <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300">
                        I'm a software engineer specializing in full-stack development — React, Next.js, Node.js, and scalable APIs. I enjoy turning ideas into fast, accessible products.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <a href="#contact" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Get in touch</a>
                        <a href="#projects" className="inline-block px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100">See projects</a>
                    </div>
                </section>
            </main>
        </header>
    )
}
export default Home;