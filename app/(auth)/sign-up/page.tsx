import { SignUpForm } from "@/components/forms/signup-form";

export default function SignUp() {
    return (
        <section className="w-full h-[calc(100vh-10vh)] flex items-center justify-center">
            <div className="w-full max-w-sm">
                <SignUpForm />
            </div>
        </section>
    )
}