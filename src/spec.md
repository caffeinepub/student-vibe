# Specification

## Summary
**Goal:** Add a student profile customization page where users can view and edit their personal information and academic details.

**Planned changes:**
- Create a new /profile route with a dedicated profile page
- Add navigation link to profile page in the header menu
- Implement editable form with fields for name, email, college, bio, year of study, and department
- Enhance backend UserProfile type to support optional bio, year, and department fields
- Update profile save/get methods to handle new customizable fields
- Add form validation and success messaging

**User-visible outcome:** Students can navigate to their profile page, view their current information, and update their name, email, college details, bio, year of study, and department. Changes are saved and reflected immediately.
