#!/usr/bin/env bash
# Behaviour tests: real helper, disposable cwd, package-manager boundary fixture.
set -eu
HELPER="$(cd "$(dirname "$0")" && pwd)/find-polluter.sh"
ROOT=$(mktemp -d /tmp/test-find-polluter.XXXXXX)
trap 'rm -rf "$ROOT"' EXIT
mkdir "$ROOT/bin"
cat > "$ROOT/bin/npm" <<'RUNNER'
#!/usr/bin/env bash
[ "$#" -eq 2 ] && [ "$1" = test ] || exit 99
printf '%s\n' "$2" >> calls
bash "$2"
RUNNER
chmod +x "$ROOT/bin/npm"
export PATH="$ROOT/bin:$PATH"
fail() { echo "FAIL: $CASE: $*"; printf '%s\n' "$OUTPUT"; exit 1; }
contains() { [[ "$OUTPUT" == *"$1"* ]] || fail "missing: $1"; }
not_clean() { [[ "$OUTPUT" != *'all tests clean'* ]] || fail 'false clean claim'; }
run() {
  STATUS=0
  OUTPUT=$(bash "$HELPER" "$POLLUTION" "$PATTERN" 2>&1) || STATUS=$?
}
FAILED=0
for CASE in no-matches clean failed skipped-file skipped-dir skipped-link polluter failed-polluter spaced-path; do
  if (
    mkdir "$ROOT/$CASE"; cd "$ROOT/$CASE"
    POLLUTION='pollution state'; PATTERN='src/**/*.test.sh'
    mkdir -p src/nested
    case "$CASE" in
      no-matches)
        run
        [ "$STATUS" -ne 0 ] || fail 'no matches must not succeed'
        [ ! -e calls ] || fail 'executed without matches'
        contains 'Executed: 0'; not_clean ;;
      clean|spaced-path)
        TEST=src/top.test.sh
        if [ "$CASE" = spaced-path ]; then TEST='src/nested/a [x] test.test.sh'; PATTERN='./src/**/*.test.sh'; fi
        printf 'echo clean-output\n' > "$TEST"
        run
        [ "$STATUS" -eq 0 ] || fail "status $STATUS"
        [ "$(< calls)" = "./$TEST" ] || fail 'wrong test path or invocation count'
        [ ! -e "$POLLUTION" ] || fail 'unexpected pollution'
        contains clean-output; contains 'Executed: 1'; contains 'Failed: 0'; contains 'Skipped: 0'
        contains 'No pollution observed. Selected test files run: 1.'; not_clean ;;
      failed)
        printf 'echo failure-stdout; echo failure-stderr >&2; exit 7\n' > src/a.test.sh
        printf 'echo continued\n' > src/z.test.sh
        run
        [ "$STATUS" -eq 7 ] || fail "expected runner status 7, got $STATUS"
        contains failure-stdout; contains failure-stderr; contains continued
        contains 'Executed: 2'; contains 'Failed: 1'; contains 'Skipped: 0'
        [ "$(< calls)" = $'./src/a.test.sh\n./src/z.test.sh' ] || fail 'did not execute both tests once'
        [ ! -e "$POLLUTION" ] || fail 'unexpected pollution'
        not_clean ;;
      skipped-*)
        printf 'touch should-not-run\n' > src/a.test.sh
        case "$CASE" in
          skipped-file) touch "$POLLUTION" ;;
          skipped-dir) mkdir "$POLLUTION" ;;
          skipped-link) ln -s missing-target "$POLLUTION" ;;
        esac
        run
        [ "$STATUS" -ne 0 ] || fail 'skips must not succeed'
        [ ! -e calls ] && [ ! -e should-not-run ] || fail 'ran skipped test'
        contains 'Executed: 0'; contains 'Skipped: 1'; not_clean ;;
      polluter|failed-polluter)
        printf 'echo polluter-output; touch "pollution state"\n' > src/a.test.sh
        WANT=1
        if [ "$CASE" = failed-polluter ]; then echo 'exit 7' >> src/a.test.sh; WANT=7; fi
        printf 'touch should-not-run\n' > src/z.test.sh
        run
        [ "$STATUS" -eq "$WANT" ] || fail "expected status $WANT, got $STATUS"
        contains 'FOUND POLLUTER'; contains 'Test: ./src/a.test.sh'; contains polluter-output
        [ -e "$POLLUTION" ] && [ ! -e should-not-run ] || fail 'incorrect effects'
        [ "$(< calls)" = './src/a.test.sh' ] || fail 'incorrect attribution'
        not_clean ;;
    esac
    echo "PASS: $CASE"
  ); then :; else FAILED=$((FAILED + 1)); fi
done
printf 'Failed cases: %s\n' "$FAILED"
[ "$FAILED" -eq 0 ]
