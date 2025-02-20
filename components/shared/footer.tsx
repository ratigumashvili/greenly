import Link from "next/link"

export function Footer() {
    const dateCreated = 2024
    const currentDate = new Date().getFullYear()
    return (
        <footer className="h-[10vh] w-full max-w-7xl mx-auto flex flex-col items-center justify-center pr-4 pl-16 md:px-16 xl:px-4 border-t">
            <p className="text-xs">
                &copy; {Number(currentDate) > Number(dateCreated) ? `${dateCreated} - ${currentDate}` : currentDate}
            </p>
            <Link href={'https://iliauni.edu.ge/en/'} className="text-primary hover:text-primary/90 transition">Ilia State University</Link>
        </footer>
    )
}