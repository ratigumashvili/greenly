// import { NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"
// import bcrypt from "bcryptjs"

// export async function POST(req: Request) {
//   try {
//     const body = await req.json()
//     const { name, email, password } = body

//     if (!name || !email || !password) {
//       return NextResponse.json({ error: "All fields are required" }, { status: 400 })
//     }

//     const existingUser = await prisma.user.findUnique({
//       where: { email },
//     })

//     if (existingUser) {
//       return NextResponse.json({ error: "Email already in use" }, { status: 400 })
//     }

//     const hashedPassword = await bcrypt.hash(password, 10)

//     const user = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//       },
//     })

//     return NextResponse.json({ user }, { status: 201 })
//   } catch (error) {
//     console.error("Registration Error:", error)
//     return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
//   }
// }

import { NextResponse } from "next/server"
import { signIn } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ success: false, error: "Email already in use" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // Automatically create session via `signIn`
    const result = await signIn("credentials", {
      email: user.email,
      password,
      redirect: false,
    })

    if (result?.error) {
      return NextResponse.json({ success: false, error: "Failed to create session" }, { status: 500 })
    }

    return NextResponse.json({ success: true, user }, { status: 201 })
  } catch (error) {
    console.error("Registration Error:", error)
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 })
  }
}
 