# Server Authentication

Set `MONGO_URI` and a random `JWT_SECRET` of at least 32 characters in `server/.env` before starting the API. In production also set `CLIENT_ORIGIN` and `NODE_ENV=production`. See `.env.example` for the variable names. Tokens expire after one hour.

The first account is registered once and receives the `admin` role:

```http
POST /api/auth/register
Content-Type: application/json

{"email":"admin@example.com","password":"use-a-strong-password"}
```

After setup, registration is closed. Sign in at `POST /api/auth/login` with the same JSON shape. Both endpoints return a JWT in `token`. Protected admin endpoints are mounted under `/api/admin` and require `Authorization: Bearer <token>`; `GET /api/admin/me` returns the authenticated admin.

The client workspace is available at `/admin`. Its protected API supports inquiry listing and status updates, package create/update/delete, destination create/update, and testimonial create/update/delete. Public API reads use the same MongoDB records, so published content updates are reflected on the public pages.