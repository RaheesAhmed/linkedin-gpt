import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export const runTime='nodejs'
export const maxDuration=60

const USERS_FILE = path.join(process.cwd(), "data", "users.json")

// Ensure the data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), "data")
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir)
  }

  try {
    await fs.access(USERS_FILE)
  } catch {
    // Create initial users file with empty array
    await fs.writeFile(USERS_FILE, JSON.stringify({ users: [] }, null, 2))
  }
}

async function readUsersFile(): Promise<any[]> {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8')
    const parsed = JSON.parse(data)
    return Array.isArray(parsed.users) ? parsed.users : []
  } catch (error) {
    console.error('Error reading users file:', error)
    return []
  }
}

async function writeUsersFile(users: any[]) {
  await fs.writeFile(USERS_FILE, JSON.stringify({ users }, null, 2))
}

type User = {
  id: string
  email: string
  password: string
  subscriptionPlan: 'FREE' | 'PAID' | 'PAID+'
  createdAt: string
}

export async function GET(request: Request) {
  try {
    await ensureDataDirectory()
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const users = await readUsersFile()
    const user = users.find((u: User) => u.email === email)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { password, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await ensureDataDirectory()
    const body = await request.json()
    const { email, password } = body

    const users = await readUsersFile()

    if (users.some((u: User) => u.email === email)) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const now = new Date().toISOString()

    const newUser: User = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      subscriptionPlan: 'FREE',
      createdAt: now
    }

    users.push(newUser)
    await writeUsersFile(users)

    const { password: _, ...userWithoutPassword } = newUser
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    await ensureDataDirectory()
    const body = await request.json()
    const { email, password } = body

    const users = await readUsersFile()
    const user = users.find((u: User) => u.email === email)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('PUT error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
