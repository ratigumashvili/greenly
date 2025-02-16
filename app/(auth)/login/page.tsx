import { LoginForm } from "@/components/forms/login-form";

export default function LogIn() {
    return (
        <section className="w-full h-[calc(100vh-10vh)] flex items-center justify-center">
            <div className="w-full max-w-sm">
                <LoginForm />
            </div>

        </section>
    )
}