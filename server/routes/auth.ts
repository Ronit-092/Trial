import { RequestHandler } from "express";
import { LoginRequest, RegisterRequest, AuthResponse, User } from "@shared/api";

// Mock user storage (in production, use a database)
const users: Map<string, User & { password: string }> = new Map();

// Mock JWT token generation (in production, use jsonwebtoken)
function generateToken(userId: string): string {
  return `token_${userId}_${Date.now()}`;
}

// Mock user validation
function validatePassword(password: string): boolean {
  return password.length >= 8;
}

export const handleLogin: RequestHandler = (req, res) => {
  try {
    const { email, password } = req.body as LoginRequest;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    // Mock authentication - find user
    let foundUser: (User & { password: string }) | undefined;
    for (const user of users.values()) {
      if (user.email === email) {
        foundUser = user;
        break;
      }
    }

    if (!foundUser || foundUser.password !== password) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    const token = generateToken(foundUser.id);

    res.json({
      user: userWithoutPassword,
      token,
    } as AuthResponse);
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

export const handleRegister: RequestHandler = (req, res) => {
  try {
    const { email, password, name, userType } = req.body as RegisterRequest;

    if (!email || !password || !name || !userType) {
      res
        .status(400)
        .json({ message: "Email, password, name, and user type are required" });
      return;
    }

    if (!validatePassword(password)) {
      res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
      return;
    }

    // Check if email already exists
    for (const user of users.values()) {
      if (user.email === email) {
        res.status(409).json({ message: "Email already exists" });
        return;
      }
    }

    const userId = `user_${Date.now()}`;
    const newUser: User & { password: string } = {
      id: userId,
      email,
      name,
      userType,
      password,
      createdAt: new Date().toISOString(),
    };

    users.set(userId, newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    const token = generateToken(userId);

    res.status(201).json({
      user: userWithoutPassword,
      token,
    } as AuthResponse);
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
};
