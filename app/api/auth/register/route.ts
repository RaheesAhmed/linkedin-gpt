import { NextResponse } from "next/server"
import * as z from "zod"

const userSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    
    try {
      const body = userSchema.parse(json)
      
      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const error = await response.json()
        return NextResponse.json(
          { message: error.error },
          { status: response.status }
        )
      }

      const user = await response.json()
      return NextResponse.json(user)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { message: error.issues[0].message },
          { status: 400 }
        )
      }
      throw error
    }
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
