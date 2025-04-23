import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    
    const users = await User.find({})
      .select('email referralCode referralCount linkVisits position createdAt')
      .sort({ position: 1 });
    
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
} 