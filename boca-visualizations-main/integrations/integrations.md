# External Integrations

This document catalogs all external service integrations in the Boca 340B Insights application.

## Integration Overview Table

| Integration | Purpose | Evidence (File Paths) | Env/Config Keys | Notes/Failure Modes |
|-------------|---------|----------------------|-----------------|---------------------|
| **Mailgun** | Email sending, inbound email parsing, webhooks | `app/Http/Controllers/CustomAuthController.php` (sendPhoneSms), `app/Http/Controllers/MailgunWidgetsController.php`, `config/mail.php`, `config/services.php` | `MAILGUN_SECRET`, `MAILGUN_DOMAIN`, `MAILGUN_ENDPOINT` | ⚠️ Hard-coded key in CustomAuthController. Inbound email via BeyondCode Laravel Mailbox. Webhook endpoint: `/api/mailgun/widgets` |
| **Twilio** | SMS messaging via Botman driver | `config/botman.php` (if present), Botman Twilio driver, `app/Http/Controllers/Backend/CustomerSms/CustomerSmsController.php` | `TWILIO_SID`, `TWILIO_TOKEN`, `TWILIO_FROM` | Used for outbound SMS. Inbound webhooks: `/inbound_message`, `/inbound_status`. Status callbacks may not be validated. |
| **Botman** | Chatbot/messaging framework with Twilio driver | `composer.json` (botman/botman, botman/driver-twilio), `app/Http/Controllers/Backend/CustomerSms/` | Driver-specific (Twilio credentials) | Botman wraps Twilio for conversational SMS. May support WhatsApp via Twilio API. |
| **Vonage** | SMS/telephony client | `composer.json` (vonage/client), usage in services | `VONAGE_API_KEY`, `VONAGE_API_SECRET`, `VONAGE_FROM` | Alternative SMS provider. Similar API to Twilio. Check signature validation for webhooks. |
| **RingCentral** | Telephony/PBX integration via PHP SDK | `composer.json` (ringcentral/ringcentral-php), usage in services | `RINGCENTRAL_CLIENT_ID`, `RINGCENTRAL_CLIENT_SECRET`, `RINGCENTRAL_SERVER_URL` | Enterprise telephony integration. May handle call routing, voicemail, fax. |
| **FedEx** | Shipping integration, label generation, tracking | `app/FedExWebServices/`, `composer.json` (jeremy-dunn/php-fedex-api-wrapper), `app/Http/Controllers/Backend/Orders/OrdersController.php` (if shipping methods) | `FEDEX_KEY`, `FEDEX_PASSWORD`, `FEDEX_ACCOUNT_NUMBER`, `FEDEX_METER_NUMBER` | Uses FedEx Web Services SOAP API via wrapper. Generate shipping labels, track packages. Failure: Shipping delays if API down. |
| **Square** | Payment processing, point-of-sale (POS) | `composer.json` (square/square), usage in billing/payment controllers | `SQUARE_APPLICATION_ID`, `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`, `SQUARE_ENVIRONMENT` | Process payments, refunds, manage transactions. Failure: Payment processing unavailable if API down. |
| **GeoIP** | IP-based geolocation | `composer.json` (torann/geoip), usage in middleware/services | `GEOIP_ENABLED` (optional) | Detect user location from IP. May be used for location-based routing or analytics. |
| **DomPDF** | PDF generation (HTML to PDF) | `composer.json` (dompdf/dompdf), usage in reports/invoices | No specific env keys | Generate PDFs from HTML/Blade templates. Reports, invoices, statements. Failure: PDF generation fails if library issues. |
| **TCPDF** | PDF generation (alternative to DomPDF) | `composer.json` (tecnickcom/tcpdf), usage in reports | No specific env keys | Alternative PDF library. May be used for specific PDF formats. |
| **spatie/pdf-to-text** | Extract text from PDFs | `composer.json` (spatie/pdf-to-text) | No specific env keys | Extract text content from uploaded PDF documents. May be used for document processing. |
| **maatwebsite/excel** | Excel file import/export | `composer.json` (maatwebsite/excel), usage in reports/imports | No specific env keys | Export data to Excel, import from Excel. Reports, data migration. Failure: Large files may timeout. |
| **echarts-php** | Chart/graph generation (PHP wrapper for ECharts) | `composer.json` (echarts-php/echarts-php), usage in reports/dashboards | No specific env keys | Generate charts for dashboards/reports. Server-side chart rendering. |
| **Scribe** | API documentation generation | `composer.json` (knuckleswtf/scribe), `config/scribe.php` (if present) | No API keys required | Auto-generate API documentation from route annotations. Access via `/docs` or `/api-docs` endpoint. |
| **BeyondCode Laravel Mailbox** | Inbound email processing | `composer.json` (beyondcode/laravel-mailbox), routes/config | Mailgun inbound email webhook config | Process inbound emails, parse attachments, trigger actions. Integrated with Mailgun inbound email webhooks. |

