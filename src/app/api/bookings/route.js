// src/app/api/bookings/route.js
import { NextResponse } from "next/server";
import { getMongoDb } from "@/lib/mongodb";

export async function GET(request) {
  try {
    const db = await getMongoDb();
    const bookings = await db
      .collection("bookings")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    console.error("Failed to fetch bookings from MongoDB:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const bookingData = await request.json();
    const db = await getMongoDb();

    const newBooking = {
      ...bookingData,
      id: bookingData.id || `BK-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("bookings").insertOne(newBooking);

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (error) {
    console.error("Failed to create booking in MongoDB:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create booking" },
      { status: 500 }
    );
  }
}
