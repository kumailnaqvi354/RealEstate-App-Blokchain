import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        // Connect to the database
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection("property");

        // Parse the body (assuming it is in JSON format)
        const newProperty = await req.json();
        console.log("New property data:", newProperty);

        // // Insert the new property into the collection
        const result = await collection.insertOne(newProperty);

        if (result.acknowledged) {
            return NextResponse.json(
                { message: "Data saved successfully", data: newProperty },  // return the saved data
                { status: 201 }
            );
        } else {
            return NextResponse.json(
                { error: "Failed to save data" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error saving property data:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}


export async function GET() {
    try {
        // Connect to the database
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection("property");

        // Fetch all property documents
        const properties = await collection.find({}).toArray();

        return NextResponse.json(
            { message: "Properties fetched successfully", data: properties },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching property data:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}