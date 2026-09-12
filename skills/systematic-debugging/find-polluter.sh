#!/usr/bin/env bash
# Bisection script to find which test creates unwanted files/state
# Usage: ./find-polluter.sh <file_or_dir_to_check> <test_pattern>
# Example: ./find-polluter.sh '.git' 'src/**/*.test.ts'

set -e

if [ $# -ne 2 ]; then
  echo "Usage: $0 <file_to_check> <test_pattern>"
  echo "Example: $0 '.git' 'src/**/*.test.ts'"
  exit 1
fi

POLLUTION_CHECK="$1"
TEST_PATTERN="$2"

echo "🔍 Searching for test that creates: $POLLUTION_CHECK"
echo "Test pattern: $TEST_PATTERN"
echo ""

# Get list of test files (find . emits ./-prefixed paths, so accept the
# pattern written with or without a leading ./)
TEST_PATTERN="${TEST_PATTERN#./}"
# find -path can't match '**/' against zero directory levels, so a pattern
# like src/**/*.test.ts would skip src/top.test.ts; also try the pattern
# with '**/' collapsed to cover files directly under the base directory.
TEST_FILES=$(find . \( -path "./$TEST_PATTERN" -o -path "./${TEST_PATTERN//\*\*\//}" \) | sort -u)
if [ -z "$TEST_FILES" ]; then
  TOTAL=0
else
  TOTAL=$(printf '%s\n' "$TEST_FILES" | wc -l | tr -d ' ')
fi

echo "Found $TOTAL test files"
echo ""

COUNT=0
EXECUTED=0
FAILED=0
SKIPPED=0
RESULT=0
while IFS= read -r TEST_FILE; do
  [ -n "$TEST_FILE" ] || continue
  COUNT=$((COUNT + 1))

  # Skip if pollution already exists
  if [ -e "$POLLUTION_CHECK" ] || [ -L "$POLLUTION_CHECK" ]; then
    SKIPPED=$((SKIPPED + 1))
    echo "⚠️  Pollution already exists before test $COUNT/$TOTAL"
    echo "   Skipping: $TEST_FILE"
    continue
  fi

  echo "[$COUNT/$TOTAL] Testing: $TEST_FILE"

  # Keep command output visible and retain the first failing status.
  EXECUTED=$((EXECUTED + 1))
  if npm test "$TEST_FILE"; then
    echo "   Passed: $TEST_FILE"
  else
    STATUS=$?
    FAILED=$((FAILED + 1))
    if [ "$RESULT" -eq 0 ]; then RESULT=$STATUS; fi
    echo "   Failed (status $STATUS): $TEST_FILE"
  fi

  # Check even after failure: a failing test can still be the polluter.
  if [ -e "$POLLUTION_CHECK" ] || [ -L "$POLLUTION_CHECK" ]; then
    echo ""
    echo "🎯 FOUND POLLUTER!"
    echo "   Test: $TEST_FILE"
    echo "   Created: $POLLUTION_CHECK"
    echo ""
    echo "Pollution details:"
    ls -la -- "$POLLUTION_CHECK" || :
    echo ""
    echo "To investigate:"
    echo "  npm test $TEST_FILE    # Run just this test"
    echo "  cat $TEST_FILE         # Review test code"
    echo "Executed: $EXECUTED; Failed: $FAILED; Skipped: $SKIPPED; Not run: $((TOTAL - COUNT))"
    if [ "$RESULT" -ne 0 ]; then exit "$RESULT"; fi
    exit 1
  fi
done <<< "$TEST_FILES"

echo ""
echo "Executed: $EXECUTED; Failed: $FAILED; Skipped: $SKIPPED"
if [ "$TOTAL" -eq 0 ] || [ "$FAILED" -ne 0 ] || [ "$SKIPPED" -ne 0 ]; then
  echo "⚠️  Inconclusive: no matches, failed tests, or skipped tests; cleanliness not established."
  if [ "$RESULT" -ne 0 ]; then exit "$RESULT"; fi
  exit 1
fi
echo "No pollution observed. Selected test files run: $EXECUTED."
exit 0
