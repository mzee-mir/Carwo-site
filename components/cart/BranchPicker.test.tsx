import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { products } from "@/lib/sanity/fixtures";
import { useCart } from "@/lib/cart/store";
import type { Branch } from "@/lib/types";
import { CartDrawer } from "./CartDrawer";

const tee = products[0];
const settings = { currencyCode: "USD", currencySymbol: "$", whatsappNumber: "+252 61 000 0000" };
const bosaso: Branch = { _id: "b1", name: "Carwo Bosaso", city: "Bosaso", isMain: true, whatsappNumber: "+252 61 000 0000" };
const garowe: Branch = { _id: "b2", name: "Carwo Garowe", city: "Garowe", isMain: false, whatsappNumber: "+252 90 777 8888" };

const orderText = () => new URL(screen.getByRole("link", { name: /order on whatsapp/i }).getAttribute("href")!).searchParams.get("text");

describe("branch picker in the cart", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify([tee]))));
    vi.stubGlobal("matchMedia", (q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
    useCart.setState({
      isOpen: true,
      lines: [{ key: `${tee._id}|M|Black`, productId: tee._id, slug: tee.slug, name: tee.name, size: "M", colour: "Black", quantity: 1, unitPrice: tee.price }],
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("with one branch, names it and puts it in the message without a dropdown", async () => {
    render(<CartDrawer settings={settings} branches={[bosaso]} />);
    await waitFor(() => expect(screen.getByText("Carwo Bosaso")).toBeInTheDocument());
    expect(screen.queryByRole("combobox")).toBeNull();
    expect(orderText()).toContain("Branch: Carwo Bosaso");
  });

  it("with several branches, the chosen branch goes in the message and receives the order", async () => {
    render(<CartDrawer settings={settings} branches={[bosaso, garowe]} />);
    const select = await screen.findByRole("combobox", { name: "Your nearest branch" });
    expect(orderText()).toContain("Branch: Carwo Bosaso");
    fireEvent.change(select, { target: { value: "b2" } });
    expect(orderText()).toContain("Branch: Carwo Garowe");
    expect(screen.getByRole("link", { name: /order on whatsapp/i }).getAttribute("href")).toMatch(/^https:\/\/wa\.me\/252907778888\?/);
  });
});
