# Aletheia Dictionary

An open-source website built for a deeper exploration of thoughts and ideas with personal wiki-like projects, linking ideas together with a network of sources and backlinks.

![Screenshot](src/lib/assets/ImageOfAletheiaWebsite.png) *Image of project page with some pages*

### Privacy Policy
https://aletheia.espolin.dev/privacy_policy

### Terms of Service
https://aletheia.espolin.dev/terms_of_service


## Collaboration

You are free to make pull requests with new features, fixes, or changes. These will be carefully reviewed and accepted or denied based on my own judgement. Malicious pull requests will be followed up on and result in a permanent ban on the people involved.

Please follow these guidelines when contributing:

- Open an issue before starting significant work, so we can discuss the approach first.
- Keep commits focused and write clear commit messages.
- Match the existing code style of the project.
- Branch names should be descriptive

## Prerequisites

Make sure you have the following installed before getting started with local development:

- **Node.js** v20 or higher (and npm)
- **Git**
- **Docker** (for the Docker setup)
- **MariaDB** (for the npm dev setup)

## Local development

To make contributions to the project, you must first clone and enter the repository:

```bash
git clone https://github.com/PopkornXD/Aletheia-Dictionary.git
cd Aletheia-Dictionary
```

Then you need to create a `.env` file following this structure:

```bash
DB_HOST=127.0.0.1        # Keep this at localhost
DB_USER=username         # Any username
DB_PASSWORD=password     # Any password
DB_NAME=aletheia         # Any database name
DB_ROOT_PASSWORD=secure_password  # Root password used only in the Docker setup
ORIGIN=http://localhost:3001      # Must match the port your server runs on.
                                  # SvelteKit uses this for CSRF/origin protection.
                                  # Use port 3001 for Docker, or 5173 for npm dev.
```

You can now run the website, either with **Docker** or with **npm** (or both).

> **Note:** Docker runs the site on port `3001`, while `npm run dev` runs it on port `5173`. These are two independent setups — pick whichever suits your workflow.

### Docker setup

Install **Docker** if you have not already, and then simply run:

```bash
docker compose up
```

The website should now be running at http://localhost:3001/, as long as you have not changed the port in `docker-compose.yml`.

### npm development setup

To get live updates on the website during development, you can use **npm** to run it. This requires a local **MariaDB** instance.

If you do not have MariaDB installed yet, install it first, then run the secure setup script to set a root password:

```bash
sudo mysql_secure_installation
```

Log in as root and create a user and database matching your `.env` file:

```bash
sudo mysql -u root -p
```

```sql
CREATE DATABASE aletheia;
CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON aletheia.* TO 'username'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Now run the schema to set up the tables:

```bash
mysql -u username -p aletheia < src/lib/sql/schema.sql
```

Then install dependencies and start the dev server:

```bash
npm install
npm run dev
```

The website should now be running at http://localhost:5173/.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | SvelteKit, Svelte 5 |
| Backend | SvelteKit server-side routes |
| Database | MariaDB (MySQL) |
| Deployment | Docker containers on Oracle Cloud VM with Cloudflare tunnel |

## Data structure

The `permissions` table uses a `role` enum with the following values: `viewer`, `editor`, `admin`.

Pages can act as sources for other pages. The `page_sources` table captures this relationship, both `page_id` and `source_id` reference the `page` table.

```mermaid
erDiagram
    users {
        INT id PK
        VARCHAR username UK
        VARCHAR password
        VARCHAR email UK
        TIMESTAMP created_at
    }

    projects {
        INT id PK
        VARCHAR name
        TIMESTAMP created_at
    }

    page {
        INT id PK
        VARCHAR name
        TEXT text
    }

    project_pages {
        INT project_id PK, FK
        INT page_id PK, FK
    }

    page_sources {
        INT page_id PK, FK
        INT source_id PK, FK
    }

    permissions {
        INT id PK
        INT user_id FK
        INT project_id FK
        ENUM role
    }

    users ||--o{ permissions : "has"
    projects ||--o{ permissions : "has"
    projects ||--o{ project_pages : "contains"
    page ||--o{ project_pages : "belongs to"
    page ||--o{ page_sources : "has sources"
    page ||--o{ page_sources : "is source of"
```

## Deployment system overview

```mermaid
flowchart TD
    Browser["https://aletheia.espolin.dev/"]

    Browser -->|DNS query| CF_DNS

    CF_DNS["**Cloudflare DNS**\nReturns edge IP address"]

    CF_DNS -->|"TCP / TLS handshake"| CF_Edge

    CF_Edge["**Cloudflare edge server**\nTLS termination, caching"]

    CF_Edge --> CF_Tunnel

    CF_Tunnel["**Cloudflare tunnel network**\nTunnel endpoint"]

    CF_Tunnel -->|"TLS tunnel\n(outbound from VM)"| cloudflared

    subgraph VM["Oracle Cloud VM ---- docker compose"]
        cloudflared["**cloudflared**\nTunnel daemon"]
        cloudflared -->|":3001"| App

        App["**Container 1: app**\nBuilds & runs the application\nContains all source code"]
        App -->|":3306"| DB

        DB["**Container 2: db**\nMariaDB"]
    end

    style VM fill:#1e2a3a,stroke:#4a6fa5,stroke-width:2px,color:#cdd9e5
    style CF_DNS fill:#7c4a00,stroke:#f0a500,color:#ffd580
    style CF_Edge fill:#7c4a00,stroke:#f0a500,color:#ffd580
    style CF_Tunnel fill:#7c4a00,stroke:#f0a500,color:#ffd580
    style cloudflared fill:#2d3748,stroke:#718096,color:#e2e8f0
    style App fill:#1a3a2a,stroke:#38a169,color:#9ae6b4
    style DB fill:#1a2a3a,stroke:#3182ce,color:#90cdf4
    style Browser fill:#2d3748,stroke:#718096,color:#e2e8f0
```

## License

This project is licensed under the [GNU AFFERO GENERAL PUBLIC LICENSE](LICENSE).