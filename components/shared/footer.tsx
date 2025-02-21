import Image from "next/image"
import Link from "next/link"

export function Footer() {
    const dateCreated = 2024
    const currentDate = new Date().getFullYear()
    return (
        <footer className="w-full max-w-7xl mx-auto p-8 flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between pr-4 pl-16 md:px-16 xl:px-4 border-t">
            <div className="flex items-center gap-3">
                <Image src={'/isu-logo-green.png'} width={100} height={100} alt="Logo" />
                <h2 className="hidden md:block font-bold text-3xl text-primary uppercase">
                    Ilia State <br />University
                </h2>
            </div>
            <div className="text-center md:text-right text-sm">
                <p>
                    &copy; {Number(currentDate) > Number(dateCreated) ? `${dateCreated} - ${currentDate}` : currentDate}
                </p>
                <Link href={'https://iliauni.edu.ge/en/'} className="block md:hidden text-primary hover:text-primary/90 transition">Ilia State University</Link>
                <Link href={'mailto:dh@iliauni.edu.ge'} className="text-xs">Developed <span className="text-primary">DH ISU</span></Link>
            </div>
        </footer>
    )
}