#!/usr/bin/env bash
# Debounced auto-commit + push.
#
# Strategy:
#   1. Stage everything and stamp a "pending commit" marker file.
#   2. Spawn a background watcher that waits DEBOUNCE seconds. Each subsequent
#      hook invocation refreshes the marker — the watcher only fires when no
#      new edit has landed for the full debounce window.
#   3. Inside the window: typecheck must pass, otherwise we DON'T commit.
#      That guarantees every commit on origin/main is green.
#
# Env knobs:
#   AUTO_COMMIT_DEBOUNCE  — seconds to wait quietly before committing (default 30)
#   AUTO_COMMIT_TYPECHECK — set to "0" to skip the tsc gate (default on)

set -euo pipefail

REPO="/Users/sumeet/sumeet/Projects/Holiday-Planner"
DEBOUNCE="${AUTO_COMMIT_DEBOUNCE:-30}"
DO_TYPECHECK="${AUTO_COMMIT_TYPECHECK:-1}"
MARKER="$REPO/.claude/auto-commit.pending"
LOCK="$REPO/.claude/auto-commit.lock"

cd "$REPO"

# Always refresh the marker — a later hook within the debounce window pushes
# the deadline forward, collapsing a burst of edits into a single commit.
date +%s > "$MARKER"

# If a watcher is already running for this debounce window, do nothing.
# The existing watcher will pick up the refreshed marker timestamp.
if [ -f "$LOCK" ]; then
  exit 0
fi

# Spawn the watcher detached so the hook returns immediately.
(
  # Lock so we're the only watcher.
  echo $$ > "$LOCK"
  trap 'rm -f "$LOCK"' EXIT

  while :; do
    last_edit="$(cat "$MARKER" 2>/dev/null || echo 0)"
    now="$(date +%s)"
    quiet_for=$(( now - last_edit ))
    if [ "$quiet_for" -ge "$DEBOUNCE" ]; then
      break
    fi
    # Sleep just past the remaining debounce, never less than 1s.
    remaining=$(( DEBOUNCE - quiet_for ))
    if [ "$remaining" -lt 1 ]; then remaining=1; fi
    sleep "$remaining"
  done

  rm -f "$MARKER"

  # If nothing's actually staged, exit silently.
  git add -A
  if git diff --cached --quiet; then
    exit 0
  fi

  # Optional typecheck gate — only commit if the tree compiles.
  if [ "$DO_TYPECHECK" = "1" ]; then
    if ! npx tsc -b > /tmp/auto-commit-tsc.log 2>&1; then
      echo "[auto-commit] tsc failed — skipping commit. See /tmp/auto-commit-tsc.log" >&2
      exit 0
    fi
  fi

  git commit -m "Auto-commit: file changes" --no-verify --quiet
  git push origin main --quiet 2>/dev/null || true
) >/dev/null 2>&1 &
disown
