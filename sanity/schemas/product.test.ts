import { describe, expect, it } from "vitest";
import { product } from "./product";

describe("product schema", () => {
  it("requires at least one size so a product can be bought", () => {
    const sizes = product.fields.find((f) => f.name === "sizes") as { validation?: unknown; description?: string };
    expect(sizes.validation).toBeTypeOf("function");
    expect(sizes.description).toMatch(/one size/i);
  });
});
