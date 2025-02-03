import fs from "fs"
import path from "path"
import { hash, compare } from "bcryptjs"

const USERS_FILE = path.join(process.cwd(), "data", "users.json")

// Ensure the data directory exists
if (!fs.existsSync(path.join(process.cwd(), "data"))) {
  fs.mkdirSync(path.join(process.cwd(), "data"))
}

// Ensure users.json exists
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify({ users: [] }))
}

export type User = {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
  updatedAt: string
}

export const userService = {
  async findByEmail(email: string): Promise<User | null> {
    const data = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"))
    const user = data.users.find((u: User) => u.email === email)
    return user || null
  },

  async create(userData: { name: string; email: string; password: string }): Promise<Omit<User, "password">> {
    const data = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"))
    
    // Check if user already exists
    if (data.users.some((u: User) => u.email === userData.email)) {
      throw new Error("User already exists")
    }

    const hashedPassword = await hash(userData.password, 10)
    const now = new Date().toISOString()
    
    const newUser: User = {
      id: crypto.randomUUID(),
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    }

    data.users.push(newUser)
    fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2))

    const { password, ...userWithoutPassword } = newUser
    return userWithoutPassword
  },

  async validateCredentials(email: string, password: string): Promise<Omit<User, "password"> | null> {
    const user = await this.findByEmail(email)
    if (!user) return null

    const isValid = await compare(password, user.password)
    if (!isValid) return null

    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}
