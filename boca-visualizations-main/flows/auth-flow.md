# Authentication Flow

This diagram shows the admin login flow with OTP (One-Time Password) verification.

**Route Path:** `GET /login` → `POST /custom-login` → `ANY /verify`  
**Controller:** `App\Http\Controllers\CustomAuthController`

## Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant CustomAuthController
    participant UserModel
    participant LocationModel
    participant OtpService
    participant Mailgun
    participant Session
    participant Auth
    
    User->>Browser: Navigate to /login
    Browser->>CustomAuthController: GET /login (index)
    CustomAuthController-->>Browser: Render login form (Blade view)
    
    User->>Browser: Enter credentials + submit
    Browser->>CustomAuthController: POST /custom-login
    CustomAuthController->>UserModel: Find user by email/username
    UserModel-->>CustomAuthController: User found
    
    CustomAuthController->>CustomAuthController: Generate random password + verification_code
    CustomAuthController->>UserModel: Update user (password, verification_code)
    CustomAuthController->>LocationModel: Get user's location (central DB: mysql)
    LocationModel-->>CustomAuthController: Location object (db_connection, mssqlip, etc.)
    
    alt SMS OTP
        CustomAuthController->>OtpService: sendPhoneSms() [⚠️ Uses hard-coded Mailgun key]
        OtpService->>Mailgun: Send SMS via Mailgun API
        Mailgun-->>User: SMS with verification code
    else Email OTP
        CustomAuthController->>CustomAuthController: Send email with verification code
    end
    
    CustomAuthController->>Session: Store login_token, fromLogin=true
    CustomAuthController-->>Browser: Redirect to /verify
    
    User->>Browser: Enter verification code
    Browser->>CustomAuthController: POST /verify (or GET with token)
    CustomAuthController->>UserModel: Verify code matches verification_code
    UserModel-->>CustomAuthController: Code valid
    
    CustomAuthController->>Auth: Auth::login($user)
    Auth->>Session: Create session, store user ID
    
    CustomAuthController->>LocationModel: Get location details (mysql connection)
    LocationModel-->>CustomAuthController: Location with db_connection
    
    CustomAuthController->>Session: Store session keys:<br/>- userLocation (Location object)<br/>- userLocationId<br/>- userFacility<br/>- sessionfacility<br/>- defaultlocationlist<br/>- login_token (cleared)
    
    CustomAuthController-->>Browser: Redirect to /admin/dashboard (or intended URL)
    Browser->>Browser: Admin dashboard loads (session auth active)
```

## Flow Summary

1. User navigates to `/login` and sees login form
2. User submits credentials via `/custom-login`
3. System generates OTP (verification code) and sends via SMS or email
4. User enters verification code at `/verify`
5. System validates code and creates session with `Auth::login($user)`
6. Session stores location/facility data for multi-DB connection selection
7. User redirected to `/admin/dashboard`

## Database Connections

- **User lookup**: Central DB (`mysql` connection)
- **Location lookup**: Central DB (`mysql` connection)
- **After login**: Tenant models use `session('userLocation')->db_connection`

## Security Note

⚠️ **Hard-coded Mailgun API key** in `CustomAuthController::sendPhoneSms()`. See [Security & Authentication](../security/security-auth.md) for remediation details.
