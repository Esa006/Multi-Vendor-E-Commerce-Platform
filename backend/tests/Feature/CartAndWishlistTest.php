<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Wishlist;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartAndWishlistTest extends TestCase
{
    use RefreshDatabase;

    protected $seed = true;

    /**
     * Test cart operations: list, add, update, delete
     */
    public function test_cart_operations(): void
    {
        $user = User::first();
        $product = Product::where('stock', '>', 5)->first();

        // 1. Initial cart should be empty or return status 200
        $response = $this->getJson('/api/cart');
        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'data' => []
        ]);

        // 2. Add product to cart (Quantity: 2)
        $response = $this->postJson('/api/cart', [
            'product_id' => $product->id,
            'quantity' => 2
        ]);
        $response->assertStatus(200);
        $response->assertJsonPath('success', true);

        // Verify cart item exists in DB
        $cart = Cart::where('user_id', $user->id)->first();
        $this->assertNotNull($cart);
        $cartItem = CartItem::where('cart_id', $cart->id)->first();
        $this->assertNotNull($cartItem);
        $this->assertEquals(2, $cartItem->quantity);

        // 3. Stock validation: adding quantity exceeding stock should fail (422)
        $response = $this->postJson('/api/cart', [
            'product_id' => $product->id,
            'quantity' => $product->stock + 10
        ]);
        $response->assertStatus(422);

        // 4. Update quantity of existing cart item
        $response = $this->putJson('/api/cart/' . $cartItem->id, [
            'quantity' => 4
        ]);
        $response->assertStatus(200);
        $this->assertEquals(4, $cartItem->refresh()->quantity);

        // 5. Delete cart item
        $response = $this->deleteJson('/api/cart/' . $cartItem->id);
        $response->assertStatus(200);
        $this->assertDatabaseMissing('cart_items', ['id' => $cartItem->id]);
    }

    /**
     * Test wishlist operations: list, add, delete, duplicate prevention
     */
    public function test_wishlist_operations(): void
    {
        $user = User::first();
        $product = Product::first();

        // 1. Initial wishlist is empty or status 200
        $response = $this->getJson('/api/wishlist');
        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'data' => []
        ]);

        // 2. Add product to wishlist
        $response = $this->postJson('/api/wishlist', [
            'product_id' => $product->id
        ]);
        $response->assertStatus(200);
        $response->assertJsonPath('success', true);

        // Verify entry in database
        $this->assertDatabaseHas('wishlists', [
            'user_id' => $user->id,
            'product_id' => $product->id
        ]);

        // 3. Adding duplicate product to wishlist should fail (422)
        $response = $this->postJson('/api/wishlist', [
            'product_id' => $product->id
        ]);
        $response->assertStatus(422);

        // Get the item ID
        $wishlistItem = Wishlist::where('user_id', $user->id)->where('product_id', $product->id)->first();
        $this->assertNotNull($wishlistItem);

        // 4. Remove product from wishlist
        $response = $this->deleteJson('/api/wishlist/' . $wishlistItem->id);
        $response->assertStatus(200);
        $this->assertDatabaseMissing('wishlists', ['id' => $wishlistItem->id]);
    }
}
