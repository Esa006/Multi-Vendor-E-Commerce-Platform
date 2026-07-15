<?php

namespace App\Services;

use App\Models\Address;
use App\Models\User;

class AddressService
{
    public function getAddresses(User $user)
    {
        return $user->addresses()->orderBy('is_default', 'desc')->get();
    }

    public function createAddress(User $user, array $data)
    {
        if ($data['is_default'] ?? false) {
            $user->addresses()->update(['is_default' => false]);
        }

        return $user->addresses()->create($data);
    }

    public function updateAddress(User $user, $id, array $data)
    {
        $address = $user->addresses()->findOrFail($id);

        if ($data['is_default'] ?? false) {
            $user->addresses()->update(['is_default' => false]);
        }

        $address->update($data);

        return $address;
    }

    public function deleteAddress(User $user, $id)
    {
        $address = $user->addresses()->findOrFail($id);
        $address->delete();

        return true;
    }
}
