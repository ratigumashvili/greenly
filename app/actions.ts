// "use server";

// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";

// export async function registerUser(name: string, email: string, password: string) {
//   try {
//     const existingUser = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (existingUser) {
//       return { success: false, error: "Email already in use" };
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//       },
//     });

//     return { success: true };
//   } catch (error) {
//     console.error("Registration Error:", error);
//     return { success: false, error: "Something went wrong during registration" };
//   }
// }
