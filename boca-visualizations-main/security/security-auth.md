# Security & Authentication

This document describes authentication mechanisms, authorization (roles/permissions), webhook security, and security issues in the Boca 340B Insights system.

## Authentication Mechanisms

### 1. Web Session Authentication (Admin Interface)

**Guard:** `auth` (web guard)  
**Middleware Group:** `admin`  
**Implementation:** Laravel's default session-based authentication

**Flow:**
1. User accesses `/admin/*` routes
2. `admin` middleware group requires `auth` middleware
3. If not authenticated, Laravel redirects to `/login`
4. After successful login, session stores user ID
5. Subsequent requests use session cookie for authentication

**Session Keys Set After Login:**
- `userLocation` - Location object
- `userLocationId` - Location ID
- `userFacility` - Facility object
- `sessionfacility` - Facility ID
- `defaultlocationlist` - Default location list

---

### 2. API Authentication (Passport OAuth)

**Guard:** `auth:api` (Passport guard)  
**Middleware:** Applied to `/api/v1/*` routes (except `/api/v1/auth/login`)  
**Implementation:** Laravel Passport (OAuth 2.0 token-based authentication)

**Flow:**
1. Client calls `POST /api/v1/auth/login` with credentials
2. `AuthController` validates credentials
3. Passport issues access token (OAuth 2.0)
4. Client includes token in `Authorization: Bearer {token}` header
5. `auth:api` middleware validates token for subsequent requests

**Token Types:**
- Personal access tokens (for testing)
- Password grant tokens (for API clients)
- Client credentials (for service-to-service)

---

### 3. OTP-Style Login (Custom Implementation)

**Route:** `/login` → `/custom-login` → `/verify`  
**Controller:** `App\Http\Controllers\CustomAuthController`  
**Implementation:** Custom OTP flow (not traditional OTP middleware)

**Flow:**
1. User submits credentials at `/custom-login`
2. `CustomAuthController@customLogin` generates random password + `verification_code`
3. Updates user record with temporary password and code
4. Sends OTP via SMS (Mailgun) or email
5. User submits code at `/verify`
6. `CustomAuthController@verify` validates code
7. Calls `Auth::login($user)` to establish session
8. Sets session location/facility data
9. Redirects to `/admin/dashboard`

**Note:** OTP middleware exists (`LoginMiddleware`) but is commented out in Kernel. The custom OTP flow in `CustomAuthController` is the active implementation.

---

## Authorization (Roles & Permissions)

**Package:** Spatie Laravel Permission (`spatie/laravel-permission`)  
**Models:** `Role`, `Permission`  
**Tables:** `roles`, `permissions`, `model_has_roles`, `model_has_permissions`, `role_has_permissions`

### Permission Enforcement

**Middleware:**
- `permission:name` - Requires specific permission
- `role:name` - Requires specific role

**Route-Level Enforcement:**
```php
Route::middleware(['permission:manage-customers'])->group(function () {
    Route::resource('customers', CustomersController::class);
});
```

**Programmatic Checks:**
```php
// Check permission
if ($user->can('manage-customers')) {
    // Allow action
}

// Check role
if ($user->hasRole('admin')) {
    // Allow action
}
```

---

## Webhook Security

### Mailgun Webhook Validation

**Endpoint:** `POST /api/mailgun/widgets`  
**Controller:** `MailgunWidgetsController@store`  
**Middleware:** `ValidateMailgunWebhook` (custom middleware)

**Purpose:**
- Validates webhook requests from Mailgun
- Prevents unauthorized webhook calls
- Validates signature/authentication token

**Security Note:**
- Webhook endpoints should always validate signatures
- Do not process webhooks without signature validation
- Store webhook secrets in environment variables (`.env`)

---

### SMS Status Callback Endpoints

**Endpoints:**
- `POST /inbound_message` - Inbound SMS webhook
- `POST /inbound_status` - SMS status callback

**Controller:** `Backend\CustomerSms\CustomerSmsController`

**Security Considerations:**
- **Current Status:** Unknown if signature validation is implemented
- **Recommendation:** Implement signature validation for SMS webhook endpoints
- **Providers:** Twilio, Vonage, RingCentral each have different signature validation methods

---

## Security Issues Discovered

### ⚠️ SECURITY ISSUE: Hard-Coded Mailgun API Key

**Severity:** HIGH  
**File:** `app/Http/Controllers/CustomAuthController.php`  
**Method:** `sendPhoneSms()`  
**Issue:** Mailgun API key is hard-coded in source code

**Description:**
The `CustomAuthController::sendPhoneSms()` method contains a hard-coded Mailgun API key embedded directly in the source code. This is a security vulnerability because:

