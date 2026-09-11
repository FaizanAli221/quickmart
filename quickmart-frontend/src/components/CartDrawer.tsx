"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Loader2, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { formatPKR } from "@/lib/format";
import { FreeDeliveryBar } from "@/components/FreeDeliveryBar";
import { useIsMobile } from "@/lib/useIsMobile";
import { createOrder, type OrderResponse } from "@/lib/api";

export function CartDrawer() {
  const isMobile = useIsMobile();
  const isOpen = useUIStore((s) => s.isCartOpen);
  const closeCart = useUIStore((s) => s.closeCart);
  const setActiveCategory = useUIStore((s) => s.setActiveCategory);

  const cartItems = useCartStore((s) => s.cartItems);
  const incrementItem = useCartStore((s) => s.incrementItem);
  const decrementItem = useCartStore((s) => s.decrementItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = useCartStore((s) => s.subtotal());
  const deliveryFee = useCartStore((s) => s.deliveryFee());
  const totalAmount = useCartStore((s) => s.totalAmount());

  // Checkout flow state
  const [isCheckoutStep, setIsCheckoutStep] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderResult, setOrderResult] = useState<OrderResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("COD");

  const isEmpty = cartItems.length === 0;

  const handleClose = () => {
    closeCart();
    // Reset internal state after drawer animation
    setTimeout(() => {
      setIsCheckoutStep(false);
      setOrderResult(null);
      setErrorMessage(null);
    }, 300);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setErrorMessage("Please fill in all required customer details.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const payload = {
        items: cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        customerDetails: {
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
        },
        paymentMethod,
      };

      const result = await createOrder(payload);
      setOrderResult(result);
      clearCart();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit order to backend API.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-ink/40"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={isMobile ? { y: "100%" } : { x: "100%" }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: "100%" } : { x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 34 }}
            className={
              isMobile
                ? "fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-2xl bg-paper shadow-2xl"
                : "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-paper shadow-2xl"
            }
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-ink/10 bg-white px-4 py-3.5">
              <div className="flex items-center gap-2">
                {isCheckoutStep && !orderResult && (
                  <button
                    onClick={() => setIsCheckoutStep(false)}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-ink/60 hover:bg-ink/5"
                  >
                    <ArrowLeft size={16} />
                  </button>
                )}
                <h2 className="text-base font-bold text-ink">
                  {orderResult
                    ? "Order Confirmed!"
                    : isCheckoutStep
                    ? "Checkout Details"
                    : "Your Cart"}
                </h2>
              </div>
              <button
                onClick={handleClose}
                aria-label="Close cart"
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-ink/5"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            {orderResult ? (
              /* Success confirmation view */
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-8 text-center overflow-y-auto">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-ink">Order #{orderResult.orderId}</h3>
                  <p className="text-xs text-ink/60 mt-1">
                    ETA: <span className="font-semibold text-brand">{orderResult.deliveryETA}</span>
                  </p>
                </div>

                <div className="w-full rounded-xl border border-ink/10 bg-white p-4 text-left text-xs space-y-2">
                  <div className="flex justify-between text-ink/60">
                    <span>Status</span>
                    <span className="font-bold text-emerald-600 uppercase">{orderResult.status}</span>
                  </div>
                  <div className="flex justify-between text-ink/60">
                    <span>Total Amount</span>
                    <span className="font-bold text-ink">{formatPKR(orderResult.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-ink/60">
                    <span>Payment</span>
                    <span className="font-semibold text-ink">{orderResult.paymentMethod}</span>
                  </div>
                  <div className="border-t border-ink/10 pt-2 text-ink/70">
                    <p className="font-semibold text-ink">{orderResult.customerDetails.name}</p>
                    <p>{orderResult.customerDetails.phone}</p>
                    <p className="truncate">{orderResult.customerDetails.address}</p>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="mt-2 w-full rounded-full bg-brand py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-brand-dark"
                >
                  Continue Shopping
                </button>
              </div>
            ) : isCheckoutStep ? (
              /* Checkout form view */
              <form onSubmit={handlePlaceOrder} className="flex flex-1 flex-col justify-between overflow-y-auto">
                <div className="space-y-4 p-4">
                  {errorMessage && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600">
                      {errorMessage}
                    </div>
                  )}

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-ink">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Faizan Ali"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-ink/20 px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-ink">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0300-1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg border border-ink/20 px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-ink">Delivery Address *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="House/Apartment #, Street, City"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full rounded-lg border border-ink/20 px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-ink">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full rounded-lg border border-ink/20 px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
                    >
                      <option value="COD">Cash on Delivery (COD)</option>
                      <option value="Card">Credit / Debit Card</option>
                      <option value="JazzCash / EasyPaisa">JazzCash / EasyPaisa</option>
                    </select>
                  </div>
                </div>

                {/* Footer with summary & submit */}
                <div className="border-t border-ink/10 bg-white p-4">
                  <div className="mb-3 flex justify-between text-sm font-bold text-ink">
                    <span>Total Payble</span>
                    <span>{formatPKR(totalAmount)}</span>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-chili py-3 text-sm font-bold text-white shadow-md shadow-chili/30 transition-colors hover:bg-chili-dark disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Sending to Backend...</span>
                      </>
                    ) : (
                      <span>Confirm & Place Order</span>
                    )}
                  </button>
                </div>
              </form>
            ) : isEmpty ? (
              /* Empty state view */
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-light">
                  <ShoppingBag size={28} className="text-brand" />
                </div>
                <p className="text-sm font-semibold text-ink">Your cart is empty</p>
                <p className="text-xs text-ink/50">
                  Browse categories and add items to get your order started.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory("dairy-eggs");
                    closeCart();
                  }}
                  className="mt-2 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
                >
                  Browse Categories
                </button>
              </div>
            ) : (
              /* Normal cart list view */
              <>
                {/* Free delivery progress */}
                <div className="px-4 pt-3">
                  <FreeDeliveryBar />
                </div>

                {/* Item list */}
                <div className="flex-1 overflow-y-auto px-4 py-3">
                  <ul className="flex flex-col gap-3">
                    {cartItems.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center gap-3 rounded-xl border border-ink/10 bg-white p-2.5"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-14 w-14 shrink-0 rounded-lg object-cover"
                        />
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <span className="truncate text-sm font-semibold text-ink">
                            {item.name}
                          </span>
                          <span className="text-xs text-ink/50">{item.unit}</span>
                          <span className="text-xs font-bold text-ink">
                            {formatPKR(item.price)}{" "}
                            <span className="font-normal text-ink/40">
                              × {item.quantity} = {formatPKR(item.price * item.quantity)}
                            </span>
                          </span>
                        </div>

                        <div className="flex shrink-0 flex-col items-end gap-1.5">
                          <button
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${item.name} from cart`}
                            className="text-ink/30 transition-colors hover:text-chili"
                          >
                            <Trash2 size={14} />
                          </button>
                          <div className="flex items-center gap-2 rounded-full bg-brand px-1 py-1">
                            <button
                              aria-label={`Decrease quantity of ${item.name}`}
                              onClick={() => decrementItem(item.id)}
                              className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-brand active:scale-90"
                            >
                              <Minus size={13} strokeWidth={2.5} />
                            </button>
                            <span className="w-4 text-center text-xs font-bold text-white">
                              {item.quantity}
                            </span>
                            <button
                              aria-label={`Increase quantity of ${item.name}`}
                              onClick={() => incrementItem(item.id)}
                              disabled={item.quantity >= item.maxStock}
                              className={`flex h-6 w-6 items-center justify-center rounded-full active:scale-90 ${
                                item.quantity >= item.maxStock
                                  ? "cursor-not-allowed bg-white/40 text-white/60"
                                  : "bg-white text-brand"
                              }`}
                            >
                              <Plus size={13} strokeWidth={2.5} />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sticky checkout footer */}
                <div className="border-t border-ink/10 bg-white px-4 py-4">
                  <div className="mb-3 flex flex-col gap-1.5 text-sm">
                    <div className="flex justify-between text-ink/60">
                      <span>Subtotal</span>
                      <span className="font-medium text-ink">{formatPKR(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-ink/60">
                      <span>Delivery Fee</span>
                      <span className="font-medium text-ink">
                        {deliveryFee === 0 ? "Free" : formatPKR(deliveryFee)}
                      </span>
                    </div>
                    <div className="mt-1 flex justify-between border-t border-dashed border-ink/15 pt-1.5 text-base font-bold text-ink">
                      <span>Total</span>
                      <span>{formatPKR(totalAmount)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsCheckoutStep(true)}
                    className="w-full rounded-full bg-chili py-3 text-sm font-bold text-white shadow-md shadow-chili/30 transition-colors hover:bg-chili-dark active:scale-[0.98]"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
