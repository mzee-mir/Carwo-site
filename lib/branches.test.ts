import { describe, expect, it } from "vitest";
import { getBranches } from "./sanity/data";
import { branchMapUrl } from "./branches";

describe("branches", () => {
  it("starts with the main Bosaso shop at the client's pin", async () => {
    const [main, ...rest] = await getBranches();
    expect(rest).toHaveLength(0);
    expect(main.name).toBe("Carwo Bosaso");
    expect(main.isMain).toBe(true);
    expect([main.lat, main.lng]).toEqual([11.284851, 49.177534]);
  });

  it("builds a maps link from the pin, or from the address when there is no pin", () => {
    expect(branchMapUrl({ lat: 11.284851, lng: 49.177534, address: "x" })).toBe("https://www.google.com/maps/search/?api=1&query=11.284851,49.177534");
    expect(branchMapUrl({ address: "Main Rd, Garowe" })).toBe("https://www.google.com/maps/search/?api=1&query=Main%20Rd%2C%20Garowe");
    expect(branchMapUrl({})).toBeNull();
  });
});
