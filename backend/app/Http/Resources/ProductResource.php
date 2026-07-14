<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'sku' => $this->sku,
            'description' => $this->description,
            'thumbnail' => $this->thumbnail,
            'price' => $this->price,
            'sale_price' => $this->sale_price,
            'mrp' => $this->mrp,
            'discount' => $this->discount,
            'rating' => $this->rating,
            'reviews' => $this->reviews,
            'stock' => $this->stock,
            'featured' => $this->featured,
            'vendor' => $this->relationLoaded('vendor') && $this->vendor ? [
                'id' => $this->vendor->id,
                'store_name' => $this->vendor->store_name,
                'slug' => $this->vendor->slug,
                'rating' => $this->vendor->rating
            ] : null,
            'brand' => $this->relationLoaded('brand') && $this->brand ? [
                'id' => $this->brand->id,
                'name' => $this->brand->name,
                'slug' => $this->brand->slug
            ] : null,
            'category' => $this->relationLoaded('category') && $this->category ? [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug
            ] : null,
            'images' => $this->relationLoaded('images') ? $this->images->map(fn($img) => [
                'id' => $img->id,
                'image_url' => $img->image_url
            ]) : [],
            'variants' => $this->relationLoaded('variants') ? $this->variants->map(fn($var) => [
                'id' => $var->id,
                'name' => $var->name,
                'value' => $var->value,
                'price_override' => $var->price_override
            ]) : []
        ];
    }
}