---

## Detailed Integration Descriptions

### 1. Mailgun (Email + SMS)

**Purpose:**
- **Outbound Email**: Send transactional emails (notifications, OTP codes)
- **Inbound Email**: Process incoming emails via webhooks (BeyondCode Laravel Mailbox)
- **SMS**: Send SMS messages (via Mailgun SMS API) - used in `CustomAuthController::sendPhoneSms()`

**Environment Variables:**
```env
MAILGUN_SECRET=key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MAILGUN_DOMAIN=mg.example.com
MAILGUN_ENDPOINT=https://api.mailgun.net (or EU endpoint)
MAIL_MAILER=mailgun
```

**Failure Modes:**
- **API Downtime**: Email/SMS delivery fails, no retry mechanism (may need queue)
- **Invalid API Key**: Authentication errors, check env configuration
- **Rate Limiting**: Too many requests, implement exponential backoff
- **Webhook Signature Mismatch**: Webhooks rejected if signature validation fails

**Security Notes:**
- ⚠️ **Hard-coded API key** in `CustomAuthController::sendPhoneSms()` - See [Security & Authentication](../security/security-auth.md)
- Webhook signature validation implemented via `ValidateMailgunWebhook` middleware

---

### 2. Twilio (SMS via Botman)

**Purpose:**
- **Outbound SMS**: Send SMS messages via Twilio API
- **Inbound SMS**: Receive SMS messages via webhooks
- **WhatsApp**: May support WhatsApp messaging via Twilio API

**Environment Variables:**
```env
TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_FROM=+1234567890
```

**Failure Modes:**
- **Invalid Credentials**: Check `TWILIO_SID` and `TWILIO_TOKEN`
- **Insufficient Balance**: Twilio account needs sufficient credits
- **Webhook Timeout**: Long-running webhook handlers may timeout
- **Unvalidated Webhooks**: Inbound SMS webhooks may not validate signatures (security risk)

---

### 3. Vonage (SMS/Telephony)

**Purpose:**
- Alternative SMS provider (similar to Twilio)
- Voice/telephony services (if configured)

**Environment Variables:**
```env
VONAGE_API_KEY=xxxxxxxx
VONAGE_API_SECRET=xxxxxxxx
VONAGE_FROM=+1234567890
```

**Failure Modes:**
- **API Key Issues**: Invalid credentials prevent SMS delivery
- **Network Issues**: Timeout if Vonage API is unreachable

---

### 4. RingCentral (Telephony)

**Purpose:**
- Enterprise telephony/PBX integration
- Call routing, voicemail, fax services

**Environment Variables:**
```env
RINGCENTRAL_CLIENT_ID=xxxxxxxx
RINGCENTRAL_CLIENT_SECRET=xxxxxxxx
RINGCENTRAL_SERVER_URL=https://platform.devtest.ringcentral.com (sandbox) or https://platform.ringcentral.com (production)
```

**Failure Modes:**
- **OAuth Token Expiry**: RingCentral uses OAuth 2.0, tokens may expire
- **API Rate Limits**: Enterprise API has rate limits

---

### 5. FedEx (Shipping)

**Purpose:**
- Generate shipping labels
- Track packages
- Calculate shipping rates
- Validate addresses

**Environment Variables:**
```env
FEDEX_KEY=xxxxxxxx
FEDEX_PASSWORD=xxxxxxxx
FEDEX_ACCOUNT_NUMBER=xxxxxxxx
FEDEX_METER_NUMBER=xxxxxxxx
FEDEX_ENVIRONMENT=sandbox (or production)
```

**Configuration:**
- FedEx Web Services uses SOAP API
- Wrapper library: `jeremy-dunn/php-fedex-api-wrapper`
- Custom wrapper: `app/FedExWebServices/`

