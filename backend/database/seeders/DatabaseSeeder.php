<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Vendor;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Default Admin User
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@shopverse.com',
        ]);

        // 2. Categories mapping
        $categoriesData = [
            ['name' => 'Electronics', 'slug' => 'electronics'],
            ['name' => 'Fashion', 'slug' => 'fashion'],
            ['name' => 'Home & Kitchen', 'slug' => 'home'],
            ['name' => 'Beauty & Skincare', 'slug' => 'beauty'],
            ['name' => 'Sports & Outdoors', 'slug' => 'sports'],
            ['name' => 'Books & Stationery', 'slug' => 'books'],
        ];

        $categories = [];
        foreach ($categoriesData as $cat) {
            $categories[$cat['slug']] = Category::create($cat);
        }

        // 3. Brands mapping
        $brandsData = ['Apple', 'Sony', 'Dell', 'Nike', 'Samsung', 'boAt', 'Philips', 'Beardo', 'Fujifilm', 'Levis', 'Nespresso', 'OnePlus', 'Casio', 'Aeropress', 'Logitech', 'Ray-Ban', 'Cosrx', 'CeraVe', 'Adidas', 'Puma', 'Decathlon', 'Lamy'];
        $brands = [];
        foreach ($brandsData as $bName) {
            $brands[$bName] = Brand::create([
                'name' => $bName,
                'slug' => Str::slug($bName),
                'description' => "Official products from {$bName}."
            ]);
        }

        // 4. Vendors mapping
        $vendorsData = [
            ['store_name' => 'TechWorld Store', 'slug' => 'techworld-store', 'rating' => 4.8, 'reviews_count' => 120, 'status' => 'active'],
            ['store_name' => 'FootStyle Store', 'slug' => 'footstyle-store', 'rating' => 4.6, 'reviews_count' => 85, 'status' => 'active'],
            ['store_name' => 'Apple Flagship Store', 'slug' => 'apple-flagship', 'rating' => 4.9, 'reviews_count' => 320, 'status' => 'active'],
            ['store_name' => 'HomeNeeds Direct', 'slug' => 'homeneeds-direct', 'rating' => 4.5, 'reviews_count' => 54, 'status' => 'active'],
            ['store_name' => 'Sony India', 'slug' => 'sony-india', 'rating' => 4.8, 'reviews_count' => 182, 'status' => 'active'],
            ['store_name' => 'Dell Authorized Store', 'slug' => 'dell-authorized', 'rating' => 4.7, 'reviews_count' => 94, 'status' => 'active'],
            ['store_name' => 'Nike Official Store', 'slug' => 'nike-official', 'rating' => 4.6, 'reviews_count' => 112, 'status' => 'active'],
            ['store_name' => 'Samsung Plaza', 'slug' => 'samsung-plaza', 'rating' => 4.9, 'reviews_count' => 310, 'status' => 'active'],
            ['store_name' => 'GadgetHub Store', 'slug' => 'gadgethub', 'rating' => 4.4, 'reviews_count' => 1205, 'status' => 'active'],
            ['store_name' => 'BeautyCare Shop', 'slug' => 'beautycare', 'rating' => 4.2, 'reviews_count' => 76, 'status' => 'active'],
            ['store_name' => 'PhotoWorld Store', 'slug' => 'photoworld', 'rating' => 4.5, 'reviews_count' => 143, 'status' => 'active'],
            ['store_name' => 'Denim Depot', 'slug' => 'denim-depot', 'rating' => 4.3, 'reviews_count' => 92, 'status' => 'active'],
            ['store_name' => 'Nestle Home', 'slug' => 'nestle-home', 'rating' => 4.6, 'reviews_count' => 52, 'status' => 'active'],
            ['store_name' => 'WatchStudio', 'slug' => 'watchstudio', 'rating' => 4.7, 'reviews_count' => 204, 'status' => 'active'],
            ['store_name' => 'SportsCentral', 'slug' => 'sportscentral', 'rating' => 4.5, 'reviews_count' => 230, 'status' => 'active'],
            ['store_name' => 'StationeryHub', 'slug' => 'stationeryhub', 'rating' => 4.6, 'reviews_count' => 78, 'status' => 'active'],
        ];

        $vendors = [];
        foreach ($vendorsData as $v) {
            $vendors[$v['store_name']] = Vendor::create($v);
        }

        // 5. Products Data matching frontend list
        $productsData = [
            [
                'name' => 'Apple iPhone 15 Pro', 'sku' => 'SKU-APL-15P', 'category' => 'electronics',
                'brand' => 'Apple', 'vendor' => 'Apple Flagship Store', 'price' => 124900, 'mrp' => 134900, 'rating' => 4.90, 'reviews' => 245,
                'stock' => 14, 'discount' => 7, 'featured' => true,
                'thumbnail' => 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=300&q=80',
            ],
            [
                'name' => 'Sony WH-1000XM5 ANC Headphones', 'sku' => 'SKU-SNY-XM5', 'category' => 'electronics',
                'brand' => 'Sony', 'vendor' => 'Sony India', 'price' => 29999, 'mrp' => 34999, 'rating' => 4.80, 'reviews' => 182,
                'stock' => 8, 'discount' => 14, 'featured' => true,
                'thumbnail' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80',
            ],
            [
                'name' => 'Dell XPS 13 Core Ultra Laptop', 'sku' => 'SKU-DEL-X13', 'category' => 'electronics',
                'brand' => 'Dell', 'vendor' => 'Dell Authorized Store', 'price' => 98999, 'mrp' => 114999, 'rating' => 4.70, 'reviews' => 94,
                'stock' => 5, 'discount' => 13, 'featured' => false,
                'thumbnail' => 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=300&q=80',
            ],
            [
                'name' => 'Nike Zoom Fly 5 Running Shoes', 'sku' => 'SKU-NKE-ZF5', 'category' => 'fashion',
                'brand' => 'Nike', 'vendor' => 'Nike Official Store', 'price' => 11995, 'mrp' => 14995, 'rating' => 4.60, 'reviews' => 112,
                'stock' => 22, 'discount' => 20, 'featured' => true,
                'thumbnail' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80',
            ],
            [
                'name' => 'Samsung Galaxy S24 Ultra', 'sku' => 'SKU-SAM-S24U', 'category' => 'electronics',
                'brand' => 'Samsung', 'vendor' => 'Samsung Plaza', 'price' => 129999, 'mrp' => 139999, 'rating' => 4.90, 'reviews' => 310,
                'stock' => 11, 'discount' => 7, 'featured' => true,
                'thumbnail' => 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=300&q=80',
            ],
            [
                'name' => 'boAt Wave Call Plus Smartwatch', 'sku' => 'SKU-BOT-WCP', 'category' => 'electronics',
                'brand' => 'boAt', 'vendor' => 'GadgetHub Store', 'price' => 1599, 'mrp' => 1999, 'rating' => 4.40, 'reviews' => 1205,
                'stock' => 45, 'discount' => 20, 'featured' => false,
                'thumbnail' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80',
            ],
            [
                'name' => 'Philips Air Fryer HD9252', 'sku' => 'SKU-PHL-AF9', 'category' => 'home',
                'brand' => 'Philips', 'vendor' => 'HomeNeeds Direct', 'price' => 6799, 'mrp' => 7999, 'rating' => 4.50, 'reviews' => 88,
                'stock' => 3, 'discount' => 15, 'featured' => false,
                'thumbnail' => 'https://images.unsplash.com/photo-1585669183285-c5f0e4b8b4d2?auto=format&fit=crop&w=300&q=80',
            ],
            [
                'name' => 'Beardo Whisky Smoke Perfume', 'sku' => 'SKU-BRD-WSP', 'category' => 'beauty',
                'brand' => 'Beardo', 'vendor' => 'BeautyCare Shop', 'price' => 899, 'mrp' => 1199, 'rating' => 4.20, 'reviews' => 76,
                'stock' => 19, 'discount' => 25, 'featured' => false,
                'thumbnail' => 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=300&q=80',
            ],
            [
                'name' => 'Fujifilm Instax Mini 12', 'sku' => 'SKU-FJF-M12', 'category' => 'electronics',
                'brand' => 'Fujifilm', 'vendor' => 'PhotoWorld Store', 'price' => 5999, 'mrp' => 6999, 'rating' => 4.50, 'reviews' => 143,
                'stock' => 7, 'discount' => 14, 'featured' => true,
                'thumbnail' => 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=300&q=80',
            ],
            [
                'name' => "Levi's Men's 511 Slim Fit Jeans", 'sku' => 'SKU-LEV-511', 'category' => 'fashion',
                'brand' => 'Levis', 'vendor' => 'Denim Depot', 'price' => 2199, 'mrp' => 3299, 'rating' => 4.30, 'reviews' => 92,
                'stock' => 15, 'discount' => 33, 'featured' => false,
                'thumbnail' => 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=300&q=80',
            ],
            [
                'name' => 'Nespresso Vertuo Next Coffee Maker', 'sku' => 'SKU-NES-VNC', 'category' => 'home',
                'brand' => 'Nespresso', 'vendor' => 'Nestle Home', 'price' => 15999, 'mrp' => 18999, 'rating' => 4.60, 'reviews' => 52,
                'stock' => 0, 'discount' => 15, 'featured' => true,
                'thumbnail' => 'https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?auto=format&fit=crop&w=300&q=80',
            ],
            [
                'name' => 'OnePlus Nord CE 4 Lite 5G', 'sku' => 'SKU-ONP-NCE4', 'category' => 'electronics',
                'brand' => 'OnePlus', 'vendor' => 'TechWorld Store', 'price' => 18999, 'mrp' => 24999, 'rating' => 4.50, 'reviews' => 820,
                'stock' => 2, 'discount' => 24, 'featured' => false,
                'thumbnail' => 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80',
            ],
            [
                'name' => 'Samsung 55" QLED 4K Smart TV', 'sku' => 'SKU-SAM-Q55', 'category' => 'electronics',
                'brand' => 'Samsung', 'vendor' => 'Samsung Plaza', 'price' => 64999, 'mrp' => 79999, 'rating' => 4.80, 'reviews' => 118,
                'stock' => 4, 'discount' => 18, 'featured' => true,
                'thumbnail' => 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=300&q=80',
            ],
            [
                'name' => 'Casio G-Shock Sport Analog-Digital', 'sku' => 'SKU-CAS-GSK', 'category' => 'fashion',
                'brand' => 'Casio', 'vendor' => 'WatchStudio', 'price' => 8495, 'mrp' => 9995, 'rating' => 4.70, 'reviews' => 204,
                'stock' => 16, 'discount' => 15, 'featured' => false,
                'thumbnail' => 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=300&q=80',
            ],
            [
                'name' => 'Aeropress Original Coffee Maker', 'sku' => 'SKU-AER-ORG', 'category' => 'home',
                'brand' => 'Aeropress', 'vendor' => 'Nestle Home', 'price' => 3499, 'mrp' => 3999, 'rating' => 4.80, 'reviews' => 312,
                'stock' => 25, 'discount' => 12, 'featured' => false,
                'thumbnail' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80',
            ],
            [
                'name' => 'MacBook Air M3 13-inch', 'sku' => 'SKU-APL-MBA3', 'category' => 'electronics',
                'brand' => 'Apple', 'vendor' => 'Apple Flagship Store', 'price' => 104900, 'mrp' => 114900, 'rating' => 4.90, 'reviews' => 98,
                'stock' => 6, 'discount' => 8, 'featured' => true,
                'thumbnail' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80',
            ],
            [
                'name' => 'Logitech MX Master 3S Mouse', 'sku' => 'SKU-LOG-MX3S', 'category' => 'electronics',
                'brand' => 'Logitech', 'vendor' => 'TechWorld Store', 'price' => 9499, 'mrp' => 10995, 'rating' => 4.80, 'reviews' => 412,
                'stock' => 18, 'discount' => 13, 'featured' => false,
                'thumbnail' => 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=300&q=80',
            ],
            [
                'name' => 'Ray-Ban Classic Wayfarer Sunglasses', 'sku' => 'SKU-RYB-WFR', 'category' => 'fashion',
                'brand' => 'Ray-Ban', 'vendor' => 'Denim Depot', 'price' => 8290, 'mrp' => 9990, 'rating' => 4.60, 'reviews' => 154,
                'stock' => 9, 'discount' => 17, 'featured' => false,
                'thumbnail' => 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=300&q=80',
            ],
            [
                'name' => 'Cosrx Advanced Snail 96 Mucin', 'sku' => 'SKU-CSX-SN96', 'category' => 'beauty',
                'brand' => 'Cosrx', 'vendor' => 'BeautyCare Shop', 'price' => 1250, 'mrp' => 1450, 'rating' => 4.70, 'reviews' => 890,
                'stock' => 30, 'discount' => 13, 'featured' => true,
                'thumbnail' => 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=300&q=80',
            ],
            [
                'name' => 'CeraVe Hydrating Facial Cleanser', 'sku' => 'SKU-CRV-HFC', 'category' => 'beauty',
                'brand' => 'CeraVe', 'vendor' => 'BeautyCare Shop', 'price' => 1150, 'mrp' => 1250, 'rating' => 4.60, 'reviews' => 1054,
                'stock' => 14, 'discount' => 8, 'featured' => false,
                'thumbnail' => 'https://images.unsplash.com/photo-1556229174-5e42a09e45af?auto=format&fit=crop&w=300&q=80',
            ],
            [
                'name' => 'Adidas Ultraboost Light', 'sku' => 'SKU-ADI-UBL', 'category' => 'fashion',
                'brand' => 'Adidas', 'vendor' => 'FootStyle Store', 'price' => 16999, 'mrp' => 19999, 'rating' => 4.70, 'reviews' => 202,
                'stock' => 4, 'discount' => 15, 'featured' => true,
                'thumbnail' => 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=300&q=80',
            ],
            [
                'name' => 'Puma Evercat Contender Backpack', 'sku' => 'SKU-PUM-ECB', 'category' => 'sports',
                'brand' => 'Puma', 'vendor' => 'FootStyle Store', 'price' => 1899, 'mrp' => 2999, 'rating' => 4.40, 'reviews' => 85,
                'stock' => 12, 'discount' => 36, 'featured' => false,
                'thumbnail' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&q=80',
            ],
            [
                'name' => 'Decathlon Yoga Mat 8mm', 'sku' => 'SKU-DEC-YM8', 'category' => 'sports',
                'brand' => 'Decathlon', 'vendor' => 'SportsCentral', 'price' => 999, 'mrp' => 1499, 'rating' => 4.50, 'reviews' => 230,
                'stock' => 40, 'discount' => 33, 'featured' => false,
                'thumbnail' => 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=300&q=80',
            ],
            [
                'name' => 'Lamy Safari Fountain Pen', 'sku' => 'SKU-LMY-SFP', 'category' => 'books',
                'brand' => 'Lamy', 'vendor' => 'StationeryHub', 'price' => 2350, 'mrp' => 2800, 'rating' => 4.60, 'reviews' => 78,
                'stock' => 22, 'discount' => 16, 'featured' => true,
                'thumbnail' => 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=300&q=80',
            ]
        ];

        // Create some generic users for reviews
        $reviewers = [
            User::first(),
            User::factory()->create(['name' => 'Aarav Mehta', 'email' => 'aarav@gmail.com']),
            User::factory()->create(['name' => 'Ananya Sharma', 'email' => 'ananya@gmail.com']),
            User::factory()->create(['name' => 'Rohan Das', 'email' => 'rohan@gmail.com']),
        ];

        $reviewTemplates = [
            ['rating' => 5, 'comment' => 'Absolutely love this! The quality is top-notch and exactly as described.'],
            ['rating' => 5, 'comment' => 'Super fast delivery and great packaging. Highly recommended store!'],
            ['rating' => 4, 'comment' => 'Good product. Decent quality for the price. Would buy again.'],
            ['rating' => 5, 'comment' => 'Excellent value for money. Very satisfied with the purchase.'],
            ['rating' => 4, 'comment' => 'Very solid construction and beautiful finish. Performs perfectly.'],
        ];

        foreach ($productsData as $prod) {
            $catSlug = $prod['category'];
            $brandName = $prod['brand'];
            $vendorName = $prod['vendor'];

            unset($prod['category'], $prod['brand'], $prod['vendor']);

            $prod['category_id'] = $categories[$catSlug]->id;
            $prod['brand_id'] = $brands[$brandName]->id;
            $prod['vendor_id'] = $vendors[$vendorName]->id;
            $prod['slug'] = Str::slug($prod['name']);

            $product = Product::create($prod);

            // Add images: thumbnail plus 2 other generic unsplash images for gallery
            $product->images()->create([
                'image_url' => $product->thumbnail
            ]);
            $product->images()->create([
                'image_url' => 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=600&q=80'
            ]);
            $product->images()->create([
                'image_url' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'
            ]);

            // Add specific variants
            if ($catSlug === 'electronics') {
                // Storage variants
                $product->variants()->createMany([
                    ['name' => 'Storage', 'value' => '128GB', 'price_override' => null],
                    ['name' => 'Storage', 'value' => '256GB', 'price_override' => 10000.00],
                    ['name' => 'Storage', 'value' => '512GB', 'price_override' => 25000.00]
                ]);
                // Color variants
                $product->variants()->createMany([
                    ['name' => 'Color', 'value' => 'Natural Titanium', 'price_override' => null],
                    ['name' => 'Color', 'value' => 'Blue Titanium', 'price_override' => null]
                ]);
            } elseif ($catSlug === 'fashion') {
                // Size variants
                $product->variants()->createMany([
                    ['name' => 'Size', 'value' => 'UK 7', 'price_override' => null],
                    ['name' => 'Size', 'value' => 'UK 8', 'price_override' => null],
                    ['name' => 'Size', 'value' => 'UK 9', 'price_override' => 500.00],
                    ['name' => 'Size', 'value' => 'UK 10', 'price_override' => 500.00]
                ]);
                // Color variants
                $product->variants()->createMany([
                    ['name' => 'Color', 'value' => 'Black', 'price_override' => null],
                    ['name' => 'Color', 'value' => 'Crimson Red', 'price_override' => null]
                ]);
            } else {
                $product->variants()->createMany([
                    ['name' => 'Standard', 'value' => 'Default', 'price_override' => null]
                ]);
            }

            // Seed reviews
            foreach ($reviewers as $idx => $user) {
                $template = $reviewTemplates[($idx + $product->id) % count($reviewTemplates)];
                $product->reviews()->create([
                    'user_id' => $user->id,
                    'rating' => $template['rating'],
                    'comment' => $template['comment']
                ]);
            }
        }
    }
}
