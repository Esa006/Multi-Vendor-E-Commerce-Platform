<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CheckoutService;
use App\Models\Order;

class OrderController extends Controller
{
    protected $checkoutService;

    public function __construct(CheckoutService $checkoutService)
    {
        $this->checkoutService = $checkoutService;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'address_id' => 'required|exists:addresses,id',
            'payment_method' => 'required|string|in:cod,card,upi',
        ]);

        $order = $this->checkoutService->placeOrder($request->user(), $validated);

        return response()->json([
            'success' => true,
            'message' => 'Order placed successfully',
            'data' => $order
        ]);
    }

    public function index(Request $request)
    {
        $orders = $this->checkoutService->getOrders($request->user());

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    public function show(Request $request, $orderNumber)
    {
        $order = Order::with(['items.product', 'address', 'payments'])
            ->where('order_number', $orderNumber)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }
}
