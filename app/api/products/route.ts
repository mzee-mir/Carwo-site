import { NextResponse, type NextRequest } from "next/server";
import { getProductsByIds } from "@/lib/sanity/data";

/** GET /api/products?ids=a,b — current data for the products in a shopper's cart. */
export async function GET(req: NextRequest) {
  const ids = (req.nextUrl.searchParams.get("ids") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 50);
  if (ids.length === 0) return NextResponse.json([]);
  return NextResponse.json(await getProductsByIds(ids));
}
