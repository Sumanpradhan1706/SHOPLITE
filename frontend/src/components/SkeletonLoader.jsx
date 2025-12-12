// Skeleton base component
function SkeletonBase({ className = '' }) {
  return (
    <div className={`animate-pulse bg-gray-300 rounded ${className}`}></div>
  );
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <SkeletonBase className="w-full h-48" />
      <div className="p-4 space-y-3">
        <SkeletonBase className="h-6 w-3/4" />
        <SkeletonBase className="h-4 w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <SkeletonBase className="h-6 w-20" />
          <SkeletonBase className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
}

// Product Grid Skeleton
export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Product Details Skeleton
export function ProductDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SkeletonBase className="w-full h-96" />
            <div className="space-y-4">
              <SkeletonBase className="h-8 w-3/4" />
              <SkeletonBase className="h-6 w-24" />
              <SkeletonBase className="h-6 w-40" />
              <SkeletonBase className="h-12 w-32" />
              <SkeletonBase className="h-24 w-full" />
              <div className="flex gap-4 pt-4">
                <SkeletonBase className="h-12 w-20" />
                <SkeletonBase className="h-12 flex-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cart Item Skeleton
export function CartItemSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b pb-4">
      <SkeletonBase className="w-24 h-24 rounded" />
      <div className="flex-1 space-y-3">
        <SkeletonBase className="h-6 w-2/3" />
        <SkeletonBase className="h-5 w-24" />
      </div>
      <div className="space-y-3">
        <SkeletonBase className="h-10 w-32" />
        <SkeletonBase className="h-8 w-20" />
      </div>
    </div>
  );
}

// Cart Page Skeleton
export function CartSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <SkeletonBase className="h-8 w-48 mb-6" />
          <div className="space-y-4 mb-8">
            {[...Array(3)].map((_, i) => (
              <CartItemSkeleton key={i} />
            ))}
          </div>
          <div className="border-t pt-6">
            <div className="max-w-md ml-auto space-y-3">
              <SkeletonBase className="h-6 w-full" />
              <SkeletonBase className="h-6 w-full" />
              <SkeletonBase className="h-8 w-full" />
              <SkeletonBase className="h-12 w-full mt-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Order Card Skeleton
export function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <SkeletonBase className="h-6 w-32" />
          <SkeletonBase className="h-5 w-24" />
        </div>
        <SkeletonBase className="h-8 w-24" />
      </div>
      <div className="border-t pt-4 space-y-3">
        <SkeletonBase className="h-5 w-full" />
        <SkeletonBase className="h-5 w-3/4" />
      </div>
      <div className="flex justify-between items-center pt-4">
        <SkeletonBase className="h-6 w-24" />
        <SkeletonBase className="h-10 w-32" />
      </div>
    </div>
  );
}

// Order History Skeleton
export function OrderHistorySkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 6 }) {
  return (
    <tr className="border-b">
      {[...Array(columns)].map((_, i) => (
        <td key={i} className="px-6 py-4">
          <SkeletonBase className="h-5 w-full" />
        </td>
      ))}
    </tr>
  );
}

// Admin Dashboard Table Skeleton
export function AdminTableSkeleton({ rows = 5 }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold">Product Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Stock</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Rating</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((_, i) => (
            <TableRowSkeleton key={i} columns={6} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
