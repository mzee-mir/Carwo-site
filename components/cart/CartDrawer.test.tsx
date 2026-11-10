import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { products } from "@/lib/sanity/fixtures";
import { useCart } from "@/lib/cart/store";
import { CartDrawer } from "./CartDrawer";

const tee = products[0];

describe("CartDrawer without a WhatsApp number", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify([tee]))));
    vi.stubGlobal("matchMedia", (q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
    useCart.setState({
      isOpen: true,
      lines: [{ key: `${tee._id}|M|Black`, productId: tee._id, slug: tee.slug, name: tee.name, size: "M", colour: "Black", quantity: 1, unitPrice: tee.price }],
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("hides the WhatsApp button and offers a contact link instead", async () => {
    render(<CartDrawer settings={{ currencyCode: "KES", currencySymbol: "KSh" }} />);
    await waitFor(() => expect(screen.getByRole("link", { name: "Contact us" })).toHaveAttribute("href", "/about"));
    expect(screen.queryByRole("link", { name: /order on whatsapp/i })).toBeNull();
  });
});
