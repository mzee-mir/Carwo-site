import { beforeEach, describe, expect, it, vi } from "vitest";
import { encodeSignatureHeader, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { NextRequest } from "next/server";

const revalidatePath = vi.fn();
vi.mock("next/cache", () => ({ revalidatePath: (...a: unknown[]) => revalidatePath(...a) }));

const SECRET = "test-secret";
const body = JSON.stringify({ _type: "product", slug: "oversized-tee" });

async function request(signature?: string) {
  return new NextRequest("http://localhost/api/revalidate", {
    method: "POST",
    body,
    headers: signature ? { [SIGNATURE_HEADER_NAME]: signature, "content-type": "application/json" } : { "content-type": "application/json" },
  });
}

describe("POST /api/revalidate", () => {
  beforeEach(() => {
    revalidatePath.mockClear();
    process.env.SANITY_REVALIDATE_SECRET = SECRET;
  });

  it("rejects requests without a valid signature", async () => {
    const { POST } = await import("./route");
    const res = await POST(await request(await encodeSignatureHeader(body, Date.now(), "wrong")));
    expect(res.status).toBe(401);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("revalidates the whole site for a valid signature", async () => {
    const { POST } = await import("./route");
    const res = await POST(await request(await encodeSignatureHeader(body, Date.now(), SECRET)));
    expect(res.status).toBe(200);
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  }, 15_000);
});
