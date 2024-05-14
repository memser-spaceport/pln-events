import { NextRequest } from "next/server";
import { client } from '../../../.tina/__generated__/client'


export async function GET(request: NextRequest) {
    try {
        const eventsListData = await client.queries.eventConnection({ last: -1 });
        const events = eventsListData?.data?.eventConnection?.edges ?? [];
        return Response.json({ data: events }, { status: 200 });
    } catch (error) {
        console.error(error);
        return Response.json({ message: "Internal Server Error" }, { status: 500 })
    }
}