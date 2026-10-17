// src/app/api/doctors/route.js
import { NextResponse } from "next/server";
import { getMongoDb } from "@/lib/mongodb";

export async function GET(request) {
  try {
    const db = await getMongoDb();
    const doctors = await db.collection("doctors").find({}).sort({ rating: -1 }).toArray();
    return NextResponse.json({ success: true, count: doctors.length, doctors });
  } catch (error) {
    console.error("Failed to fetch doctors from MongoDB:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load doctors" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const doctorData = await request.json();
    if (!doctorData.name) {
      return NextResponse.json(
        { success: false, error: "Doctor name is required" },
        { status: 400 }
      );
    }

    const db = await getMongoDb();
    const slug =
      doctorData.slug ||
      doctorData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const newDoc = {
      ...doctorData,
      id: doctorData.id || `doc-${Date.now()}`,
      slug,
      updatedAt: new Date(),
    };

    await db.collection("doctors").updateOne(
      { $or: [{ id: newDoc.id }, { slug: newDoc.slug }] },
      { $set: newDoc },
      { upsert: true }
    );

    return NextResponse.json({ success: true, doctor: newDoc });
  } catch (error) {
    console.error("Failed to save doctor to MongoDB:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save doctor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Doctor ID is required" }, { status: 400 });
    }

    const db = await getMongoDb();
    await db.collection("doctors").deleteOne({ $or: [{ id }, { slug: id }] });
    return NextResponse.json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Failed to delete doctor from MongoDB:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete doctor" },
      { status: 500 }
    );
  }
}
