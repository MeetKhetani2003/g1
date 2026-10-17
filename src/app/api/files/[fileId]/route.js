// src/app/api/files/[fileId]/route.js
// Streams stored photos and files from MongoDB GridFS back to the browser
import { NextResponse } from "next/server";
import { getGridFSBucket, ObjectId } from "../../../../lib/mongodb";

export async function GET(request, { params }) {
  try {
    const { fileId } = await params;
    const { searchParams } = new URL(request.url);
    const bucketType = searchParams.get("bucket") || "photos";

    if (!fileId || !ObjectId.isValid(fileId)) {
      return new NextResponse("Invalid file ID", { status: 400 });
    }

    const bucket = await getGridFSBucket(bucketType);
    const objectId = new ObjectId(fileId);

    // Check if file exists in the GridFS files collection
    const files = await bucket.find({ _id: objectId }).toArray();
    if (!files || files.length === 0) {
      return new NextResponse("File not found in GridFS", { status: 404 });
    }

    const fileDoc = files[0];
    const downloadStream = bucket.openDownloadStream(objectId);

    // Read stream chunks into Web stream
    const webStream = new ReadableStream({
      start(controller) {
        downloadStream.on("data", (chunk) => controller.enqueue(chunk));
        downloadStream.on("end", () => controller.close());
        downloadStream.on("error", (err) => controller.error(err));
      },
    });

    const contentType =
      fileDoc.contentType ||
      fileDoc.metadata?.contentType ||
      "image/jpeg";

    return new NextResponse(webStream, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": fileDoc.length?.toString() || "",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("GridFS file download error:", err);
    return new NextResponse("Error retrieving file from GridFS", { status: 500 });
  }
}
