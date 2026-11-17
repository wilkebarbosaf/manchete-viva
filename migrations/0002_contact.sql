CREATE TABLE IF NOT EXISTS contact_messages (
 id TEXT PRIMARY KEY,
 name TEXT NOT NULL,
 email TEXT NOT NULL,
 subject TEXT NOT NULL,
 message TEXT NOT NULL,
 consent_version TEXT NOT NULL DEFAULT '2026-11-16',
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS contact_messages_created ON contact_messages(created_at);
CREATE TABLE IF NOT EXISTS contact_limits (key TEXT PRIMARY KEY, hits INTEGER NOT NULL DEFAULT 1, expires_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS contact_limits_expiry ON contact_limits(expires_at);
