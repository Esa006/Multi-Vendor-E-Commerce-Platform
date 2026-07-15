<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Get or create a cart for the current user
     */
    private function getOrCreateCart(): Cart
    {
        $user = Auth::user() ?: User::first();
        if (!$user) {
            throw new \Exception("No user found. Database must be seeded.");
        }
        return Cart::firstOrCreate(['user_id' => $user->id]);
    }

    /**
     * GET /api/cart
     */
    public function index(): JsonResponse
    {
        try {
            $cart = $this->getOrCreateCart();
            $items = CartItem::with(['product.brand', 'product.vendor', 'variant'])
                ->where('cart_id', $cart->id)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $items,
                'cart_id' => $cart->id
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * POST /api/cart
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'nullable|exists:product_variants,id',
            'quantity' => 'required|integer|min:1'
        ]);

        try {
            $cart = $this->getOrCreateCart();
            $product = Product::findOrFail($request->input('product_id'));
            $variantId = $request->input('variant_id');
            $quantity = $request->input('quantity');

            // 1. Stock Validation
            if ($product->stock < $quantity) {
                return response()->json([
                    'success' => false,
                    'message' => "Only {$product->stock} units of {$product->name} are available in stock."
                ], 422);
            }

            // Determine unit price
            $price = $product->price;
            if ($variantId) {
                $variant = ProductVariant::findOrFail($variantId);
                if ($variant->price_override !== null) {
                    $price = $variant->price_override;
                }
            }

            // 2. Check if item already exists in cart
            $cartItem = CartItem::where('cart_id', $cart->id)
                ->where('product_id', $product->id)
                ->where('variant_id', $variantId)
                ->first();

            if ($cartItem) {
                // Validate combined quantity stock
                $newQty = $cartItem->quantity + $quantity;
                if ($product->stock < $newQty) {
                    return response()->json([
                        'success' => false,
                        'message' => "Cannot add more. Total quantity in cart would exceed stock limit of {$product->stock} units."
                    ], 422);
                }

                $cartItem->quantity = $newQty;
                $cartItem->subtotal = $newQty * $price;
                $cartItem->save();
            } else {
                $cartItem = CartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $product->id,
                    'variant_id' => $variantId,
                    'quantity' => $quantity,
                    'price' => $price,
                    'subtotal' => $quantity * $price
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Product added to cart successfully.',
                'data' => $cartItem
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * PUT /api/cart/{id}
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        try {
            $cart = $this->getOrCreateCart();
            $cartItem = CartItem::where('cart_id', $cart->id)->findOrFail($id);
            $product = Product::findOrFail($cartItem->product_id);
            $quantity = $request->input('quantity');

            // Stock Validation
            if ($product->stock < $quantity) {
                return response()->json([
                    'success' => false,
                    'message' => "Only {$product->stock} units are available in stock."
                ], 422);
            }

            $cartItem->quantity = $quantity;
            $cartItem->subtotal = $quantity * $cartItem->price;
            $cartItem->save();

            return response()->json([
                'success' => true,
                'message' => 'Cart updated successfully.',
                'data' => $cartItem
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * DELETE /api/cart/{id}
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $cart = $this->getOrCreateCart();
            $cartItem = CartItem::where('cart_id', $cart->id)->findOrFail($id);
            $cartItem->delete();

            return response()->json([
                'success' => true,
                'message' => 'Item removed from cart successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
