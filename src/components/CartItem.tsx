import React from "react";
import { CartItem, Product } from "@mfe/contracts";

type CartItemProps = {
  item: CartItem;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
};

export function CardCartItem({
  item,
  addToCart,
  removeFromCart,
}: CartItemProps) {
  return (
    <tr>
      <td data-testid="cart-item">{item.name}</td>
      <td>R$ {item.price.toFixed(2)}</td>
      <td>{item.qty}</td>
      <td>R$ {(item.price * item.qty).toFixed(2)}</td>
      <td style={{ textAlign: "right" }}>
        <button
          className="btn"
          onClick={() =>
            addToCart({
              id: item.id,
              name: item.name,
              price: item.price,
            })
          }
        >
          +
        </button>
        <button
          className="btn"
          style={{ marginLeft: 8 }}
          onClick={() => removeFromCart(item.id)}
        >
          Remover
        </button>
      </td>
    </tr>
  );
}
