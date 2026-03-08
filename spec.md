# Specification

## Summary
**Goal:** Fix the admin dashboard route registration and accessibility issues to ensure the /admin route works correctly.

**Planned changes:**
- Verify and fix the /admin route registration in App.tsx TanStack Router configuration
- Ensure AdminDashboardPage component is properly imported with correct file path
- Test that navigating to /admin renders the AdminDashboardPage without 404 errors
- Verify the Admin navigation link in Layout.tsx routes correctly to /admin for admin users

**User-visible outcome:** Admin users can successfully navigate to the admin dashboard via the /admin URL and the Admin navigation link without encountering route errors.
