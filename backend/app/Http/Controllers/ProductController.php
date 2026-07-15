<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Vendor;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    /**
     * GET /api/products
     * Fetch list of products with filters, sorting, and pagination
     */
    public function index(Request $request)
    {
        // 1. Validation
        $request->validate([
            'search' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'subcategory' => 'nullable|string|max:255',
            'brand' => 'nullable|array',
            'brand.*' => 'string|max:255',
            'vendor' => 'nullable|integer',
            'rating' => 'nullable|numeric|min:0|max:5',
            'featured' => 'nullable|string|in:0,1,true,false',
            'min_price' => 'nullable|numeric|min:0',
            'max_price' => 'nullable|numeric|min:0',
            'discount' => 'nullable|integer|min:0|max:100',
            'avail' => 'nullable|string|in:all,instock,outofstock',
            'sort' => 'nullable|string|in:price-asc,price-desc,rating-desc,best-selling,best_selling,discount-desc,a-z,newest,price_asc,price_desc',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        // 2. Query Setup with Eager Loading
        $query = Product::with(['vendor', 'brand', 'category', 'images', 'variants']);

        // 3. Apply Filters
        // Search (by product name, sku, description, or brand)
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('brand', function ($bq) use ($search) {
                      $bq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Category Filter
        if ($request->filled('category') && $request->input('category') !== 'all') {
            $categorySlug = $request->input('category');
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        // Subcategory Filter
        if ($request->filled('subcategory')) {
            $subcategory = $request->input('subcategory');
            $query->where('subcategory', $subcategory);
        }

        // Brands Filter (Support array & single string fallback)
        if ($request->filled('brand')) {
            $brands = (array) $request->input('brand');
            $query->whereHas('brand', function ($q) use ($brands) {
                $q->whereIn('name', $brands);
            });
        }

        // Vendor Filter
        if ($request->filled('vendor')) {
            $query->where('vendor_id', $request->input('vendor'));
        }

        // Rating Filter
        if ($request->filled('rating')) {
            $query->where('rating', '>=', $request->input('rating'));
        }

        // Featured Filter
        if ($request->filled('featured')) {
            $featured = filter_var($request->input('featured'), FILTER_VALIDATE_BOOLEAN);
            $query->where('featured', $featured);
        }

        // Price range
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->input('min_price'));
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->input('max_price'));
        }

        // Availability Filter
        if ($request->filled('avail')) {
            $avail = $request->input('avail');
            if ($avail === 'instock') {
                $query->where('stock', '>', 0);
            } elseif ($avail === 'outofstock') {
                $query->where('stock', '<=', 0);
            }
        }

        // Discount Filter
        if ($request->filled('discount')) {
            $query->where('discount', '>=', $request->input('discount'));
        }

        // 4. Sorting
        $sort = $request->input('sort', 'newest');
        switch ($sort) {
            case 'price_asc':
            case 'price-asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
            case 'price-desc':
                $query->orderBy('price', 'desc');
                break;
            case 'rating-desc':
                $query->orderBy('rating', 'desc');
                break;
            case 'best-selling':
            case 'best_selling':
                $query->orderBy('reviews', 'desc');
                break;
            case 'discount-desc':
                $query->orderBy('discount', 'desc');
                break;
            case 'a-z':
                $query->orderBy('name', 'asc');
                break;
            case 'newest':
            default:
                $query->orderBy('id', 'desc');
                break;
        }

        // 5. Pagination
        $perPage = $request->input('per_page', 12);
        $products = $query->paginate($perPage);

        return ProductResource::collection($products);
    }

    /**
     * GET /api/products/{slugOrId}
     * Fetch single product details by slug or ID
     */
    public function show(string $slugOrId): JsonResponse
    {
        $query = Product::with(['vendor', 'brand', 'category', 'images', 'variants']);

        if (is_numeric($slugOrId)) {
            $product = $query->find($slugOrId);
        } else {
            $product = $query->where('slug', $slugOrId)->first();
        }

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new ProductResource($product)
        ]);
    }

    /**
     * GET /api/products/{slug}/related
     */
    public function related(string $slug): JsonResponse
    {
        $product = Product::where('slug', $slug)->first();

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found.'
            ], 404);
        }

        $related = Product::with(['vendor', 'brand', 'category', 'images', 'variants'])
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->limit(4)
            ->get();

        return response()->json([
            'success' => true,
            'data' => ProductResource::collection($related)
        ]);
    }

    /**
     * GET /api/products/{slug}/reviews
     */
    public function reviews(string $slug): JsonResponse
    {
        $product = Product::where('slug', $slug)->first();

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found.'
            ], 404);
        }

        $reviews = $product->reviews()->with('user')->orderBy('id', 'desc')->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $reviews->items(),
            'meta' => [
                'total' => $reviews->total(),
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'per_page' => $reviews->perPage()
            ]
        ]);
    }

    /**
     * GET /api/categories
     */
    public function categories(): JsonResponse
    {
        $categories = Category::all();
        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /**
     * GET /api/brands
     */
    public function brands(): JsonResponse
    {
        $brands = Brand::all();
        return response()->json([
            'success' => true,
            'data' => $brands
        ]);
    }

    /**
     * GET /api/vendors
     */
    public function vendors(): JsonResponse
    {
        $vendors = Vendor::where('status', 'active')->get();
        return response()->json([
            'success' => true,
            'data' => $vendors
        ]);
    }
}
