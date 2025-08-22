import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CardCartItem } from "../CartItem";
import type { CartItem, Product } from "@mfe/contracts";

function currency(n: number) {
  return `R$ ${n.toFixed(2)}`;
}

const baseItem: CartItem = {
  id: "p1",
  name: "Produto 1",
  price: 10,
  qty: 2,
};

function renderRow(item: CartItem = baseItem, overrides?: Partial<{
  addToCart: (p: Product) => void;
  removeFromCart: (id: string) => void;
}>) {
  const addToCart = overrides?.addToCart ?? jest.fn();
  const removeFromCart = overrides?.removeFromCart ?? jest.fn();

  render(
    <table>
      <tbody>
        <CardCartItem
          item={item}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
        />
      </tbody>
    </table>
  );

  const tbody = screen.getByRole("rowgroup");
  const row = within(tbody).getByRole("row");
  const cells = within(row).getAllByRole("cell"); // 0=Produto, 1=Preço, 2=Qtd, 3=Subtotal, 4=Ações
  const actions = within(cells[4]);

  return { row, cells, actions, addToCart, removeFromCart };
}

describe("CardCartItem (unit)", () => {
  it("renderiza nome, preço unitário, quantidade e subtotal formatados", () => {
    const { cells } = renderRow();

    expect(cells[0]).toHaveTextContent("Produto 1");         // nome
    expect(cells[1]).toHaveTextContent(currency(10));        // preço unitário
    expect(cells[2]).toHaveTextContent("2");                 // qty
    expect(cells[3]).toHaveTextContent(currency(20));        // subtotal = 10 * 2
  });

  it("clique no botão + chama addToCart com Product (sem qty)", async () => {
    const user = userEvent.setup();
    const { actions, addToCart } = renderRow();

    await user.click(actions.getByRole("button", { name: "+" }));

    expect(addToCart).toHaveBeenCalledTimes(1);
    expect(addToCart).toHaveBeenCalledWith({
      id: "p1",
      name: "Produto 1",
      price: 10,
    });
  });

  it("clique em Remover chama removeFromCart com o id do item", async () => {
    const user = userEvent.setup();
    const { actions, removeFromCart } = renderRow();

    await user.click(actions.getByRole("button", { name: /remover/i }));

    expect(removeFromCart).toHaveBeenCalledTimes(1);
    expect(removeFromCart).toHaveBeenCalledWith("p1");
  });

  it("formata valores monetários com duas casas decimais", () => {
    const item: CartItem = { id: "x", name: "Produto X", price: 10.5, qty: 3 };
    const { cells } = renderRow(item);

    expect(cells[1]).toHaveTextContent(currency(10.5));  // "R$ 10.50"
    expect(cells[3]).toHaveTextContent(currency(31.5));  // "R$ 31.50"
  });

  it("mantém estrutura de 5 colunas e ações acessíveis", () => {
    const { cells, actions } = renderRow();

    expect(cells).toHaveLength(5);
    expect(actions.getByRole("button", { name: "+" })).toBeInTheDocument();
    expect(actions.getByRole("button", { name: /remover/i })).toBeInTheDocument();
  });
});
