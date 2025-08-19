import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import type { AuthApi, CartApi, CartSnapshot } from "@mfe/contracts";
import { CartTable } from "./components/CartTable";
import { useCartApi } from "./hooks/useCartApi";
import { useAuthApi } from "./hooks/useAuthApi";

function CartPage() {
  const { mod: cartApi, status: cartStatus } = useCartApi();
  const { mod: authApi } = useAuthApi();
  const [snap, setSnap] = useState<CartSnapshot>({
    items: [],
    total: 0,
    count: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!cartApi) return;
    setSnap(cartApi.getSnapshot());
    const unsub = cartApi.subscribe(setSnap);
    return () => {
      unsub && unsub();
    };
  }, [cartApi]);

  const onCheckout = async () => {
    const s = authApi?.getSnapshot();
    if (!s?.isAuthenticated) {
      navigate("/login?redirect=/cart");
      return;
    }
    navigate("/checkout");
  };

  if (cartStatus === "loading" || !cartApi) return <div>Carregando API…</div>;
  if (cartStatus === "error") return <div>Erro ao carregar o carrinho.</div>;

  return (
    <div>
      <h2 style={{ marginTop: 0 }} data-testid="title-cart">🛒 MFE Cart</h2>
      {snap.items.length === 0 ? (
        <p className="muted">Seu carrinho está vazio.</p>
      ) : (
        <>
          <CartTable
            items={snap.items}
            addToCart={cartApi.addToCart}
            removeFromCart={cartApi.removeFromCart}
            total={snap.total}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 16,
            }}
          >
            <strong>Itens: {snap.count}</strong>
            <div>
              <button className="btn" onClick={() => cartApi.clear()}>
                Limpar
              </button>
              <button
                data-testid="button-finalize"
                className="btn"
                style={{
                  marginLeft: 8,
                  borderColor: "#2a5",
                  background: "#153",
                  color: "#aef",
                }}
                onClick={onCheckout}
              >
                Finalizar compra
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function CartApp() {
  return (
    <Routes>
      <Route path="/" element={<CartPage />} />
    </Routes>
  );
}
