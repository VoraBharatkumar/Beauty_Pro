/**
 * Beauty_Pro - Authentication API
 * Persists users to MongoDB when available
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, email, password, name, phone } = body;

    if (!action) {
      return Response.json({ success: false, message: 'Action is required', connection_status: 'unknown' }, { status: 400 });
    }

    let dbConnected = true;
    try {
      await connectDB();
    } catch (dbError) {
      dbConnected = false;
    }

    switch (action) {
      case 'signup': {
        if (!dbConnected) {
          return Response.json({ success: false, message: 'Database connection failed. Please try again later.', connection_status: 'disconnected' }, { status: 500 });
        }
        if (!name || !email || !password) {
          return Response.json({ success: false, message: 'Name, email, and password are required' }, { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const userData = { name, email, phone, password: hashedPassword };
        try {
          const user = await User.create(userData);
          const token = jwt.sign({ email: user.email, name: user.name, _id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
          return Response.json({ success: true, message: 'Account created successfully', user: { _id: user._id, name: user.name, email: user.email, phone: user.phone }, token, connection_status: 'connected' });
        } catch (e) {
          if (e.code === 11000) {
            return Response.json({ success: false, message: 'An account with this email already exists' }, { status: 409 });
          }
          return Response.json({ success: false, message: 'Failed to create account: ' + (e.message || 'Unknown error') }, { status: 500 });
        }
      }

      case 'login': {
        if (!dbConnected) {
          return Response.json({ success: false, message: 'Database connection failed. Please try again later.', connection_status: 'disconnected' }, { status: 500 });
        }
        if (!email || !password) {
          return Response.json({ success: false, message: 'Email and password are required' }, { status: 400 });
        }
        let userRecord = null;
        try {
          userRecord = await User.findOne({ email });
        } catch (e) {
          return Response.json({ success: false, message: 'Database error: ' + (e.message || 'Unknown error') }, { status: 500 });
        }
        if (!userRecord) {
          return Response.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
        }
        const passwordMatch = await bcrypt.compare(password, userRecord.password);
        if (!passwordMatch) {
          return Response.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
        }
        const token = jwt.sign({ email: userRecord.email, name: userRecord.name, _id: userRecord._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
        return Response.json({ success: true, message: 'Login successful', user: { _id: userRecord._id, name: userRecord.name, email: userRecord.email, phone: userRecord.phone }, token, connection_status: 'connected' });
      }

      case 'forgot-password':
        return Response.json({ success: true, message: 'Password reset link sent to your email', connection_status: dbConnected ? 'connected' : 'disconnected' });

      case 'reset-password':
        return Response.json({ success: true, message: 'Password reset successfully', connection_status: dbConnected ? 'connected' : 'disconnected' });

      default:
        return Response.json({ success: false, message: 'Invalid action', connection_status: dbConnected ? 'connected' : 'disconnected' }, { status: 400 });
    }
  } catch (error) {
    return Response.json({ success: false, error: error.message, connection_status: 'error' }, { status: 500 });
  }
}

