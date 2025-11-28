import { NextRequest } from "next/server";
import { getEventById } from "@/service/events.service";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    
    if (!eventId) {
      return Response.json({ message: "Event ID is required" }, { status: 400 });
    }

    const result = await getEventById(eventId);

    if (result.isError) {
      return Response.json({ message: "Event not found" }, { status: 404 });
    }

    return Response.json({ data: result.data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

