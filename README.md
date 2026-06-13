# Base API Services

A modular utility-services API built with **Node.js**, **Express**, **TypeScript** and **MongoDB**. Exposes common tools such as email delivery, WhatsApp messaging, PDF generation, QR codes, Apple Wallet passes, AI text generation and encryption utilities — ready to drop into any project.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation-with-docker-recommended)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [Available Endpoints](#available-endpoints)
  - [Auth](#auth)
  - [Users](#users)
  - [Companies & API Keys](#companies--api-keys)
  - [Templates](#templates)
  - [Utils](#utils)
- [Usage Examples (Postman)](#usage-examples-postman)

## Requirements

**Option A — Docker (recommended):**
- Docker Desktop / Docker Engine + `docker compose`
- `make`

**Option B — Native stack:**
- Node.js 24.x (managed with [nvm](https://github.com/nvm-sh/nvm): `nvm use 24`)
- [pnpm](https://pnpm.io/) 10+ (used instead of `npm` for security reasons)
- MongoDB (local or Atlas)
- Redis (local)

## Installation with Docker (recommended)

Everything (MongoDB, Redis and the app) runs in containers. You only need to create accounts for SendGrid, OpenAI, Twilio and Apple if you plan to use those endpoints — the rest works without any external accounts.

```bash
# Clone the repo
git clone https://github.com/El-Isi/base-api-services.git
cd base-api-services

# Bootstrap .env (Make does it for you, but you can do it manually too)
make env

# Edit .env and fill in the secrets you actually need (OPENAI_API_KEY, etc.)
$EDITOR .env

# Bring up the stack in development mode (hot reload via tsc-watch)
make dev

# Or in production mode
make up
```

### Make commands

```bash
make help          # List all commands
make env           # Create .env from template and auto-generate local secrets
make build         # Build the app image
make up            # Bring up the stack (mongo + redis + app) in prod mode, detached
make dev           # Bring up the stack with hot reload (foreground)
make down          # Stop the containers
make restart       # Restart the app
make logs          # Tail the app logs
make logs-all      # Tail logs from every service
make shell         # Shell into the app container
make mongo-shell   # mongosh inside the mongo container
make redis-cli     # redis-cli inside the redis container
make install       # Re-install deps (pnpm install) inside the container
make clean         # Remove containers AND volumes (you lose mongo/redis data!)
```

### Default ports

| Service  | Host port | Override |
|---|---|---|
| App      | `3000`    | `APP_PORT=3001 make up`   |
| MongoDB  | `27017`   | `MONGO_PORT=27018 make up` |
| Redis    | `6379`    | `REDIS_PORT=6380 make up`  |

If you already have Mongo/Redis running locally and the port collides, export the override before the command.

## Native installation (no Docker)

```bash
nvm use 24
npm install -g pnpm   # only if you don't have pnpm yet
pnpm install
cp env.development.template .env
# Make sure MongoDB and Redis are running locally
pnpm run dev
```

## Environment Variables

Copy `env.development.template` to `.env` and fill in each value:

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `APP_ID` | Application identifier | Defined by you |
| `SERVER_URL` | Base URL of the server | e.g. `http://localhost:3000` |
| `SOCKET_PORT` | Server port | e.g. `3000` |
| `NODE_ENV` | Runtime environment | `development` / `production` |
| `MONGODB_URL` | MongoDB connection string | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or local: `mongodb://localhost:27017/baseapi` |
| `REDISCLOUD_HOST` | Redis host | [Redis Cloud](https://redis.com/try-free/) or local: `127.0.0.1` |
| `REDISCLOUD_PORT` | Redis port | Default: `6379` |
| `REDISCLOUD_KEY` | Redis password | Your Redis instance |
| `JWT_SECRET` | Secret used to sign JWTs | Generate one: `openssl rand -hex 32` |
| `SENDGRID_API_KEY` | SendGrid API key | [SendGrid API Keys](https://app.sendgrid.com/settings/api_keys) |
| `CRIPTO_SECRET_KEY` | AES secret for keys encryption | Generate one securely |
| `CRYPTO_SECRET_DATA` | AES secret for data encryption | Generate one securely |
| `TEAM_ID` | Apple Developer Team ID | [Apple Developer Account](https://developer.apple.com/account) |
| `PASS_TYPE_ID` | Apple Pass Type Identifier | Apple Developer > Certificates, IDs & Profiles |
| `PASSWORD_CERT` | iOS pass certificate password | The one you set when exporting the .p12 |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID | [Twilio Console](https://console.twilio.com/) |
| `TWILIO_ACCOUNT_AUTH_TOKEN` | Twilio Auth Token | Twilio Console |
| `TWILIO_NUMBER_PRODUCTION` | Twilio WhatsApp number | Twilio > Messaging > WhatsApp Senders |
| `OPENAI_API_KEY` | OpenAI API key | [OpenAI API Keys](https://platform.openai.com/api-keys) |

## Running the App

With Docker:

```bash
make dev    # development with hot reload
make up     # production, detached
```

Without Docker (requires native Mongo and Redis):

```bash
pnpm run dev   # development
pnpm start     # production
```

The server listens on the port defined by `SOCKET_PORT`. Open `http://localhost:{SOCKET_PORT}` to see the dashboard.

## Available Endpoints

All endpoints live under the `/api` prefix.

### Auth

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| `POST` | `/api/auth/login` | Login with email and password | No |
| `POST` | `/api/auth/register` | Register a new user | No |

### Users

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| `GET` | `/api/users/:id` | Get user by ID | JWT |
| `PUT` | `/api/users/:id` | Update user | JWT |

### Companies & API Keys

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| `POST` | `/api/companies` | Create a company | JWT |
| `POST` | `/api/companies/apikeys` | Generate an API key for a company | JWT |

### Templates

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| `POST` | `/api/templates` | Create a PDF template | JWT |

### Utils

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| `POST` | `/api/utils/sendWhatsapp` | Send a WhatsApp message via Twilio | No |
| `POST` | `/api/utils/openAI` | Generate text with OpenAI | No |
| `POST` | `/api/utils/sendEmail` | Send an email via SendGrid | No |
| `POST` | `/api/utils/fillPdf` | Fill a PDF template with dynamic data | No |
| `POST` | `/api/utils/generateQR` | Generate a QR code as a PNG image | No |
| `POST` | `/api/utils/generatePass` | Generate an Apple Wallet pass (.pkpass) | No |
| `POST` | `/api/utils/encrypt` | Encrypt text with AES | No |
| `POST` | `/api/utils/decrypt` | Decrypt text with AES | No |

## Usage Examples (Postman)

### Send Email

```
POST /api/utils/sendEmail
Content-Type: application/json

{
  "to": "recipient@example.com",
  "from": "sender@yourdomain.com",
  "subject": "Welcome to the platform",
  "html": "<h1>Hi!</h1><p>Your account has been created.</p>",
  "attachments": [
    {
      "filename": "ticket.pdf",
      "content": "<base64_encoded_content>",
      "type": "application/pdf",
      "disposition": "attachment"
    }
  ]
}
```

**Response:**
```json
{
  "data": {
    "statusCode": 202,
    "message": "Email sent successfully"
  }
}
```

### Send WhatsApp

```
POST /api/utils/sendWhatsapp
Content-Type: application/json

{
  "dataMessage": {
    "name": "Isidro",
    "product": "Personal Loan"
  },
  "templateMessage": "Hi {name}, your {product} has been approved.",
  "phone": "+5213312345678"
}
```

### Generate Text with OpenAI

```
POST /api/utils/openAI
Content-Type: application/json

{
  "message": "Write a welcome greeting for a new user",
  "model": "gpt-4o-mini",
  "temperature": 0.7,
  "maxTokens": 200,
  "systemPrompt": "You are a friendly assistant who writes in English."
}
```

### Fill a PDF with Data

```
POST /api/utils/fillPdf
Content-Type: application/json

{
  "name": "Isidro Gonzalez",
  "date": "06/12/2026",
  "origin": "Guadalajara",
  "destination": "Mexico City",
  "qrData": "TICKET-2026-001"
}
```

**Response:** Buffer of the generated PDF (Content-Type: application/pdf)

### Generate QR Code

```
POST /api/utils/generateQR
Content-Type: application/json

{
  "data": "https://your-site.com/ticket/12345",
  "options": {
    "width": 300,
    "color": {
      "dark": "#000000",
      "light": "#ffffff"
    }
  }
}
```

**Response:** PNG image of the QR code

### Generate Apple Wallet Pass

```
POST /api/utils/generatePass
Content-Type: application/json

{
  "serialNumber": "PASS-2026-001",
  "description": "Boarding Pass GDL-MEX",
  "boardingPass": {
    "headerFields": [
      { "key": "gate", "label": "Gate", "value": "13" }
    ],
    "primaryFields": [
      { "key": "origin", "label": "Origin", "value": "GDL" },
      { "key": "destination", "label": "Destination", "value": "MEX" }
    ]
  }
}
```

**Response:** A .pkpass file (Content-Type: application/vnd.apple.pkpass)

### Encrypt Text

```
POST /api/utils/encrypt
Content-Type: application/json

{
  "text": "sensitive information",
  "type": "data"
}
```

**Response:**
```json
{
  "data": {
    "encrypted": "U2FsdGVkX1+abc123..."
  }
}
```

### Decrypt Text

```
POST /api/utils/decrypt
Content-Type: application/json

{
  "text": "U2FsdGVkX1+abc123...",
  "type": "data"
}
```

**Response:**
```json
{
  "data": {
    "decrypted": "sensitive information"
  }
}
```

## Project Structure

```
src/
├── companies/          # Companies and API keys module
├── config/             # Middleware, plugins, DB, Redis
├── routes/             # Main router
├── templates/          # PDF templates (MongoDB)
├── users/              # Auth, users, roles
└── utils/
    ├── baseInterfaces/ # IRoute, IRequest, IPayload
    ├── emailDeliver/   # SendGrid with the Strategy pattern
    ├── errors/         # HTTP error classes
    ├── pdfGenerator/   # Fill PDF, QR, fonts, alignment
    ├── responses/      # DataResponse, MessageResponse
    ├── services/       # Utils controllers and routes
    ├── templates/      # HTML email templates
    ├── textGenerator/  # OpenAI chat completion
    ├── ticketGenerator/# iOS Wallet pass generator
    └── whatsappDeliver/# Twilio WhatsApp
```

## License

ISC

## Author

**El Isi Hechicero Supremo**
