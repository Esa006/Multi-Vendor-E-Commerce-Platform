<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Product;
use App\Models\Vendor;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Address;
use App\Models\Cart;
use App\Models\CartItem;

class CheckoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_place_order()
    {
        // 1. Setup Data
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $category = Category::create(['name' => 'Test', 'slug' => 'test']);
        $brand = Brand::create(['name' => 'Test', 'slug' => 'test']);
        $vendor = Vendor::create(['store_name' => 'Test', 'slug' => 'test']);

        $product = Product::create([
            'name' => 'Test Product',
            'slug' => 'test-product',
            'sku' => 'TEST-123',
            'price' => 100,
            'stock' => 10,
            'category_id' => $category->id,
            'brand_id' => $brand->id,
            'vendor_id' => $vendor->id,
        ]);

        $address = Address::create([
            'user_id' => $user->id,
            'full_name' => 'John Doe',
            'phone' => '1234567890',
            'address_line_1' => '123 Test St',
            'city' => 'Test City',
            'state' => 'Test State',
            'postal_code' => '12345',
        ]);

        $cart = Cart::create(['user_id' => $user->id]);
        CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'price' => 100,
            'subtotal' => 200,
        ]);

        // 2. Perform Checkout
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/checkout', [
            'address_id' => $address->id,
            'payment_method' => 'cod',
        ]);

        // 3. Assertions
        $response->assertStatus(200)
                 ->assertJsonStructure(['success', 'data' => ['order_number']]);

        // Check if stock reduced
        $this->assertEquals(8, $product->fresh()->stock);

        // Check if cart is cleared
        $this->assertCount(0, $cart->items()->get());

        // Check if order exists
        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'payment_method' => 'cod',
            'subtotal' => 200,
        ]);
    }
}
