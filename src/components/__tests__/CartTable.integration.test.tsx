import React, { useEffect, useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartTable } from "../CartTable";
import type { CartItem } from "@mfe/contracts";

import cartApi from "../../mocks/cartApi.local";

function CartTableWithMockApi() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const s = cartApi.getSnapshot();
    setItems(s.items);
    setTotal(s.total);

    const unsub = cartApi.subscribe((snap) => {
      setItems(snap.items);
      setTotal(snap.total);
    });

    return () => void (unsub && unsub());
  }, []);

  return (
    <CartTable
      items={items}
      total={total}
      addToCart={cartApi.addToCart}
      removeFromCart={cartApi.removeFromCart}
    />
  );
}

function currency(n: number) {
  return `R$ ${n.toFixed(2)}`;
}

describe("CartTable (integration) com cartApi.local", () => {

  it("exibe itens iniciais do mock e reage a + / Remover", async () => {
    const user = userEvent.setup();
    render(<CartTableWithMockApi />);

    // rowgroups: [thead, tbody, tfoot]
    const [_, tbody, tfoot] = screen.getAllByRole("rowgroup");
    const rows = within(tbody).getAllByRole("row");

    // Helper: encontra a linha pela 1ª célula
    const cell = (row: HTMLElement, idx: number) =>
      within(row).getAllByRole("cell")[idx];

    const rowByFirstCellText = (txt: string) => {
      const found = rows.find((r) => {
        const cells = within(r).queryAllByRole("cell");
        return cells.length > 0 && cells[0].textContent === txt;
      });
      if (!found) throw new Error(`Row with first cell "${txt}" not found`);
      return found;
    };

    const rowTeclado = rowByFirstCellText("Teclado Gamer");
    const rowMouse = rowByFirstCellText("Mouse sem fio");
    const actionsTeclado = cell(rowTeclado, 4);
    const actionsMouse = cell(rowMouse, 4);

    expect(cell(rowTeclado, 1)).toHaveTextContent(currency(100)); // preço unit.
    expect(cell(rowTeclado, 2)).toHaveTextContent("1");           // qty
    expect(cell(rowTeclado, 3)).toHaveTextContent(currency(100)); // subtotal

    expect(cell(rowMouse, 1)).toHaveTextContent(currency(80));
    expect(cell(rowMouse, 2)).toHaveTextContent("2");
    expect(cell(rowMouse, 3)).toHaveTextContent(currency(160));

    const totalCell = within(tfoot).getAllByRole("cell")[1];
    expect(totalCell).toHaveTextContent(currency(260));

    await user.click(within(actionsTeclado).getByRole("button", { name: "+" }));
    expect(cell(rowTeclado, 2)).toHaveTextContent("2");
    expect(cell(rowTeclado, 3)).toHaveTextContent(currency(200));
    expect(totalCell).toHaveTextContent(currency(360));

    await user.click(within(actionsMouse).getByRole("button", { name: /remover/i }));

    expect(
      within(tbody).queryByRole("row", { name: /mouse sem fio/i })
    ).not.toBeInTheDocument();

    expect(totalCell).toHaveTextContent(currency(200));
  });
});
