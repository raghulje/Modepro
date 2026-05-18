# Modepro — Live Website (React)

Production React rebuild of [modepro.co.in](https://modepro.co.in), structured like **Adonis_Antigravity** for deployment: **`client/`** (frontend) + **`server/`** (API), with the built SPA served from **`client/out`** by Express in production.

**Repository:** [https://github.com/raghulje/Modepro](https://github.com/raghulje/Modepro)

---

## Adonis vs Modepro Live

| Area | Adonis_Antigravity | Modepro_Live |
|------|-------------------|--------------|
| **CMS / Admin** | Yes (MySQL + admin UI) | **Yes** — `/admin/dashboard` (MySQL + CMS UI) |
| **Database** | MySQL (Sequelize) | MySQL (`modepro_cms`) |
| **Content updates** | CMS dashboard | CMS dashboard (falls back to mocks if API unavailable) |
| **Frontend** | `client/` (Vite + React) | `client/` (Vite + React) |
| **Production build** | `client/out/` | `client/out/` |
| **Backend** | `server/` (Express, port 3002) | `server/` (Express, port **3020** via `server/.env`) |
| **Single-server deploy** | API + serves `client/out` | API + serves `client/out` |
| **Contact form** | Kissflow webhook | Kissflow webhook + Agentic AI success UI |
| **Env file** | `server/.env` | `server/.env` |

---

## Project structure

```
Modepro_Live/
├── client/                      # React public site (Vite)
│   ├── public/images/           # Static assets (banners, gallery, products)
│   ├── src/
│   │   ├── pages/               # One folder per route
│   │   ├── mocks/               # Page content (replaces CMS data)
│   │   ├── components/
│   │   └── router/
│   ├── out/                     # Production build (generated — do not edit)
│   ├── package.json
│   └── vite.config.ts
├── server/                      # Express API
│   ├── controllers/
│   ├── routes/
│   ├── helpers/                 # Kissflow webhook, validation
│   ├── index.js                 # Serves /api + client/out
│   ├── .env                     # Secrets (not in git)
│   └── .env.example
├── package.json                 # Root scripts: dev, build, start
└── README.md
```

---

## Prerequisites

- **Node.js** 18+ (20 LTS recommended)
- **npm** 9+
- **MySQL** 8+ (for CMS content storage)

---

## CMS setup (first time)

1. Create the database:

```bash
mysql -u root -p < database/modepro_cms_setup.sql
```

2. Configure `server/.env` (copy from `server/.env.example`):

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=modepro_cms
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=your-long-random-secret
```

3. Load seed data (choose **one**):

**Option A — SQL file (recommended if `npm run seed` fails):**

In MySQL Workbench or CLI, run in order:

1. `database/modepro_cms_setup.sql` (schema — you may have done this already)
2. `database/modepro_seed_data.sql` (all content + admin user)

To regenerate the seed SQL from mocks after mock edits:

```bash
cd server
npm run seed:sql
```

**Option B — Node seed script:**

```bash
cd server
npm install
npm run seed
```

Default admin (override with `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`):

- Email: `admin@modepro.com`
- Password: `Modepro@123`

4. Open **http://localhost:5173/admin/login** after starting dev servers.

### CMS admin tabs

| Tab | Manages |
|-----|---------|
| Home | Hero slides, welcome, feature cards |
| Header & Footer | Navigation + footer |
| About | About page + info cards |
| Products | Products page metadata |
| Gallery | Gallery banners + images |
| CMS Pages | R&D, Manufacturing, Quality, EHS, Capabilities, Careers, Contact (JSON) |
| SMTP | Email settings |
| Users | Admin users |

---

## Environment variables

**Only `server/.env` is required.** The client does **not** need a `.env` file — in development, Vite reads `PORT` from `server/.env` and proxies `/api` to that port automatically.

Copy the example file and set values on the server (local or AWS):

```bash
cd server
copy .env.example .env    # Windows
# cp .env.example .env    # macOS / Linux
```

### `server/.env`

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | API + SPA port (default **`3020`**) |
| `MODEPRO_AGENT_ID` | **Yes (production)** | Kissflow agent ID for **Agentic AI** outbound calls |

Example:

```env
PORT=3020
MODEPRO_AGENT_ID=your-kissflow-agent-id-here
```

> **Never commit `server/.env`** — it is listed in `.gitignore`. Set secrets in your host environment (EC2, Elastic Beanstalk, Docker, etc.).

### Client (no `.env`)

| Item | Notes |
|------|--------|
| **Dev UI** | Vite on **5173** (fixed in `vite.config.ts`) |
| **API proxy** | Uses `PORT` from `../server/.env` (e.g. `http://127.0.0.1:3020`) |
| **Production** | Same origin as the server — no env vars on the client |

Optional build-time override only if you deploy under a subpath: `BASE_PATH=/subdir/` when running `npm run build`.

---

## Local development

Use **two terminals** (API on **3020**, UI on **5173**).

### Terminal 1 — API server

```bash
cd server
npm install
npm run dev
```

Runs at **http://localhost:3020** (or whatever `PORT` is in `server/.env`)

### Terminal 2 — Frontend (Vite)

From repo root:

```bash
cd client
npm install
cd ..
npm run dev
```

Runs at **http://localhost:5173** (proxies `/api` → `http://127.0.0.1:3020` from `server/.env`).

Open **http://localhost:5173** in the browser.

---

## Production build & run (single server)

Same hosting model as Adonis: build the client once, then Express serves **`client/out`** and the API on one port.

### 1. Install dependencies

```bash
# From repo root
cd client && npm install && cd ..
cd server && npm install && cd ..
```

### 2. Configure environment

```bash
cd server
copy .env.example .env
# Set MODEPRO_AGENT_ID and PORT
```

### 3. Build frontend → `client/out`

```bash
# From repo root
npm run build
```

This runs `vite build` and writes output to **`client/out/`**.

### 4. Start production server

```bash
# From repo root
npm start
```

The server:

- Serves static files from `client/out/`
- Falls back to `index.html` for client-side routes (React Router)
- Exposes API at `/api/*`

Open **http://localhost:3020** (or your configured `PORT`).

```text
Modepro API server listening on http://localhost:3020
```

If `client/out` is missing, the API still runs but the site will not load — run `npm run build` first.

---

## AWS / VPS deployment checklist

1. Clone repo: `git clone https://github.com/raghulje/Modepro.git`
2. Install Node.js on the instance
3. Set **`server/.env`** (or platform env vars): `PORT`, `MODEPRO_AGENT_ID`
4. Run:

```bash
npm run build          # creates client/out
npm start              # serves SPA + API
```

5. Put **Nginx** or a load balancer in front if needed (proxy to `PORT`)
6. Use **PM2**, **systemd**, or Elastic Beanstalk to keep the process alive

### Reverse proxy (optional)

Point your domain to the Node process:

```nginx
location / {
    proxy_pass http://127.0.0.1:3020;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## Routes (public site)

| Path | Page |
|------|------|
| `/` | Home |
| `/about` | About |
| `/products` | Products |
| `/rnd` | R & D |
| `/manufacturing` | Manufacturing |
| `/quality` | Quality |
| `/ehs` | EHS |
| `/capabilities` | Capabilities |
| `/careers` | Careers |
| `/gallery` | Gallery |
| `/contact` | Contact (form + map) |

---

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/geo/india-cities` | City list for contact form combobox |
| `POST` | `/api/contact-submissions` | Submit contact enquiry → Kissflow |

### Contact submission payload (client → server)

```json
{
  "name": "Jane Doe",
  "company": "Acme Pharma Ltd",
  "email": "jane@example.com",
  "message": "Enquiry message (min 15 characters).",
  "product": "General Enquiry",
  "city": "Mumbai, Maharashtra",
  "mobile": "+919876543210",
  "countryDialCode": "+91",
  "mobileLocal": "9876543210",
  "source": "modepro-live-contact"
}
```

### Kissflow webhook payload (server → Kissflow)

The server queues a POST to the Refex Group Kissflow integration with:

- `name`, `email`, `Phone_Number`, `company`, `Product`, `city`, `cityname`, `statename`, `message`
- `agentid` (when `MODEPRO_AGENT_ID` is set)
- `submissionId`, `websiteName` (`Modepro Live`), `formName`, `Website_and_form`
- Request metadata: IP, user agent, device, browser, timestamp, `source`

On success, the user sees a modal: **Agentic AI will call you shortly** for further enquiry.

### SMTP email (contact form)

Configured via **`server/.env`** only (no CMS). On each submission the server sends (best-effort, non-blocking):

1. **Staff notification** → `CONTACT_FORM_EMAIL` (default `info@modepro.com`)
2. **Auto-reply** → the submitter's email address

| Variable | Example | Description |
|----------|---------|-------------|
| `SMTP_HOST` | `smtp.zoho.in` | Zoho SMTP host |
| `SMTP_PORT` | `465` | SSL port |
| `SMTP_SECURE` | `true` | Use TLS/SSL |
| `SMTP_USER` | `tech@helpdesksupport.co.in` | SMTP login |
| `SMTP_PASSWORD` | *(secret)* | SMTP password |
| `SMTP_FROM_EMAIL` | `tech@helpdesksupport.co.in` | From address |
| `SMTP_FROM_NAME` | `Modepro India` | From display name |
| `CONTACT_FORM_EMAIL` | `info@modepro.com` | Inbox for new enquiries |

Kissflow webhook still runs in parallel — email failure does not block the form response.

---

## Updating content

**Preferred:** Use the CMS at `/admin/dashboard` — changes are stored in MySQL and served via `/api/v1/*`.

**Fallback / initial seed:** Content in **`client/src/mocks/`** is imported by `npm run seed` and used when the API is unavailable.

After CMS or mock edits in production:

```bash
npm run build
npm start
```

### Helpful scripts (`client/`)

| Script | Command | Purpose |
|--------|---------|---------|
| Download images from live site | `npm run download-assets` | Populate `public/images/` |
| Sync product tables | `npm run sync-products` | Regenerate `productsData.ts` from HTML |

---

## Root npm scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server (`client/`) |
| `npm run dev:server` | Start API with nodemon (`server/`) |
| `npm run build` | Build client → `client/out/` |
| `npm start` | Run production server (serves `out` + API) |
| `npm run type-check` | TypeScript check (`client/`) |
| `npm run seed` | Import mocks → MySQL (`server/`) |

---

## Troubleshooting

### Contact form: city list empty or console errors

- Ensure the **API is running** (`PORT` in `server/.env`, default **3020**)
- Open the site at **http://localhost:5173** in dev (not the API port)
- If you change `PORT`, restart both server and Vite so the proxy picks it up

### `MODEPRO_AGENT_ID is not set` in server logs

Add the agent ID to `server/.env` and restart the server. Submissions still reach Kissflow but **without** `agentid`.

### Blank page in production

Run `npm run build` and confirm `client/out/index.html` exists.

### Port already in use

```powershell
netstat -ano | findstr :3020
```

Change `PORT` in `server/.env` or stop the conflicting process.

---

## Tech stack

- **Frontend:** React 19, TypeScript, Vite 8, Tailwind CSS 3, React Router 7
- **Backend:** Express 4, `@countrystatecity/countries` (India cities)
- **Integrations:** Kissflow webhook (contact leads), libphonenumber-js, react-phone-input-2

---

## License

Private — Modepro India Pvt. Ltd.
