<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AddressService;

class AddressController extends Controller
{
    protected $addressService;

    public function __construct(AddressService $addressService)
    {
        $this->addressService = $addressService;
    }

    public function index(Request $request)
    {
        $addresses = $this->addressService->getAddresses($request->user());
        return response()->json([
            'success' => true,
            'data' => $addresses
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address_line_1' => 'required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'nullable|string|max:100',
            'landmark' => 'nullable|string|max:255',
            'is_default' => 'boolean'
        ]);

        $address = $this->addressService->createAddress($request->user(), $validated);

        return response()->json([
            'success' => true,
            'message' => 'Address created successfully',
            'data' => $address
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'full_name' => 'sometimes|required|string|max:255',
            'phone' => 'sometimes|required|string|max:20',
            'address_line_1' => 'sometimes|required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'sometimes|required|string|max:100',
            'state' => 'sometimes|required|string|max:100',
            'postal_code' => 'sometimes|required|string|max:20',
            'country' => 'nullable|string|max:100',
            'landmark' => 'nullable|string|max:255',
            'is_default' => 'boolean'
        ]);

        $address = $this->addressService->updateAddress($request->user(), $id, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Address updated successfully',
            'data' => $address
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $this->addressService->deleteAddress($request->user(), $id);

        return response()->json([
            'success' => true,
            'message' => 'Address deleted successfully'
        ]);
    }
}
