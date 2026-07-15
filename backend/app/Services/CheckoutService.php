<?php

namespace App\Services;

use App\Models\User;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CheckoutService
{
    public function placeOrder(User $user, array $data)
    {
        return DB::transaction(function () use ($user, $data) {
            $cart = $user->cart;

            if (!$cart || $cart->items->isEmpty()) {
                throw ValidationException::withMessages(['cart' => 'Your cart is empty.']);
            }

            // Verify address belongs to user
            $address = $user->addresses()->findOrFail($data['address_id']);

            // Recalculate totals and check stock
            $subtotal = 0;
            foreach ($cart->items as $item) {
                $product = $item->product;
                if ($product->stock < $item->quantity) {
                    throw ValidationException::withMessages([
                        'stock' => "Insufficient stock for product: {$product->name}"
                    ]);
                }
                
                // Determine price (handle variants if needed)
                $price = $product->sale_price ?? $product->price;
                if ($item->variant && $item->variant->price_override) {
                    if ($item->variant->price_override < $price * 0.5) {
                        $price += $item->variant->price_override;
                    } else {
                        $price = $item->variant->price_override;
                    }
                }

                $subtotal += $price * $item->quantity;
            }

            $shipping = $subtotal >= 5000 ? 0 : 150;
            $grandTotal = $subtotal + $shipping;

            // Create Order
            $order = Order::create([
                'order_number' => 'ORD-' . strtoupper(uniqid()),
                'user_id' => $user->id,
                'address_id' => $address->id,
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'grand_total' => $grandTotal,
                'payment_method' => $data['payment_method'],
                'payment_status' => $data['payment_method'] === 'cod' ? 'pending' : 'paid',
                'order_status' => 'confirmed',
                'placed_at' => now(),
            ]);

            // Create Order Items and Reduce Stock
            foreach ($cart->items as $item) {
                $product = $item->product;
                
                $price = $product->sale_price ?? $product->price;
                if ($item->variant && $item->variant->price_override) {
                    if ($item->variant->price_override < $price * 0.5) {
                        $price += $item->variant->price_override;
                    } else {
                        $price = $item->variant->price_override;
                    }
                }

                $order->items()->create([
                    'vendor_id' => $product->vendor_id,
                    'product_id' => $product->id,
                    'variant_id' => $item->variant_id,
                    'quantity' => $item->quantity,
                    'price' => $price,
                    'subtotal' => $price * $item->quantity,
                ]);

                // Reduce stock
                $product->decrement('stock', $item->quantity);
            }

            // Create Payment Record
            $order->payments()->create([
                'method' => $data['payment_method'],
                'amount' => $grandTotal,
                'status' => $data['payment_method'] === 'cod' ? 'pending' : 'paid',
                'paid_at' => $data['payment_method'] === 'cod' ? null : now(),
            ]);

            // Clear Cart
            $cart->items()->delete();

            return $order->load(['items.product', 'address']);
        });
    }

    public function getOrders(User $user)
    {
        return $user->orders()->with(['items.product', 'address', 'payments'])->latest()->get();
    }
}
