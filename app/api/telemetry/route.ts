import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// Ensure your MongoDB Connection String is configured locally or in env profiles
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/cyclone_track_db";
let client: MongoClient | null = null;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db('cyclone_track_network');
}

// 📋 1. GET HANDLER: Delivers historical survey logs and active tracking records
export async function GET() {
  try {
    const db = await connectToDatabase();
    
    // Fetch logs collection, sort by newest time matrix, and cap at 50 documents
    const records = await db.collection('telemetry_records')
      .find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({ success: true, data: records }, { status: 200 });
  } catch (error) {
    console.error("Backend GET pipeline failed:", error);
    return NextResponse.json({ success: false, message: "Internal Server GET Failure" }, { status: 500 });
  }
}

// 📥 2. POST HANDLER: Ingests user coordinate parameters, wind logs, and survey flags click-free
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const db = await connectToDatabase();

    // Map fields strictly to match our tracking telemetry requirements
    const normalizedRecord = {
      latitude: Number(payload.latitude),
      longitude: Number(payload.longitude),
      city: payload.city || "Unknown Sector",
      windSpeed: Number(payload.windSpeed),
      threatActive: Boolean(payload.threatActive),
      assignedShelter: payload.assignedShelter,
      hasPropertyDamage: payload.hasPropertyDamage || "No",
      challengesFaced: payload.challengesFaced || [],
      preferredLanguage: payload.preferredLanguage || "en",
      sosTriggered: Boolean(payload.sosTriggered),
      timestamp: payload.timestamp ? new Date(payload.timestamp) : new Date()
    };

    await db.collection('telemetry_records').insertOne(normalizedRecord);
    
    return NextResponse.json({ success: true, message: "Packet Ingested Securely" }, { status: 201 });
  } catch (error) {
    console.error("Backend POST pipeline failed:", error);
    return NextResponse.json({ success: false, message: "Internal Server POST Failure" }, { status: 500 });
  }
}