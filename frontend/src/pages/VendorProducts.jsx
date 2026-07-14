import React from 'react';
import { useVendor } from '../context/VendorContext';
import { Trash2, AlertTriangle } from 'lucide-react';

const VendorProducts = () => {
  const { products, loading } = useVendor();

  if (loading) return <div className="py-20 text-center">Loading inventory...</div>;

  return (
    <div className="space-y-lg">
      <div className="flex justify-between items-center">
        <h3 className="font-display text-title-lg text-on-surface font-bold">My Products</h3>
        <span className="text-sm text-on-surface-variant font-semibold">{products.length} Products Total</span>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-variant text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                <th className="py-3 font-semibold">Image</th>
                <th className="py-3 font-semibold">Product Name</th>
                <th className="py-3 font-semibold">Price</th>
                <th className="py-3 font-semibold">Stock Status</th>
                <th className="py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body text-body-md">
              {products.map((prod, idx) => (
                <tr key={idx} className="border-b border-surface-variant/40 hover:bg-surface-container-low/50 transition-colors last:border-b-0">
                  <td className="py-3">
                    <img
                      className="w-12 h-12 object-contain rounded-lg border border-outline-variant/30 bg-surface-container-low"
                      src={prod.images[0]}
                      alt="error"
                    />
                  </td>
                  <td className="py-3">
                    <p className="font-bold text-on-surface line-clamp-1">{prod.title}</p>
                    <p className="text-xs text-on-surface-variant capitalize">{prod.category}</p>
                  </td>
                  <td className="py-3 font-bold text-on-surface">${prod.price.toFixed(2)}</td>
                  <td className="py-3">
                    {prod.stockCount > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/20">
                        {prod.stockCount} in stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-error/10 text-error border border-error/20 gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Out of stock
                      </span>
                    )}
                  </td>
                  <td className="py-3">
                    <button className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-full transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorProducts;
