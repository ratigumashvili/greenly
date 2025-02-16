import Image from "next/image";

export function Navbar() {
    return (
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 lg:px-10 py-4">
            <Image src={'/logo-lg.svg'} width={150} height={150} alt="Logo" />
        </div>
    )
}