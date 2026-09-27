#!/usr/bin/env bash
# Rejoue les migrations + tests SQL sur un Postgres local (sans Supabase).
# Usage : PGHOST=... PGPORT=... PGUSER=postgres ./supabase/tests/run.sh
set -euo pipefail
cd "$(dirname "$0")/.."
DB=${TEST_DB:-izenride_test}
psql -v ON_ERROR_STOP=1 -q -c "drop database if exists $DB" -c "create database $DB"
psql -v ON_ERROR_STOP=1 -q -d "$DB" -f tests/00_supabase_stub.sql
for f in migrations/*.sql; do psql -v ON_ERROR_STOP=1 -q -d "$DB" -f "$f"; done
for f in tests/*.test.sql; do
  echo "== $f"
  psql -v ON_ERROR_STOP=1 -q -d "$DB" -f "$f" 2>&1 | grep -E "NOTICE|ERROR" | sed 's/^psql:[^ ]* //'
done
