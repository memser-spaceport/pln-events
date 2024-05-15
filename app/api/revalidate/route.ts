import { BEARER_REGEX } from "@/utils/constants";
import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const authToken = request.headers.get("Authorization");
  const matcheResult = authToken?.match(BEARER_REGEX);
  const token = matcheResult ? matcheResult[1] : null;
  if (process.env.NEXT_PUBLIC_REVALIDATE_TOKEN !== token) {
    return Response.json({ message: "UnAuthorized" }, { status: 401 });
  }
  if (!Array.isArray(body.tags)) {
    return Response.json(null, { status: 400 });
  }
  body?.tags?.map((tag: string) => {
    revalidateTag(tag);
  });
  return Response.json({ message: "Success" }, { status: 200 });
}
