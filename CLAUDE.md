# Development Environment

I develop **everything inside Docker**.

Assume the host machine is only used to edit files.
Do not assume Node.js, npm, pnpm, yarn, PHP, Composer, MySQL, Python, or any other development tools are installed on the host.

## Docker Rules

Always inspect `docker-compose.yml` (or `compose.yml`) first to determine the correct service name.

Run all development commands **inside Docker containers**, never on the host machine.

Examples:

```bash
docker compose exec <service> npm run dev
docker compose exec <service> npm run build
docker compose exec <service> npm run lint
docker compose exec <service> npm test

docker compose exec <service> php artisan migrate
docker compose exec <service> php artisan optimize
docker compose exec <service> composer install

docker compose exec <service> python manage.py migrate
docker compose exec <service> python script.py
```

If a container is not running, start it using Docker Compose.

Use:

```bash
docker compose exec
```

for running containers.

Use:

```bash
docker compose run --rm
```

only when `exec` is not possible.

Never execute commands such as:

- npm
- npx
- node
- yarn
- pnpm
- php
- composer
- artisan
- python
- pip
- mysql

directly on the host machine.

---

# UI Development Rules

When I ask for a UI change:

- Read only the files related to the requested page.
- Avoid scanning the entire project unless necessary.
- Reuse existing components before creating new ones.
- Follow the existing design system and UI patterns.
- Keep styling consistent with neighboring components.
- Make the smallest possible change required.

Do **not**:

- Inspect git history.
- Search unrelated folders.
- Perform unnecessary project-wide analysis.
- Run full lint unless I explicitly request it.

After making UI changes:

- Run only a production build inside Docker to verify the project builds successfully.
- Do not run additional validation unless requested.

---

# Code Changes

Before writing new code:

1. Search for an existing implementation.
2. Reuse existing components and utilities whenever possible.
3. Keep changes localized.
4. Avoid unnecessary refactoring.

If additional files must be modified, explain briefly why before changing them.

---

# Efficiency

Minimize tool usage.

Avoid unnecessary reads, searches, and terminal commands.

Only inspect files directly related to the requested task.

Think first, then execute efficiently.