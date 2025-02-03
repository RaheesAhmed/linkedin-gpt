import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { NextResponse } from "next/server"
import * as z from "zod"

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = userSchema.parse(json)

    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      )
    }

    const hashedPassword = await hash(body.password, 10)

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
      },
    })

    const { password: _, ...result } = user
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues }, { status: 400 })
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
