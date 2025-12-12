# Loading States Implementation

## Overview
Comprehensive loading states have been added across the ShopLite application to provide better user experience during API calls and asynchronous operations.

## Components Created

### 1. LoadingSpinner Component
**Location:** `src/components/LoadingSpinner.jsx`

A reusable spinner component with customizable sizes and messages.

**Usage:**
```jsx
import LoadingSpinner from '../components/LoadingSpinner';

<LoadingSpinner size="medium" message="Loading products..." />
```

**Sizes:** `small`, `medium`, `large`

---

### 2. SkeletonLoader Component
**Location:** `src/components/SkeletonLoader.jsx`

Multiple skeleton loader components for different UI elements:

- `ProductCardSkeleton` - Individual product card placeholder
- `ProductGridSkeleton` - Grid of product cards
- `ProductDetailsSkeleton` - Product details page
- `CartItemSkeleton` - Individual cart item
- `CartSkeleton` - Full cart page
- `OrderCardSkeleton` - Individual order card
- `OrderHistorySkeleton` - Order history page
- `TableRowSkeleton` - Admin table row
- `AdminTableSkeleton` - Admin dashboard table

**Usage:**
```jsx
import { ProductGridSkeleton } from '../components/SkeletonLoader';

{loading ? <ProductGridSkeleton count={8} /> : <ProductList />}
```

---

### 3. LoadingButton Component
**Location:** `src/components/LoadingButton.jsx`

A button component with built-in loading state and spinner.

**Usage:**
```jsx
import LoadingButton from '../components/LoadingButton';

<LoadingButton
  loading={isSubmitting}
  loadingText="Submitting..."
  className="bg-blue-600 text-white px-4 py-2 rounded"
  onClick={handleSubmit}
>
  Submit
</LoadingButton>
```

---

## Pages Updated

### 1. HomePage
**Loading State:** Product grid skeleton
- Shows 8 skeleton cards while fetching products
- Smooth transition to actual product cards
- Retry button on error

### 2. ProductPage
**Loading State:** Product details skeleton
- Full page skeleton with image and details placeholders
- "Add to Cart" button shows loading state with "Adding..." text
- Button is disabled during API call

### 3. CartPage
**Loading State:** Cart skeleton
- Shows skeleton for cart items, price summary, and buttons
- Updates and deletes show inline feedback

### 4. CheckoutPage
**Loading State:** Loading overlay + spinner
- Full-screen overlay with loading spinner during order processing
- Prevents user interaction while submitting
- Form inputs disabled during loading
- Submit button shows "Processing..." text

### 5. OrderHistoryPage
**Loading State:** Order history skeleton
- Shows 3 skeleton order cards
- Maintains page layout and header during loading

### 6. AdminDashboard
**Loading State:** Admin table skeleton
- Table structure with 5 skeleton rows
- Delete confirmation with loading state
- Delete button shows "Deleting..." during operation
- Buttons disabled during deletion

### 7. LoginPage & RegisterPage
**Loading States:** Button loading
- Login/Register buttons show loading text
- Form inputs disabled during submission
- "Logging in..." / "Registering..." feedback

### 8. ProfilePage
**Loading States:** Button loading
- Profile update shows loading state
- Password change shows loading state
- Form disabled during operations

### 9. AddProduct
**Loading States:** Form submission
- Submit button shows loading state
- "Creating..." or "Updating..." text
- Form disabled during operation

---

## Loading State Patterns

### Pattern 1: Skeleton Loaders (Recommended for Initial Page Load)
```jsx
if (loading) {
  return <ProductGridSkeleton count={8} />;
}
```

**Benefits:**
- Better perceived performance
- Shows content structure immediately
- More professional appearance

### Pattern 2: Centered Spinner (For Simple Loading)
```jsx
if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner message="Loading..." />
    </div>
  );
}
```

### Pattern 3: Inline Loading (For Button Actions)
```jsx
<button disabled={loading}>
  {loading ? 'Processing...' : 'Submit'}
</button>
```

### Pattern 4: Overlay Loading (For Blocking Operations)
```jsx
{loading && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-8">
      <LoadingSpinner size="large" message="Processing..." />
    </div>
  </div>
)}
```

---

## Best Practices

1. **Always disable interactive elements during loading**
   - Prevents duplicate submissions
   - Improves data integrity

2. **Provide clear feedback**
   - Use descriptive loading messages
   - Show what's happening ("Loading products...", "Processing order...")

3. **Use appropriate loading patterns**
   - Skeletons for content-heavy pages
   - Spinners for quick operations
   - Overlays for critical blocking operations

4. **Maintain layout consistency**
   - Skeletons maintain page structure
   - Prevents layout shifts
   - Better user experience

5. **Error handling**
   - Always hide loading state on error
   - Provide retry options
   - Show clear error messages

---

## Animation Classes (Tailwind)

All loading states use Tailwind's built-in animations:

- `animate-spin` - For spinners
- `animate-pulse` - For skeleton loaders

---

## Testing Checklist

✅ HomePage - Product grid loading
✅ ProductPage - Product details loading
✅ ProductPage - Add to cart button loading
✅ CartPage - Cart items loading
✅ CartPage - Update/remove actions
✅ CheckoutPage - Order submission overlay
✅ OrderHistoryPage - Orders loading
✅ AdminDashboard - Products table loading
✅ AdminDashboard - Delete confirmation loading
✅ LoginPage - Login button loading
✅ RegisterPage - Register button loading
✅ ProfilePage - Profile update loading
✅ AddProduct - Form submission loading

---

## Performance Considerations

1. **Skeleton loaders** provide better perceived performance than spinners
2. **Loading states** prevent duplicate API calls
3. **Disabled states** improve data integrity
4. **Optimistic UI updates** can be added for even faster perceived performance

---

## Future Enhancements

1. Add toast notifications for all loading operations
2. Implement optimistic UI updates for cart operations
3. Add progress bars for long-running operations
4. Implement request debouncing for search/filter operations
5. Add retry logic with exponential backoff