**Failure Modes:**
- **API Downtime**: Shipping label generation fails, orders cannot ship
- **Invalid Credentials**: Authentication errors
- **SOAP Errors**: FedEx SOAP API may return validation errors for invalid addresses
- **Rate Calculation Failures**: Shipping cost calculation may fail for international addresses

---

### 6. Square (Payments)

**Purpose:**
- Process credit card payments
- Handle refunds
- Manage transactions
- Point-of-sale (POS) integration

**Environment Variables:**
```env
SQUARE_APPLICATION_ID=xxxxxxxx
SQUARE_ACCESS_TOKEN=xxxxxxxx
SQUARE_LOCATION_ID=xxxxxxxx
SQUARE_ENVIRONMENT=sandbox (or production)
```

**Failure Modes:**
- **Payment Processing Down**: Cannot process payments if Square API is unavailable
- **Card Declined**: Handled by Square, but requires error handling in code
- **Webhook Failures**: Payment webhooks may fail if endpoint is unreachable
- **PCI Compliance**: Ensure PCI-DSS compliance when handling card data

---

### 7. GeoIP (Geolocation)

**Purpose:**
- Detect user location from IP address
- Location-based routing or content

**Environment Variables:**
- Optional: `GEOIP_ENABLED=true`
- GeoIP database files (MaxMind) may be required

**Failure Modes:**
- **Database Missing**: GeoIP requires MaxMind database files
- **IP Not Found**: Returns null for unknown IPs

---

### 8. PDF Generation (DomPDF/TCPDF)

**Purpose:**
- Generate PDF documents from HTML/Blade templates
- Reports, invoices, statements, forms

**Failure Modes:**
- **Memory Issues**: Large PDFs may exhaust PHP memory
- **Font Issues**: Missing fonts cause rendering failures
- **Timeout**: Complex PDFs may timeout on slow servers

---

### 9. Excel Export/Import (maatwebsite/excel)

**Purpose:**
- Export data to Excel files (reports, exports)
- Import data from Excel (bulk uploads, migrations)

**Failure Modes:**
- **Large Files**: Excel files with many rows may timeout
- **Memory Issues**: Large imports may exhaust PHP memory
- **Invalid Format**: Invalid Excel files cause import errors

---

### 10. Chart Generation (echarts-php)

**Purpose:**
- Generate charts/graphs server-side for dashboards/reports
- Wrapper for ECharts JavaScript library

**Failure Modes:**
- **Rendering Issues**: Complex charts may fail to render
- **Data Format Errors**: Invalid data format causes chart errors

---

### 11. API Documentation (Scribe)

**Purpose:**
- Auto-generate API documentation from route annotations
- Interactive API documentation (Swagger-like)

**Access:**
- Documentation endpoint: `/docs` or `/api-docs` (check routes)

**Failure Modes:**
- **Missing Annotations**: Routes without annotations may not appear in docs
- **Configuration Issues**: Incorrect config may cause generation errors

---

## Integration Failure Handling Recommendations

### 1. Implement Retry Logic

For external API calls (Mailgun, Twilio, Square, FedEx):
- Implement exponential backoff retry mechanism
- Retry up to 3 times with increasing delay

### 2. Queue Long-Running Operations

Use Laravel queues for:
- Email sending (Mailgun)
- SMS sending (Twilio/Vonage)
- PDF generation (DomPDF/TCPDF)
- Excel exports (maatwebsite/excel)

### 3. Implement Fallback Mechanisms

- **SMS Providers**: Fallback from Twilio → Vonage → RingCentral if one fails
- **PDF Libraries**: Fallback from DomPDF → TCPDF if one fails

### 4. Monitor API Health

- Set up alerts for API failures
- Log all external API calls
- Track API response times

---

## Key Takeaways

✅ **Email**: Mailgun for outbound/inbound email, BeyondCode Laravel Mailbox for processing  
✅ **SMS**: Twilio (via Botman), Vonage, RingCentral (multiple providers)  
✅ **Shipping**: FedEx Web Services via `jeremy-dunn/php-fedex-api-wrapper`  
✅ **Payments**: Square SDK for payment processing  
✅ **Reporting**: DomPDF/TCPDF (PDF), maatwebsite/excel (Excel), echarts-php (charts)  
✅ **Documentation**: Scribe for API docs  
⚠️ **Security**: Hard-coded Mailgun key in `CustomAuthController` (see [Security & Authentication](../security/security-auth.md))  
⚠️ **Webhooks**: Verify signature validation for SMS webhooks (Twilio/Vonage/RingCentral)
