import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid property ID" },
                { status: 400 }
            );
        }

        // Connect to the database
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection("property");

        // Find property by ID
        const property = await collection.findOne({ _id: new ObjectId(id) });

        if (!property) {
            return NextResponse.json(
                { error: "Property not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Property found", data: property },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching property by ID:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
