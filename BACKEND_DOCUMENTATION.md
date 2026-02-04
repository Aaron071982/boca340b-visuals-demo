# Boca Backend — Repo-Accurate Documentation

**Generated:** Factual extraction only. No inferred endpoints, tables, or improvements.

---

## Localhost & Running the Stack

| Component | Localhost URL | How to Run | Notes |
|-----------|---------------|------------|--------|
| **Visual-demo (Next.js)** | **http://localhost:3000** | `cd visual-demo/frontend && npm run dev` | Running. Network: http://192.168.1.28:3000 |
| **Laravel backend** | **http://127.0.0.1:8000** | `cd boca340binsights.com-main && composer install && php artisan serve` | **UNRESOLVED — REQUIRES HUMAN REVIEW:** `composer install` fails on PHP 8.5.2 (lock file expects PHP ~8.0–8.2). No `.env` in repo; copy `.env.example` → `.env`, set DB, run `php artisan key:generate`, `php artisan migrate`, `php artisan passport:install`, `php artisan db:seed` per readme.md. |

---

## A. Entry Point Index (Table)

All backend entry points from `routes/web.php`, `routes/api.php`, and `routes/backend/*.php`. Backend routes are under `Route::group(['namespace' => 'Backend', 'prefix' => 'admin', 'as' => 'admin.', 'middleware' => 'admin'], …)` (prefix `admin`, middleware `admin` = auth).

### HTTP / API (web.php — public or custom auth)

