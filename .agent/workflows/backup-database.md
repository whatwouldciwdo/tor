---
description: how to backup and restore the database
---

# Database Backup & Restore

## Backup Database

Run the backup script:

```bash
./backup-db.sh
```

This will:

- Create a timestamped backup file in `./backups/` folder
- Format: `tor_backup_YYYYMMDD_HHMMSS.sql`
- Automatically clean up old backups (keeps last 7)
- Show backup size and location

**Backup location:** `./backups/tor_backup_YYYYMMDD_HHMMSS.sql`

---

## Restore Database

⚠️ **WARNING**: This will replace ALL current data!

```bash
./restore-db.sh backups/tor_backup_YYYYMMDD_HHMMSS.sql
```

The script will:

- Ask for confirmation before proceeding
- Restore all data from the backup file
- Show progress and completion status

---

## Manual Commands (Advanced)

### Manual Backup

```bash
pg_dump -h localhost -U postgres -d tor_db > backup.sql
```

### Manual Restore

```bash
psql -h localhost -U postgres -d tor_db < backup.sql
```

---

## Automated Backup (Optional)

### Daily backup using cron:

```bash
# Edit crontab
crontab -e

# Add this line for daily backup at 2 AM
0 2 * * * cd /path/to/tor-online && ./backup-db.sh
```

---

## Backup Before Important Changes

Always create a backup before:

- Running migrations (`npx prisma migrate`)
- Bulk data operations
- Major code deployments
- Schema changes