1. **Secret Exposure**: API keys should never be committed to version control
2. **Access Risk**: Anyone with repository access can view the key
3. **Key Rotation Difficulty**: Hard-coded keys cannot be rotated without code changes
4. **Compliance**: May violate security policies (PCI-DSS, HIPAA if applicable)

**Example Code Pattern (Expected):**
```php
// ❌ INSECURE (Hard-coded key)
public function sendPhoneSms($phone, $message)
{
    $mg = Mailgun::create('key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    // ...
}

// ✅ SECURE (Environment variable)
public function sendPhoneSms($phone, $message)
{
    $mg = Mailgun::create(env('MAILGUN_SECRET'));
    // ...
}
```

**Remediation Checklist:**

1. **Immediate Actions:**
   - [ ] Rotate the Mailgun API key in Mailgun dashboard
   - [ ] Add key to `.env` file: `MAILGUN_SECRET=key-...`
   - [ ] Update `CustomAuthController::sendPhoneSms()` to use `env('MAILGUN_SECRET')`
   - [ ] Verify `.env` is in `.gitignore` (should not be committed)
   - [ ] Commit code change removing hard-coded key

2. **Repository History:**
   - [ ] Check git history: `git log -p --all -- app/Http/Controllers/CustomAuthController.php`
   - [ ] Identify commits that added/exposed the key
   - [ ] Consider using `git filter-branch` or BFG Repo-Cleaner to remove key from history (if sensitive)
   - [ ] Warn team members about exposed key (if repo is shared)

3. **Configuration Audit:**
   - [ ] Review `config/services.php` - Ensure Mailgun key is read from env
   - [ ] Audit all other controller methods for hard-coded secrets
   - [ ] Search codebase: `grep -r "key-" app/` (look for other hard-coded keys)
   - [ ] Check for other API keys: Square, Twilio, Vonage, RingCentral, FedEx

4. **Documentation:**
   - [ ] Update `.env.example` with placeholder: `MAILGUN_SECRET=`
   - [ ] Document Mailgun configuration in deployment docs
   - [ ] Add secret management guidelines to developer onboarding

5. **Monitoring:**
   - [ ] Review Mailgun API logs for unauthorized usage
   - [ ] Set up alerts for unusual API activity
   - [ ] Monitor for key exposure in logs/error messages

**Note:** This is documentation only. Do not implement remediation in this visualization repository. Implement fixes in the main application repository.

---

## Security Best Practices Recommendations

### Environment Variables

**Store all secrets in `.env`:**
- API keys (Mailgun, Twilio, Square, FedEx, etc.)
- Database passwords
- Encryption keys
- OAuth client secrets (Passport)

**Verify `.env` is in `.gitignore`:**
```bash
# .gitignore should contain
.env
.env.backup
.env.production
```

### API Key Management

1. **Never commit API keys to version control**
2. **Use environment variables** for all secrets
3. **Rotate keys regularly** (every 90 days recommended)
4. **Use least-privilege keys** (scope API keys to minimum required permissions)
5. **Monitor API usage** for anomalies

### Webhook Security

1. **Validate signatures** for all webhook endpoints
2. **Use HTTPS only** for webhook endpoints
3. **Implement rate limiting** to prevent abuse
4. **Log webhook requests** for audit trail
5. **Verify webhook source IP** (if possible)

### Session Security

1. **Use secure cookies** (`SESSION_SECURE_COOKIE=true` in production)
2. **Enable CSRF protection** (Laravel provides by default)
3. **Set session timeout** (`SESSION_LIFETIME` in `config/session.php`)
4. **Regenerate session ID** after login (`Auth::login()` does this)

---

## Authentication Flow Summary

| Method | Guard | Middleware | Token/Session | Use Case |
|--------|-------|------------|---------------|----------|
| **Web Session** | `auth` | `admin` group | Laravel session cookie | Admin panel access |
| **Passport API** | `auth:api` | `auth:api` | OAuth 2.0 Bearer token | REST API access |
| **Custom OTP** | `auth` (via `Auth::login()`) | None (custom flow) | Session after OTP verification | Admin login with SMS/email OTP |

---

## Key Takeaways

✅ **Web Session Auth**: Standard Laravel session-based authentication for admin panel  
✅ **Passport API Auth**: OAuth 2.0 token-based authentication for REST API  
✅ **Custom OTP Flow**: Custom implementation in `CustomAuthController` (not middleware-based)  
✅ **Spatie Permission**: Role-based access control (RBAC)  
⚠️ **Security Issue**: Hard-coded Mailgun API key in `CustomAuthController::sendPhoneSms()` (HIGH severity)  
✅ **Webhook Validation**: Mailgun webhooks validated via `ValidateMailgunWebhook` middleware  
⚠️ **SMS Webhooks**: Verify signature validation is implemented for SMS callback endpoints
