import React from "react";
import { CartItem, Product } from "@mfe/contracts";
import { CardCartItem } from "./CartItem";

type CartTableProps = {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  total: number;
};

export function CartTable({
  items,
  addToCart,
  removeFromCart,
  total,
}: CartTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>Produto</th>
          <th>Preço</th>
          <th>Qtd</th>
          <th>Subtotal</th>
          <th style={{ textAlign: "right" }}>Ações</th>
        </tr>
      </thead>
      <tbody>
        {items.map((i) => (
          <CardCartItem
            key={i.id}
            item={i}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
          />
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={3}>Total</td>
          <td colSpan={2}>R$ {total.toFixed(2)}</td>
        </tr>
      </tfoot>
    </table>
  );
}
