# YatraHub Backend

Express API for the YatraHub travel site.

## Deploy the API to Render

1. Push this repository to GitHub and create a new **Blueprint** in Render using the repository. Render reads the service settings from `render.yaml`.
2. In the service's Environment settings, set `MONGO_URI` to a MongoDB Atlas connection string and confirm `CLIENT_ORIGIN` is `https://wandera-frontend-af9x.vercel.app`. Keep the database URI private.
3. Wait for the deploy, then check `https://wandera-backend.onrender.com/api/health` for `{"status":"ok"}`.
4. In the Render Shell for the API service, run `npm run seed` once to add the initial travel content.
5. Provision the initial admin through a trusted deployment/database process. Customer sign-up is not allowed to create admin accounts.

The frontend is deployed at `https://wandera-frontend-af9x.vercel.app`. Its `/api` requests are rewritten by Vercel to `https://wandera-backend.onrender.com/api`, keeping authentication cookies same-origin. Local development uses the Vite proxy.

The Blueprint generates `JWT_SECRET` and Render supplies `PORT`. Never commit real credentials or put them in `.env.example`.