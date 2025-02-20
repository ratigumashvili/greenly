import Link from "next/link";

export function NotLoggedIn() {
    return (
        <section className="py-8">
            <h2 className="font-bold text-lg mb-1">You are not logged in.</h2>
            please, <Link href={'/login'} className="text-primary hover:text-primary/90 transition">
                sign in
            </Link> to your account or Create a <Link href={'/sign-up'} className="text-primary hover:text-primary/90 transition">new account</Link>.
        </section>
    )
}