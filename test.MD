# End-to-End Test Plan (Playwright)

Target: http://localhost:8080/login
Observed login UI: Title "Automation Tutorials", inputs for Email and Password, and a "Sign In" button with helper text "Sign in to access your testing environment".

Credentials for tests

- Email: automation@test.com
- Password: temp123

Test Case 1: Successful Login with Valid Credentials

- Purpose: Verify a user can authenticate and reach a protected area.
- Preconditions: App is running locally.
- Steps:
  1. Navigate to http://localhost:8080/login
  2. Enter Email: automation@test.com
  3. Enter Password: temp123
  4. Click "Sign In"
- Expected Results:
  - An authenticated UI element is visible (e.g., user menu/avatar or "Sign out")
  - Authentication storage (cookie/localStorage/sessionStorage) reflects a logged-in state

Test Case 2: Invalid Login Handling

- Purpose: Ensure incorrect credentials are rejected with clear feedback and no session is created.
- Preconditions: App is running locally.
- Steps:
  1. Navigate to http://localhost:8080/login
  2. Enter Email: automation@test.com
  3. Enter a wrong Password (e.g., temp1234)
  4. Click "Sign In"
- Expected Results:
  - User remains on the login page (no access to protected area)
  - An error/validation message displays (e.g., "Invalid credentials")

Test Case 3: Logout and Post-Logout Access Control

- Purpose: Validate session persistence across reload and proper termination via logout.
- Preconditions: App is running locally.
- Steps:
  1. Log in successfully using the valid credentials above
  2. Optionally refresh the page to confirm session persists
  3. Use the app's logout/sign-out control
  4. Attempt to navigate directly to the protected route (e.g., dashboard)
- Expected Results:
  - Before logout, user stays authenticated after reload and can access protected pages
  - After logout, user is redirected to the login page