| Entry Type | Path/Trigger | HTTP Method(s) | Handler | Middleware | Auth | File Path |
|------------|--------------|----------------|---------|------------|------|-----------|
| HTTP | clear-cache | GET | Closure (Artisan::call optimize:clear) | (default web) | Public | routes/web.php:13 |
| HTTP | inbound_message/ | POST | Backend\CustomerSms\CustomerSmsController@inbound_message | (default) | Public | routes/web.php:44 |
| HTTP | inbound_status/ | POST | Backend\CustomerSms\CustomerSmsController@inbound_status | (default) | Public | routes/web.php:45 |
| HTTP | privacy | GET | Backend\DashboardController@terms | (default) | Public | routes/web.php:46 |
| HTTP | /token | POST | AccessTokenController@issueToken | throttle | Public | routes/web.php:50-54 |
| HTTP | /authorize | GET | AuthorizationController@authorize | web | Public | routes/web.php:56-60 |
| HTTP | /token/refresh | POST | TransientTokenController@refresh | web, auth | Authenticated | routes/web.php:64-67 |
| HTTP | /authorize | POST | ApproveAuthorizationController@approve | web, auth | Authenticated | routes/web.php:69-72 |
| HTTP | /authorize | DELETE | DenyAuthorizationController@deny | web, auth | Authenticated | routes/web.php:74-77 |
| HTTP | /tokens | GET | AuthorizedAccessTokenController@forUser | web, auth | Authenticated | routes/web.php:79-82 |
| HTTP | /tokens/{token_id} | DELETE | AuthorizedAccessTokenController@destroy | web, auth | Authenticated | routes/web.php:84-87 |
| HTTP | /clients | GET, POST | ClientController@forUser, @store | web, auth | Authenticated | routes/web.php:89-106 |
| HTTP | /clients/{client_id} | PUT, DELETE | ClientController@update, @destroy | web, auth | Authenticated | routes/web.php:98-106 |
| HTTP | /scopes | GET | ScopeController@all | web, auth | Authenticated | routes/web.php:108-111 |
| HTTP | /personal-access-tokens | GET, POST, DELETE | PersonalAccessTokenController@* | web, auth | Authenticated | routes/web.php:113-126 |
| HTTP | lang/{lang} | GET | LanguageController@swap | (default) | Public | routes/web.php:131 |
| HTTP | login | GET | CustomAuthController@index | (default) | Public | routes/web.php:158 |
| HTTP | custom-login | POST | CustomAuthController@customLogin | (default) | Public | routes/web.php:159 |
| HTTP | verify | ANY | CustomAuthController@verify | (default) | Public | routes/web.php:160 |
| HTTP | shiftlocation | POST | CustomAuthController@shiftlocation | (default) | Public | routes/web.php:161 |
| HTTP | shiftfacility | POST | CustomAuthController@shiftfacility | (default) | Public | routes/web.php:162 |
| HTTP | globaldata | POST | Backend\Customers\CustomersController@globaldata | (default) | Public | routes/web.php:163 |
| HTTP | removeglobaldata | POST | Backend\Customers\CustomersController@removeglobaldata | (default) | Public | routes/web.php:164 |
| HTTP | switchback | ANY | CustomAuthController@switchback | (default) | Public | routes/web.php:165 |
| HTTP | rxnewupdate | GET | Backend\CronController@rxnewupdate | (default) | Public | routes/web.php:166 |
| HTTP | micropatientupdate | ANY | Backend\Customers\CustomersController@patientcronupdate | (default) | Public | routes/web.php:168 |
| HTTP | signdocumentsingle | GET | Backend\CronController@signdocumentsingle | (default) | Public | routes/web.php:169 |
| HTTP | orderdateimport | GET | Backend\CronController@orderdateimport | (default) | Public | routes/web.php:170 |
| HTTP | fillFilldates | GET | Backend\DashboardController@fillFilldates | (default) | Public | routes/web.php:171 |
| HTTP | /visualizations/events | GET | VisualizationController@streamEvents | global (VisualizationMiddleware) | Public | routes/web.php:175 |
| HTTP | /visualizations/events/json | GET | VisualizationController@getEvents | global (VisualizationMiddleware) | Public | routes/web.php:176 |
| HTTP | (frontend) | (included) | frontend/* | (from frontend group) | Varies | routes/web.php:140, frontend/home.php |
| HTTP | (admin) | (included) | backend/* | admin (auth) | Authenticated | routes/web.php:176-180, routes/backend/*.php |

### Backend admin routes (prefix: admin, middleware: admin = auth)

All below are under `admin` prefix and `admin` middleware (auth). Handler namespace: `Backend\<Module>\*`.

| Path (under /admin) | Method(s) | Handler / Resource | Route File |
|---------------------|-----------|--------------------|------------|
| / | GET | Redirect 301 → /admin/dashboard | routes/backend/admin.php:4 |
| auth/user/get | POST | UserTableController | routes/backend/auth.php |
| auth/user/deactivated, deleted, index, create, store, show, edit, update, destroy, mark, confirm, unconfirm, password/change, login-as, clear-session, delete-permanently, restore, account/confirm/resend, social/unlink | GET/POST/PATCH/DELETE | UserController, UserStatusController, UserConfirmationController, UserPasswordController, UserSessionController, UserSocialController, UserAccessController | routes/backend/auth.php |
| auth/role, role/get | GET/POST/PATCH/DELETE | RoleController, RoleTableController | routes/backend/auth.php |
| auth/permission, permission/get | Resource + POST | PermissionsController, PermissionTableController | routes/backend/auth.php |
| dashboard, ccdgetrxdata, trackcheck, settings, help, pharmacyinfod, ccdgetsmsdata, ccdgetescalationdata, getrxdatamssql, ccdgetnotesdata, ccdgetbilldata, getdates, get-permission, ccdashboard, ccdashboard_report, newrxclientlist, ccdashboardsms, dashboardsettings, profileupload, dashboardupdatesettings, addusersettings, editusersettings, viewuser | GET/POST/ANY | DashboardController, SupportController | routes/backend/Dashboard.php |
| pages/*, pages/get | Resource + POST | PagesController, PagesTableController | routes/backend/Pages.php |
| orders/*, orders/get, orders/items/{oid}, itemsreceived, itemsReceivedQnt | Resource + ANY/GET/POST | OrdersController, OrdersTableController | routes/backend/Orders.php |
| denomination/*, denomination/get | Resource + ANY | DenominationController, DenominationTableController | routes/backend/Denomination.php |
| billing/*, billing/get | Resource + ANY | BillingController, BillingTableController | routes/backend/Billing.php |
| blogs/*, blogs/get | Resource + ANY | BlogsController, BlogsTableController | routes/backend/Blogs.php |
| productquantity/*, productQntUpdate, getproductsbylocation | Index + ANY/POST | ProductQuantityController, ProductQuantityTableController | routes/backend/ProductQuantity.php |
| enrolment/*, enrolment/get | Resource + ANY | EnrollmentPatientController, EnrollmentPatientTableController | routes/backend/EnrollmentPatient.php |
| pdforms/*, download_pdf, getPatientDetails, getpdformlist, customerpdformcreate, sendpdformstore, customerpdformedit, sendpdformupdate | Resource + ANY/GET/POST/PATCH | PdformsController, PdformsTableController | routes/backend/Pdform.php |
| customercontacts/*, getsmslist | Resource + ANY | CustomerContactsController, CustomerContactsTableController | routes/backend/CustomerContact.php |
| product-tags/*, product-tags/get | Resource + POST | ProductTagsController, ProductTagsTableController | routes/backend/ProductTags.php |
| reassess/*, download_pdf, getPatientDetails, getreassesslist, customerreassesscreate, sendreassessstore, customerreassessedit, sendreassessupdate | Resource + ANY/GET/POST/PATCH | ReassessController, ReassessTableController | routes/backend/Reassess.php |
| drugs/*, drugs/get | Resource + POST | DrugsController, DrugsTableController | routes/backend/Drugs.php |
| customerwhatsapp/* (many actions: customersmscreate, sendsmsstore, get, getsmslist, getphonelogs, receiveSms, getsms, smsdashboard, whatsappdashboard, getCustomerwithwhatsapp, whatsappsystemupdate, getsmstemplate, refresh_cust, sendBatchSigLink) | Resource + ANY | CustomerWhatsappController, CustomerWhatsappTableController | routes/backend/CustomerWhatsapp.php |
| surveys/*, survey/makecall, survey/sendsmssurvey | Resource + ANY | SurveysController, SurveysTableController | routes/backend/Surveys.php |
| email-outbox/*, email-inbox, email-inbox/get, searchtoaddressajax, attachdownload | Resource + GET/POST/ANY | EmailOutboxController, EmailOutboxTableController, EmailOutboxTable2Controller | routes/backend/EmailOutbox.php |
| careplan/*, download_pdf, getPatientDetails, getcareplanlist, customercareplancreate, sendcareplanstore, customercareplanedit, sendcareplanupdate | Resource + ANY | CareplanController, CareplanTableController | routes/backend/Careplan.php |
| smstemplates/*, sendsms, postsendsms, smsdashboard, searchcust | Resource + POST/ANY | SmsTemplatesController, SmsTemplatesTableController | routes/backend/SmsTemplates.php |
| facilities/*, facilities_view_report, shipping_view_report, shipping_forecast, getrxdatabyid, getrxdatamssqldata | Resource + POST/ANY | FacilitiesController, FacilitiesTableController | routes/backend/Facilities.php |
| menus/*, menus/get | Resource + ANY | MenuController, MenuTableController | routes/backend/Menus.php |
| locations/*, pharmacyinfo, getpatients, billingByfacility, locations/get, squareuplocation/{id}, squareupcreate, squareupstore | Resource + ANY/POST/GET | LocationsController, SquareupLocationsController, LocationsTableController | routes/backend/Locations.php |
| fridgelog/*, fridgelog/get, exportlog | Resource + ANY | FridgelogController, FridgelogTableController | routes/backend/Fridgelog.php |
| customers/* (large set: patients/get, getsig, getdeliveryslips, getdeliveryslip, getrefillableaob, getafricanservicecommittee, patientupdate, patientsignatureself, patientshow, reasontab, patientupdateself, facilityCustomers, rxnewpatients, client/patients, clientsdashboard, newpatients, lostpatients, getFactilityLocations, orders, getorders, getitems, getCustomerRx, getCustomerRxhistory, getcustomerorderdata, getcustomerorderdatah, getcustomerdata, getadditionaldata, getrxdocslist, getrxshippingdocslist, getCustomerRxDownload, getcustomermails, loadata, rxdashboard, getsigndocs, getcustomsigndocs, refreshrxdashboard, deliveryslip, generaterxpdf, customersearch, submitcustomersearch, ascsdata) | Resource + GET/ANY | CustomersController, CustomersTableController | routes/backend/Customers.php |
| customersms/* (create, sendsmsstore, get, getsmslist, getphonelogs, receiveSms, getsms, smsdashboard, getCustomerwithphone, getsmsCustomerwithphone, getCustomerwithwhatsapp, smssystemupdate, getsmstemplate, refresh_cust, sendBatchSigLink, smshome, getallsms, whatapptemplates, smstemplates, smspage, whatsapppage, getsmstemplatevalue, getmycustomnotes, instantsms, generalsmssystemupdate, alltemplates, generalsmsdetails, erxlist, smserxlist, smspicnpiclist, generalsmsrefresh_cust, notpickeduplist, pickeduplist) | Resource + ANY | CustomerSmsController, CustomerSmsTableController | routes/backend/CustomerSms.php |
| orders/*, orders/get, orders/items, itemsreceived, itemsReceivedQnt | Resource + ANY/GET/POST | OrdersController, OrdersTableController | routes/backend/Orders.php |
| products/*, products/get, backendAddCart, refreshAjaxCart, productupdate, inventorymanage, productorder, inventoryorder, get-invent-row, admin-cart, admin-empty-cart, admin-update-cart, admin-remove-from-cart, admin-pay, admin-success | Resource + ANY/GET/DELETE/PATCH/POST | ProductsController, ProductsTableController | routes/backend/Products.php |
| locations/* (as above) | (see Locations row) | (see above) | routes/backend/Locations.php |
| inventory/* (rnsepharmacy, rnseimport, rnsestore, cardhealthpharmacy, crdhltimport, crdhltstore, mckessonpharmacy, mckessonimport, mckessonstore, asdpharmacy, asdimport, asdstore, capdrugpharmacy, capdrugimport, capdrugstore, inventory, inventoryintake, inventoryout, inventoryoutrx, inventorycreate, purchasestore, inventorycount, inventoryoutcount, inventoryoutcountrx, pharmacypurchasereport, getreportsdata) | Resource + ANY/POST | InventoryController, InventoryTableController | routes/backend/Inventory.php |
| refills/*, refills/get, download_pdf, getPatientDetails, getrefillslist, customerrefillcreate, sendrefillstore, customerrefilledit, sendrefillupdate | Resource + ANY/GET/POST/PATCH | RefillsController, RefillsTableController | routes/backend/Refill.php |
| replenish/*, replenish/get, getDrugName, replenish_view_report, getPatientDetails, getFactilityLocations, getPatientLocationByFact, getPatientByFactLoc, importReplenish, activetransfer, createtransfer, exportToExcel, getactivetransfer, edittranfer, transupdate, printtranfer | Resource + ANY/GET/POST | ReplenishController, ReplenishTableController | routes/backend/Replenish.php |
| withdraw/*, withdraw/get, transactionshistory_expense, jaxwithdraw, jaxwithdraw1, jaxwithdraw2, smsverification, sendsmsOtp, checkwithdraw, exportapproved, approvedtrans, approvedpayouts | Resource + ANY/POST | WithdrawController, WithdrawTableController | routes/backend/Withdraw.php |
| copay/*, copay/get, listcopayment, loadexceldata, copay_view_report | Resource + POST/GET/ANY | CopayController, CopayTableController | routes/backend/Copay.php |
| reports/*, productsbylocation, otbyfacility, getFacilityByLocation, pharmacypurchase, netsavings, inventory, claims, recondetails, insurancereportone, everydayessentials, transactiondetails, getorderdetails, loadfacilities, fpurchasereport, freconreport, ftransreport, finvenreport, fotcreport, espdata | Resource + ANY/POST | ReportsController | routes/backend/Reports.php |
| monitoring/*, monitoring/get, download_pdf, getPatientDetails | Resource + ANY/POST | MonitoringController, MonitoringTableController | routes/backend/Monitoring.php |
| dcdgetrxdata, dcdgetsmsdata, dcdgetdeliverydata, dcdgetescalationdata, dcdgetnotesdata, dcdgetnobilldata, dcdgetbilldata, dcdashboardbillingsearch, dcdashboard, dcdashboard_report, dcdashboardnoprocess, dcdashboardshipprocess, dcdashboarddeliveryprocess, dcdashboardbillingfilters, dcdashboardbillingdaterange, dcdashboardunbillingdaterange, dcorderProcessingHomefilters, sendunreachable_email, dcdashboardsms, dcdashboardassign, dcdgetstagedata, escalationlistfilter, noorderyet, noorderresult, dcrxsearchresult, dcnewrxclientsearchfilter, dcotherclientsearchfilter, expressbilling, facilitydashboardprocess, dcdgetcomplaintsdata, complaintreport, complaintstore, dcdgetsatisfactiondata, satisfactionreport, satisfactionstore, completeorder, trackcheck, pharmacyinfod, newrxclientlist, newrxclientlistfilter | ANY/GET/POST | DeliveryDashboardController | routes/backend/DeliveryDashboard.php |
| ipa/*, ipa/get, download_pdf, getPatientDetails, getipalist, customeripacreate, sendipastore, customeripaedit, sendipaupdate | Resource + ANY/GET/POST/PATCH | IpasController, IpasTableController | routes/backend/Ipa.php |
| fax/*, fax/get, faxinbox, faxinbox/get, searchtoaddressajax, faxattachdownload | Resource + POST/GET/ANY | FaxController, FaxTableController, FaxTable2Controller | routes/backend/Fax.php |
| expense/*, expense/get | Resource + ANY | ExpenseController, ExpenseTableController | routes/backend/Expense.php |
| phoneservices/*, phoneservices/get | Resource + ANY | PhoneservicesController, PhoneservicesTableController | routes/backend/Phoneservices.php |
| sublocations/*, sublocations/get | Resource + POST | SubLocationsController, SubLocationsTableController | routes/backend/Sublocations.php |
| product-categories/*, productCategories/get | Resource + ANY | ProductCategoriesController, ProductCategoriesTableController | routes/backend/ProductCategories.php |
| drugreplenish/*, drugreplenish/get, getDrugName, replenish_view_report, getPatientDetails, getFactilityLocations, getPatientLocationByFact, getPatientByFactLoc, importReplenish, exportToExcel | Resource + ANY/GET | DrugReplenishController, DrugReplenishTableController | routes/backend/DrugReplenish.php |

### API routes (routes/api.php)

| Entry Type | Path/Trigger | Method(s) | Handler | Middleware | Auth | File Path |
|------------|--------------|-----------|---------|------------|------|-----------|
| API | mailgun/widgets | POST | MailgunWidgetsController@store | mailgun.webhook | Webhook signature | routes/api.php:20-25 |
| API | v1/auth/login | POST | Api\V1\AuthController@login | guest | Public | routes/api.php:27-30 |
| API | v1/auth/logout | POST | Api\V1\AuthController@logout | auth:api | Authenticated | routes/api.php:34-37 |
| API | v1/auth/me | GET | Api\V1\AuthController@me | auth:api | Authenticated | routes/api.php:37 |
| API | v1/pages | API Resource | Api\V1\PagesController | auth:api | Authenticated | routes/api.php:41 |
| API | v1/faqs | API Resource | Api\V1\FaqsController | auth:api | Authenticated | routes/api.php:42 |
| API | v1/blog-categories | API Resource | Api\V1\BlogCategoriesController | auth:api | Authenticated | routes/api.php:45 |
| API | v1/blog-tags | API Resource | Api\V1\BlogTagsController | auth:api | Authenticated | routes/api.php:48 |
| API | v1/blogs | API Resource | Api\V1\BlogsController | auth:api | Authenticated | routes/api.php:52 |

### Non-HTTP entry points

| Type | Trigger | Handler | File Path |
|------|---------|---------|-----------|
| Webhook | POST api/mailgun/widgets | MailgunWidgetsController@store | routes/api.php |
| Webhook (inbound SMS) | POST inbound_message/ | CustomerSmsController@inbound_message | routes/web.php:44 |
| Webhook (inbound status) | POST inbound_status/ | CustomerSmsController@inbound_status | routes/web.php:45 |
| Cron-like (GET) | rxnewupdate, micropatientupdate, signdocumentsingle, orderdateimport, fillFilldates | CronController, CustomersController, DashboardController | routes/web.php:166-171 |
| CLI | inspire | Closure | routes/console.php:16-18 |
| Scheduler | (none defined) | — | app/Console/Kernel.php schedule() empty |
| Queue jobs | (none; ProcessWidgetFiles referenced but dispatch commented) | — | app/Http/Controllers/MailgunWidgetsController.php |

---

## B. Execution Chains (Representative)

- **inbound_message** → `CustomerSmsController@inbound_message` → (prints request; no service/repository in extracted code). **DB/External:** UNRESOLVED — REQUIRES HUMAN REVIEW (handler body minimal).
- **admin custom login** → `CustomAuthController@customLogin` → (session/auth). **DB:** users (auth). **File:** app/Http/Controllers/CustomAuthController.php.
- **admin.customersms.store** → `CustomerSmsController@store` → `CustomerSmsRepository::create` → Events: CustomerSmsUpdated (in repository). **DB:** customer_sms (ORM). **Files:** CustomerSmsController.php, app/Repositories/Backend/CustomerSmsRepository.php.
- **admin.customersms.sendsmsstore** → `CustomerSmsController@sendsmsstore` → `sendSms()` (Twilio/sendBocaOTP) → `CustomerSmsRepository::create`. **DB:** customer_sms. **External:** Twilio or DID for SMS. **Files:** CustomerSmsController.php, GeneralHelper.php (sendBocaOTP).
- **admin.customers.index** → `CustomersController@index` → ViewResponse; list often via DataTable → CustomersTableController → CustomersRepository. **DB:** customers (+ relations). **Files:** routes/backend/Customers.php, Controllers/Backend/Customers, Repositories/Backend/CustomersRepository.php.
- **admin.orders.store** → `OrdersController@store` → `OrdersRepository::create` → event(OrderCreated). **DB:** orders, order_items (via Order model). **Files:** app/Repositories/Backend/OrdersRepository.php.
- **VisualizationController@streamEvents** → VisualizationEventService::emitRouteMatched, getEventsForRequest; in-memory buffer. **DB:** none. **File:** app/Http/Controllers/VisualizationController.php, app/Services/VisualizationEventService.php.
- **VisualizationController@getEvents** → VisualizationEventService::getEventsForRequest / getAllEvents → JSON. **DB:** none.
- **api/mailgun/widgets** → MailgunWidgetsController@store → (GuzzleHttp; dispatch ProcessWidgetFiles commented). **External:** Mailgun. **File:** app/Http/Controllers/MailgunWidgetsController.php.
- **Dashboard / Delivery dashboard** → DashboardController, DeliveryDashboardController → various repo/query calls; MSSQL in some paths (e.g. CustomerSmsController pickedup/notpickedup/erx). **DB:** MySQL + optional MSSQL (location-based). **Files:** app/Http/Controllers/Backend/DashboardController.php, DeliveryDashboardController.php, CustomerSmsController.php (mssqlcon, sqlsrv_*).

---

## C. Database Access Matrix

Tables inferred only from code (models, migrations, and explicit DB::table/select). Multi-DB: some controllers use `$location->db_connection` (dynamic) and/or MSSQL via `mssqlcon($location->mssqlip)`.

| Table | Access Type | Model / Usage | File Path (representative) | Triggering Entry Point |
|-------|-------------|---------------|----------------------------|-------------------------|
| users | Read/Write | User, Auth | app/Models/Auth/User.php | login, auth, admin auth |
| password_resets | Write | — | migrations | password reset |
| permissions, roles, model_has_*, role_has_* | Read/Write | Permission, Role (Spatie) | app/Models/Auth/* | admin auth/role/permission |
| social_accounts | Read/Write | SocialAccount | app/Models/Auth/SocialAccount.php | social login |
| cache, sessions, jobs, failed_jobs | Read/Write | Laravel | migrations | framework |
| blog_categories, blog_tags, blog_map_*, blogs | Read/Write | Blog, BlogCategory, BlogTag | app/Models/*.php, Repositories/Backend/BlogsRepository.php | admin blogs, API v1 blogs |
| faqs, pages | Read/Write | Faq, Page | app/Models/*.php, Repositories | admin pages, faqs, API |
| password_histories | Read/Write | PasswordHistory | app/Models/Auth/PasswordHistory.php | auth |
| ledgers | — | migrations | database/migrations | UNRESOLVED — REQUIRES HUMAN REVIEW |
| email_templates | Read/Write | EmailTemplate | app/Models/EmailTemplate.php, EmailTemplatesRepository | admin email-templates |
| customers | Read/Write | Customer | app/Models/Customer.php, CustomersRepository, CustomerSmsController (DB::table, multi-connection) | admin customers, customer sms, cron |
| customer_sms | Read/Write | CustomerSms | app/Models/CustomerSms.php, CustomerSmsRepository, CustomerSmsController | admin customersms, inbound SMS |
| customer_whatsapp | Read/Write | CustomerWhatsapp | app/Models/CustomerWhatsapp.php, CustomerWhatsappRepository | admin customerwhatsapp |
| customer_contacts | Read/Write | CustomerContacts | app/Models/CustomerContacts.php, CustomerContactsRepository | admin customercontacts |
| customer_orders, order_items (customer context) | Read/Write | CustomerOrder, CustomerOrderitem | app/Models/*.php | admin customers, orders |
| customer_rxs | Read/Write | CustomerRx | app/Models/CustomerRx.php, CustomerSmsController | admin customers, sms, batch signature |
| customer_phone_logs | Read/Write | CustomerPhoneLogs | app/Models/CustomerPhoneLogs.php | admin customersms getphonelogs |
| customer_address | Read/Write | CustomerAddress | app/Models/CustomerAddress.php, CustomerAddressRepository | admin customer-address |
| customer_email | Read/Write | CustomerEmail | app/Models/CustomerEmail.php, CustomerEmailRepository | admin customer-email |
| customer_notes | Read/Write | CustomerNotes | app/Models/CustomerNotes.php, CustomerNotesRepository | admin customer-notes |
| customer_doc | Read/Write | CustomerDoc | app/Models/CustomerDoc.php, CustomerDocRepository | admin customer-doc |
| customer_trackings | Read/Write | CustomerTracking | app/Models/CustomerTracking.php | tracking |
| customer_signatures | — | CustomerSignature | app/Models/*.php | signature flows |
| customer_additional | Read/Write | CustomerAdditional | app/Models/CustomerAdditional.php | CustomerSmsController, batch |
| orders | Read/Write | Order (Backend) | app/Repositories/Backend/OrdersRepository.php | admin orders |
| order_items | Read/Write | OrderItem | app/Models/OrderItem.php | admin orders |
| locations | Read/Write | Location | app/Models/Location.php, LocationsRepository, SubLocationsRepository | admin locations, sublocations |
| location_map_facility | Read/Write | LocationMapFacility | app/Models/LocationMapFacility.php | locations |
| facilities | Read/Write | Facility | app/Models/Facility.php, FacilitiesRepository | admin facilities, customers |
| facilityusers | Read/Write | Facilityusers | app/Models/Facilityusers.php | facilities |
| products | Read/Write | Product | app/Models/*.php, ProductsRepository, ProductQuantityRepository | admin products, productquantity |
| product_categories | Read/Write | ProductCategory | app/Models/ProductCategory.php, ProductCategoriesRepository | admin product-categories |
| product_tags | Read/Write | ProductTag | app/Models/ProductTag.php, ProductTagsRepository | admin product-tags |
| product_quantites | Read/Write | ProductQuantity | app/Models/ProductQuantity.php | admin productquantity |
| billing | Read/Write | Billing | app/Models/Billing.php, BillingRepository | admin billing |
| cashdrawer | Read/Write | Cashdrawer | app/Models/Cashdrawer.php, CashdrawerRepository, WithdrawRepository | admin cashdrawer, withdraw |
| cashlogentry | Read/Write | Cashlogentry | app/Models/Cashlogentry.php, CashlogentryRepository | admin cashlogentry |
| denomination | Read/Write | Denomination | app/Models/Denomination.php, DenominationRepository | admin denomination |
| withdraw | Read/Write | Withdraw | app/Models/Withdraw.php, WithdrawRepository | admin withdraw |
| drugs | Read/Write | Drug | app/Models/Drug.php, DrugsRepository | admin drugs |
| drug_replenish | Read/Write | DrugReplenish | app/Models/DrugReplenish.php, DrugReplenishRepository | admin drugreplenish |
| replenish | Read/Write | Replenish | app/Models/Replenish.php, ReplenishRepository | admin replenish |
| refills | Read/Write | Refill | app/Models/Refill.php, RefillsRepository | admin refills |
| careplan | Read/Write | Careplan | app/Models/Careplan.php, CareplanRepository | admin careplan |
| pdforms | Read/Write | Pdform | app/Models/Pdform.php, PdformsRepository | admin pdforms |
| reassess | Read/Write | Reassess | app/Models/Reassess.php, ReassessRepository | admin reassess |
| ipa | Read/Write | Ipa | app/Models/Ipa.php, IpasRepository | admin ipa |
| enrollment_patient | Read/Write | EnrollmentPatient | app/Models/EnrollmentPatient.php, EnrollmentPatientRepository | admin enrolment |
| fax | Read/Write | Fax | app/Models/Fax.php, FaxRepository; Mailgun outbound | admin fax |
| fax_attachments | Read/Write | FaxAttachments | app/Models/FaxAttachments.php | admin fax |
| email_outbox | Read/Write | EmailOutbox | app/Models/*.php, EmailOutboxRepository; Mailgun | admin email-outbox |
| sms_templates | Read/Write | SmsTemplate | app/Models/SmsTemplate.php, SmsTemplatesRepository | admin smstemplates, customersms |
| sms_attachments | Read/Write | SmsAttachment | app/Models/SmsAttachment.php, CustomerSmsController | admin customersms |
| general_sms | Read/Write | (model if exists) | CustomerSmsController (DB::table general_sms) | admin customersms generalsms |
| incoming_sms | Write | IncomingSms | CustomerSmsController (DB::table incoming_sms) | inbound webhook reply |
| pickedups | Read/Write | Pickedup | app/Models/Pickedup.php, CustomerSmsController | admin customersms pickeduplist |
| notpickedups | Read/Write | Notpickedup | app/Models/Notpickedup.php, CustomerSmsController | admin customersms notpickeduplist |
| erx_data | Read/Write | ErxData | CustomerSmsController (DB::table erx_data) | admin customersms erxlist |
| menus | Read/Write | Menu | app/Models/Menu.php, MenusRepository | admin menus |
| pages | Read/Write | Page | app/Models/Page.php, PagesRepository | admin pages |
| fridgelog | Read/Write | Fridgelog | app/Models/Fridgelog.php, FridgelogRepository | admin fridgelog |
| expense | Read/Write | Expense | app/Models/Expense.php, ExpenseRepository | admin expense |
| copay_* (copay track/account) | Read/Write | CopayAccount, CopayTrack | app/Models/*.php, CopayRepository | admin copay |
| monitoring | Read/Write | Monitoring | app/Models/Monitoring.php, MonitoringRepository | admin monitoring |
| phoneservices | Read/Write | Phoneservices | app/Models/*.php, PhoneservicesRepository | admin phoneservices |
| surveys | Read/Write | Survey | app/Models/Survey.php | admin surveys |
| survey_questions | Read/Write | SurveyQuestion | app/Models/SurveyQuestion.php | admin surveyquestions |
| survey_question_responses | Read/Write | SurveyQuestionResponse | app/Models/SurveyQuestionResponse.php | surveys |
| survey_question_response_transcriptions | Read/Write | SurveyQuestionResponseTranscription | app/Models/*.php | surveys |
| batch_signatures | Read/Write | BatchSignature | app/Models/BatchSignature.php | admin customersms batch signature |
| rxready | Read/Write | Rxready | app/Models/Rxready.php | admin customersms instantsms |
| reportusers | Read/Write | BaseUser | app/Models/Auth/BaseUser.php | reporting |
| user_map_menus | Read/Write | UserMapMenu | app/Models/UserMapMenu.php | menus |
| fedex_data | Read/Write | Fedex | app/Models/Fedex.php | shipping |
| shipping | Read/Write | Shipping | app/Models/Shipping.php | shipping |
| prime_rx_details | Read/Write | PrimeRxDetail | app/Models/PrimeRxDetail.php | rx |
| received_mail | — | ReceivedMail | app/Models/ReceivedMail.php | email |
| rawrxdata | — | Rawrxdata | app/Models/Rawrxdata.php | rx import |
| one_time_passwords, one_time_password_logs | — | OneTimePassword, OneTimePasswordLog | app/Models/*.php | OTP |
| withdraw_one_time_passwords | — | WithdrawOneTimePassword | app/Models/*.php | withdraw OTP |
| satisfaction_survey | — | SatisfactionSurvey | app/Models/SatisfactionSurvey.php | surveys |
| complaint | — | Complaint | app/Models/Complaint.php | delivery dashboard |
| delivery_*, tracking_* | — | DeliveryDetail, TrackingHistoryDetail | app/Models/*.php | delivery |

**ORM vs raw:** Most access via Eloquent (repositories). Raw SQL / DB::table in CustomerSmsController (pickedups, notpickedups, erx_data, customers, customer_sms, general_sms, incoming_sms, sms_attachments), and MSSQL in same controller (CLAIMS, PATIENT, PRESMSG, EREQUEST, RxLabelPrintingHistory). **Transactions:** Used in repositories where noted in code; not enumerated here.

---

## D. Integrations Catalog

| Service | Direction | Endpoint / Base | Auth | Trigger | File Path |
|---------|-----------|------------------|------|---------|-----------|
| Twilio | Outbound | Twilio API (SMS/Voice) | API key (TWILIO_SID, TWILIO_AUTH_TOKEN) | sendBocaOTP, Surveys (makecall, sendsmssurvey), CronController, CustomerSmsController (receiveSms, sendSms, sendBatchSigLink), SmsTemplatesController, ProductsController, UsersManagementController, PhoneVerificationController | app/Helpers/Global/GeneralHelper.php, app/OtpServices/Twilio.php, app/Http/Controllers/Backend/CustomerSms/CustomerSmsController.php, app/Http/Controllers/Backend/SmsTemplates/SmsTemplatesController.php, app/Http/Controllers/Backend/Surveys/SurveysController.php, app/Http/Controllers/Backend/CronController.php |
| Mailgun | Outbound | https://api.mailgun.net/v3/boca.nyc | API key (see env; do not commit) | Email send (CustomAuthController, EmailOutboxController, EmailOutboxRepository, FaxRepository, FaxController, CustomerSmsController bocareply) | app/Http/Controllers/CustomAuthController.php, app/Http/Controllers/Backend/EmailOutbox/EmailOutboxController.php, app/Repositories/Backend/EmailOutboxRepository.php, app/Repositories/Backend/FaxRepository.php, app/Http/Controllers/Backend/Fax/FaxController.php, app/Http/Controllers/Backend/CustomerSms/CustomerSmsController.php |
| Mailgun | Inbound | Webhook POST api/mailgun/widgets | mailgun.webhook (signature verify) | MailgunWidgetsController@store | routes/api.php, app/Http/Controllers/MailgunWidgetsController.php, app/Http/Middleware/ValidateMailgunWebhook.php |
| DID for Sale | Outbound | https://api.didforsale.com/didforsaleapi/index.php/api/V4/SMS/SingleSend | Basic (key) | GeneralHelper sendBocaOTP when phoneservice != Twilio | app/Helpers/Global/GeneralHelper.php |
| Twilio (media) | Outbound | Twilio Media URL | Twilio credentials | MediaMessageService getMediaContent (curl) | app/Services/MediaMessageService/MediaMessageService.php |
| MSSQL (Rx/Pharmacy) | Outbound | Location-specific mssqlip | Connection config | CustomerSmsController (pickedup, notpickedup, erx), FacilitiesController getrxdatabyid, getrxdatamssqldata, Dashboard getrxdatamssql | app/Http/Controllers/Backend/CustomerSms/CustomerSmsController.php, app/Http/Controllers/Backend/Facilities/FacilitiesController.php, app/Http/Controllers/Backend/DashboardController.php (mssqlcon) |
| Square (Square Up) | Outbound | (Square API) | — | SquareupLocationsController getLocationDetails, squareupcreate, squareupstore | app/Http/Controllers/Backend/Locations/SquareupLocationsController.php |
| GuzzleHttp | Outbound | (per use) | — | MailgunWidgetsController | app/Http/Controllers/MailgunWidgetsController.php |

**Payload/retry:** Twilio/Mailgun/DID usage in code; retry/error handling per helper/controller. Mailgun webhook: ValidateMailgunWebhook verifies signature and timestamp (15s window). **UNRESOLVED — REQUIRES HUMAN REVIEW:** Square base URL and auth pattern not confirmed in scanned files.

---

## E. Jobs / Events / Middleware Catalog

### Middleware

| Type | Name | Trigger | Purpose | File Path |
|------|------|---------|---------|-----------|
| Global | TrustProxies | Every request | Trust proxy headers | app/Http/Kernel.php, app/Http/Middleware/TrustProxies.php |
| Global | CheckForMaintenanceMode | Every request | Maintenance mode | app/Http/Kernel.php, app/Http/Middleware/CheckForMaintenanceMode.php |
| Global | CheckForReadOnlyMode | Every request | Read-only mode | app/Http/Kernel.php, app/Http/Middleware/CheckForReadOnlyMode.php |
| Global | ValidatePostSize | Every request | Post size validation | app/Http/Kernel.php (Illuminate) |
| Global | TrimStrings | Every request | Trim input strings | app/Http/Middleware/TrimStrings.php |
| Global | ConvertEmptyStringsToNull | Every request | Empty string → null | app/Http/Kernel.php (Illuminate) |
| Global | VisualizationMiddleware | Every request | Attach X-Request-ID, emit response sent event | app/Http/Kernel.php, app/Http/Middleware/VisualizationMiddleware.php |
| Group web | EncryptCookies, AddQueuedCookiesToResponse, StartSession, AuthenticateSession, ShareErrorsFromSession, VerifyCsrfToken, SubstituteBindings, LaravelMap, LocaleMiddleware, ToBeLoggedOut | Routes in web group | Session, CSRF, locale, logout list | app/Http/Kernel.php |
| Group api | throttle:60,1, SubstituteBindings | Routes in api group | Throttle, bindings | app/Http/Kernel.php |
| Group admin | auth | Routes in admin group | Require authentication | app/Http/Kernel.php |
| Route | mailgun.webhook | POST api/mailgun/widgets | Verify Mailgun webhook signature | app/Http/Kernel.php, app/Http/Middleware/ValidateMailgunWebhook.php |
| Route | access.routeNeedsPermission | auth routes | Spatie permission | app/Http/Kernel.php, routes/backend/auth.php |
| Route | guest | login, api v1 auth login | Redirect if authenticated | app/Http/Kernel.php |
| Route | role_or_permission | ccdashboard | View client communication | routes/backend/Dashboard.php |
| Route | throttle | /token (Passport) | Rate limit | routes/web.php |

### Events (dispatched in code)

Dispatched from repositories (and one controller) on create/update/delete; listeners are event subscribers (UserEventListener, RoleEventListener, PermissionEventListener, and per-entity *EventListener in app/Listeners/Backend/*). Sample:

| Event | Dispatched From | Listener / Subscriber | File Path (dispatch) |
|-------|-----------------|------------------------|----------------------|
| UserCreated, UserUpdated, UserDeleted, UserPasswordChanged, UserDeactivated, UserReactivated, UserConfirmed, UserUnconfirmed, UserPermanentlyDeleted, UserRestored | UserRepository | UserEventListener | app/Repositories/Backend/Auth/UserRepository.php |
| RoleCreated, RoleUpdated, RoleDeleted | RoleRepository | RoleEventListener | app/Repositories/Backend/Auth/RoleRepository.php |
| PermissionCreated, PermissionUpdated, PermissionDeleted | PermissionRepository | PermissionEventListener | app/Repositories/Backend/Auth/Permission/*.php |
| OrderCreated | OrdersRepository, CustomerOrdersRepository | — | app/Repositories/Backend/OrdersRepository.php, CustomerOrdersRepository.php |
| LocationCreated, LocationUpdated, LocationDeleted | LocationsRepository, SubLocationsRepository | LocationsEventListener, SubLocationsEventListener | app/Repositories/Backend/LocationsRepository.php, SubLocationsRepository.php; SquareupLocationsController (LocationCreated) |
| ProductCreated, ProductUpdated, ProductDeleted | ProductsRepository, ProductQuantityRepository | ProductEventListener, ProductQuantityEventListener | app/Repositories/Backend/ProductsRepository.php, ProductQuantityRepository.php |
| CustomerSmsUpdated, CustomerSmsDeleted | CustomerSmsRepository | CustomerSmsEventListener | app/Repositories/Backend/CustomerSmsRepository.php |
| CustomerCreated, CustomerUpdated, CustomerDeleted | CustomersRepository | CustomerEventListener | app/Repositories/Backend/CustomersRepository.php |
| BillingCreated, BillingUpdated, BillingDeleted | BillingRepository | — | app/Repositories/Backend/BillingRepository.php |
| CashdrawerCreated, CashdrawerDeleted | CashdrawerRepository, WithdrawRepository | — | app/Repositories/Backend/CashdrawerRepository.php, WithdrawRepository.php |
| (Many other *Created/*Updated/*Deleted) | Other *Repository | Corresponding *EventListener in Listeners/Backend | app/Repositories/Backend/*.php |
| UserLoggedIn | SocialLoginController | — | app/Http/Controllers/Frontend/Auth/SocialLoginController.php |

Event subscribers registered in `app/Providers/EventServiceProvider.php` ($subscribe: UserEventListener frontend + backend Auth User/Role). Auto-discovery disabled.

### Jobs / Queues

| Type | Name | Trigger | Purpose | File Path |
|------|------|---------|---------|-----------|
| Job (commented) | ProcessWidgetFiles | MailgunWidgetsController@store | Process widget files (dispatch commented) | app/Http/Controllers/MailgunWidgetsController.php |
| Queue | (Laravel jobs table) | — | Default queue table from migrations | database/migrations |

No other Job classes found under app/Jobs (directory not present). Scheduled tasks: app/Console/Kernel.php schedule() is empty.

---

## 6. Observability & Instrumentation Hooks

| Type | Where | What | File Path |
|------|--------|------|-----------|
| Request ID | VisualizationMiddleware | Set X-Request-ID on request/response; emit response.sent event | app/Http/Middleware/VisualizationMiddleware.php |
| Visualization events | VisualizationEventService | emitRouteMatched, emitControllerEntered/Exited, emitDbQuery, emitExternalCall, emitResponseSent, emitError; in-memory buffer (last 50 requests) | app/Services/VisualizationEventService.php |
| SSE stream | VisualizationController@streamEvents | Stream visualization events (live or replay by request_id) | app/Http/Controllers/VisualizationController.php |
| JSON events | VisualizationController@getEvents | Return buffered events (by request_id or all) | app/Http/Controllers/VisualizationController.php |

No tracing SDK, metrics emission, or structured logging hooks found in scanned code. **UNRESOLVED — REQUIRES HUMAN REVIEW:** Whether Laravel logging or third-party APM is configured outside app code.

---

## Validation Check

- Entry points: Taken from routes only; no guessed endpoints.
- Backend admin routes: All 54 backend route files included; prefix `admin` and middleware `admin` applied.
- Tables: Only where model or DB::table/raw use found; multi-connection and MSSQL noted.
- Integrations: Twilio, Mailgun, DID for Sale, MSSQL, Square (partial), Guzzle; auth/signature as in code.
- Events/Listeners: From EventServiceProvider and repository event() calls; listeners from app/Listeners.
- Unresolved items are marked **UNRESOLVED — REQUIRES HUMAN REVIEW**.
