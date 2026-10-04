# Server Authentication

Set `MONGO_URI` and a random `JWT_SECRET` of at least 32 characters in `server/.env` before starting the API. In production also set `CLIENT_ORIGIN` and `NODE_ENV=production`. See `.env.example` for the variable names. Tokens expire after one hour.

## Customer accounts

Customers can create an account at `POST /api/auth/register`:

```http
POST /api/auth/register
Content-Type: application/json

{"name":"Traveler","email":"traveler@example.com","password":"use-a-strong-password"}
```

Public sign-up creates only `user` accounts. Sign in at `POST /api/auth/login`. Registration and login set an `HttpOnly` session cookie; passwords and session tokens are not returned to or stored by browser JavaScript. `GET /api/auth/me` returns the current account, and `POST /api/auth/logout` clears the session cookie.

Sign-in allows 15 failed attempts per account in a 15-minute window. Successful sign-ins do not count, and the window resets automatically. A separate, higher network-level limit protects the authentication API without locking out everyone sharing a network after a few mistakes.

## Admin accounts

Admin sign-in uses `POST /api/auth/admin/login`. Public customer sign-up never creates an admin, and there is no public admin-registration endpoint. Provision the initial admin through a trusted deployment/database process and configure a strong `JWT_SECRET`.

Protected admin endpoints are mounted under `/api/admin` and require an admin session. `GET /api/admin/me` returns the authenticated admin.

## Frontend routing

The Vercel frontend proxies `/api` to the Render API so the session cookie remains same-origin. Local Vite development proxies `/api` to `http://127.0.0.1:5000`. Public travel pages and their data APIs require a signed-in account.
