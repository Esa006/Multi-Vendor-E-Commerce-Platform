<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    private function getCurrentUser(): User
    {
        $user = Auth::user() ?: User::first();
        if (!$user) {
            throw new \Exception("No user found. Database must be seeded.");
        }
        return $user;
    }

    /**
     * GET /api/wishlist
     */
    public function index(): JsonResponse
    {
        try {
            $user = $this->getCurrentUser();
            $items = Wishlist::with(['product.brand', 'product.vendor', 'product.images', 'product.variants'])
                ->where('user_id', $user->id)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $items
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * POST /api/wishlist
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id'
        ]);

        try {
            $user = $this->getCurrentUser();
            $productId = $request->input('product_id');

            // Prevent duplicates
            $exists = Wishlist::where('user_id', $user->id)
                ->where('product_id', $productId)
                ->exists();

            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product is already in your wishlist.'
                ], 422);
            }

            $wishlistItem = Wishlist::create([
                'user_id' => $user->id,
                'product_id' => $productId
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Product added to wishlist successfully.',
                'data' => $wishlistItem
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * DELETE /api/wishlist/{id}
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $user = $this->getCurrentUser();
            $wishlistItem = Wishlist::where('user_id', $user->id)->findOrFail($id);
            $wishlistItem->delete();

            return response()->json([
                'success' => true,
                'message' => 'Product removed from wishlist successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
