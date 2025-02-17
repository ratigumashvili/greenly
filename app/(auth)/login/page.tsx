import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SubmitButton } from "@/components/forms/submit-button";
import { LoginWithCredentials } from "@/components/forms/login-with-credentials";

import { authSession, signIn } from "@/lib/auth";

export default async function LoginPage() {
    const session = await authSession()

    if (session?.user) {
        return redirect("/")
    }

    return (
        <section className="w-full h-[calc(100vh-10vh)] flex items-center justify-center">
            <div className="w-full max-w-sm">
                <Card className="p-4">
                    <CardTitle>
                        <h2 className="text-xl mb-2">Login</h2>
                    </CardTitle>
                    <CardDescription className="mb-4">
                        <p>By continuing, you agree to our <Link href={'/'} className="text-primary">User Agreement</Link> and acknowledge that you understand the <Link href={'/'} className="text-primary">Privacy Policy</Link>.</p>
                    </CardDescription>
                    <CardContent className="p-0 flex flex-col gap-4">
                        <form action={async () => {
                            "use server"
                            await signIn("google", {
                                redirectTo: `${process.env.NEXT_PUBLIC_API_URL!}/api/auth/creation`
                            })
                        }}>
                            <SubmitButton
                                title="Continue with google"
                                pendingTitle="Loading..."
                                classNames="flex items-center gap-x-4 text-base"
                                variant="outline"
                                size="lg"
                            >
                                <Image
                                    src={'/google.svg'}
                                    width={20}
                                    height={20}
                                    alt="Google icon"
                                />
                            </SubmitButton>
                        </form>

                        <form action={async () => {
                            "use server"
                            await signIn("github", {
                                redirectTo: `${process.env.NEXT_PUBLIC_API_URL!}/api/auth/creation`
                            })
                        }}>
                            <SubmitButton
                                title="Continue with Github"
                                pendingTitle="Loading..."
                                classNames="flex items-center gap-x-4 text-base"
                                variant="outline"
                                size="lg"
                            >
                                <Image
                                    src={'/github.svg'}
                                    width={20}
                                    height={20}
                                    alt="Google icon"
                                />
                            </SubmitButton>
                        </form>

                        <div className="relative w-full my-4">
                            <p className="text-xs text-muted-foreground p-4 bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">OR</p>
                            <Separator />
                        </div>
                        
                        <LoginWithCredentials />
                    </CardContent>
                </Card >
            </div>
        </section>
    )
}