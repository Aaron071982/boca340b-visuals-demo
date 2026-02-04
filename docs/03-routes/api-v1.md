# 3.3 API routes (routes/api.php)

---

## Table

| Path | Methods | Handler | Middleware | Auth type |
|------|--------:|---------|------------|-----------|
| `mailgun/widgets` | POST | `MailgunWidgetsController@store` | `mailgun.webhook` | Webhook signature |
| `v1/auth/login` | POST | `Api\V1\AuthController@login` | `guest` | Public |
| `v1/auth/logout` | POST | `Api\V1\AuthController@logout` | `auth:api` | Authenticated |
| `v1/auth/me` | GET | `Api\V1\AuthController@me` | `auth:api` | Authenticated |
| `v1/pages` | resource | `Api\V1\PagesController` | `auth:api` | Authenticated |
| `v1/faqs` | resource | `Api\V1\FaqsController` | `auth:api` | Authenticated |
| `v1/blog-categories` | resource | `Api\V1\BlogCategoriesController` | `auth:api` | Authenticated |
| `v1/blog-tags` | resource | `Api\V1\BlogTagsController` | `auth:api` | Authenticated |
| `v1/blogs` | resource | `Api\V1\BlogsController` | `auth:api` | Authenticated |

---

## Notes

- API prefix is `api` (e.g. `POST api/mailgun/widgets`, `POST api/v1/auth/login`).
- Mailgun webhook is validated by `ValidateMailgunWebhook` middleware (signature + timestamp).
- All `v1` resource routes require `auth:api`.
