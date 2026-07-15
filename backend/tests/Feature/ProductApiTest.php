<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    protected $seed = true;

    /**
     * Test products listing and search
     */
    public function test_products_list_and_search(): void
    {
        // 1. Basic listing returns 12 products per page (default)
        $response = $this->getJson('/api/products');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data',
            'links',
            'meta'
        ]);
        $this->assertCount(12, $response->json('data'));

        // 2. Search by Product Name ("iPhone")
        $response = $this->getJson('/api/products?search=iPhone');
        $response->assertStatus(200);
        $this->assertNotEmpty($response->json('data'));
        foreach ($response->json('data') as $product) {
            $this->assertStringContainsString('iPhone', $product['name']);
        }

        // 3. Search by SKU ("SKU-APL-15P")
        $response = $this->getJson('/api/products?search=SKU-APL-15P');
        $response->assertStatus(200);
        $this->assertNotEmpty($response->json('data'));
        $this->assertEquals('SKU-APL-15P', $response->json('data.0.sku'));

        // 4. Search by Brand ("Sony")
        $response = $this->getJson('/api/products?search=Sony');
        $response->assertStatus(200);
        $this->assertNotEmpty($response->json('data'));
        foreach ($response->json('data') as $product) {
            $this->assertTrue(
                str_contains(strtolower($product['name']), 'sony') ||
                str_contains(strtolower($product['brand']['name']), 'sony')
            );
        }
    }

    /**
     * Test filtering options
     */
    public function test_products_filtering(): void
    {
        // 1. Category Filter ("electronics")
        $response = $this->getJson('/api/products?category=electronics');
        $response->assertStatus(200);
        $this->assertNotEmpty($response->json('data'));
        foreach ($response->json('data') as $product) {
            $this->assertEquals('electronics', $product['category']['slug']);
        }

        // 2. Brand Filter (Array support: Levis)
        $response = $this->getJson('/api/products?brand[]=Levis');
        $response->assertStatus(200);
        $this->assertNotEmpty($response->json('data'));
        foreach ($response->json('data') as $product) {
            $this->assertEquals('Levis', $product['brand']['name']);
        }

        // 3. Price Range Filter (1000 to 10000)
        $response = $this->getJson('/api/products?min_price=1000&max_price=10000');
        $response->assertStatus(200);
        $this->assertNotEmpty($response->json('data'));
        foreach ($response->json('data') as $product) {
            $price = (float) $product['price'];
            $this->assertTrue($price >= 1000 && $price <= 10000);
        }

        // 4. Rating Filter (4.8 & Up)
        $response = $this->getJson('/api/products?rating=4.8');
        $response->assertStatus(200);
        $this->assertNotEmpty($response->json('data'));
        foreach ($response->json('data') as $product) {
            $this->assertTrue((float) $product['rating'] >= 4.8);
        }

        // 5. Availability Filter (instock: stock > 0)
        $response = $this->getJson('/api/products?avail=instock');
        $response->assertStatus(200);
        $this->assertNotEmpty($response->json('data'));
        foreach ($response->json('data') as $product) {
            $this->assertTrue($product['stock'] > 0);
        }

        // 6. Availability Filter (outofstock: stock <= 0)
        $response = $this->getJson('/api/products?avail=outofstock');
        $response->assertStatus(200);
        $this->assertNotEmpty($response->json('data'));
        foreach ($response->json('data') as $product) {
            $this->assertTrue($product['stock'] <= 0);
        }

        // 7. Discount Filter (20% or more)
        $response = $this->getJson('/api/products?discount=20');
        $response->assertStatus(200);
        $this->assertNotEmpty($response->json('data'));
        foreach ($response->json('data') as $product) {
            $this->assertTrue($product['discount'] >= 20);
        }
    }

    /**
     * Test sorting options
     */
    public function test_products_sorting(): void
    {
        // 1. Sort by Price: Low to High
        $response = $this->getJson('/api/products?sort=price-asc');
        $response->assertStatus(200);
        $this->assertNotEmpty($response->json('data'));
        $prices = array_column($response->json('data'), 'price');
        $sortedPrices = $prices;
        sort($sortedPrices);
        $this->assertEquals($sortedPrices, $prices);

        // 2. Sort by Price: High to Low
        $response = $this->getJson('/api/products?sort=price-desc');
        $response->assertStatus(200);
        $this->assertNotEmpty($response->json('data'));
        $prices = array_column($response->json('data'), 'price');
        $sortedPrices = $prices;
        rsort($sortedPrices);
        $this->assertEquals($sortedPrices, $prices);

        // 3. Sort by Best Selling (reviews count desc)
        $response = $this->getJson('/api/products?sort=best-selling');
        $response->assertStatus(200);
        $this->assertNotEmpty($response->json('data'));
        $reviews = array_column($response->json('data'), 'reviews');
        $sortedReviews = $reviews;
        rsort($sortedReviews);
        $this->assertEquals($sortedReviews, $reviews);
    }
}
