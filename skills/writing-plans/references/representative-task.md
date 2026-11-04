# Representative task

This hypothetical Python invitation service keeps the short production body because code states the decision more compactly than prose. Its paths and commands are examples, not checks to run in this skill repository.

````markdown
## Task 1: Reject expired invitation acceptance

**Commit:** `fix: reject expired invitation acceptance`

**Behaviour:** Acceptance rejects invitations expiring at or before now.
**Scenario:** Existing acceptance function -> expiry check -> accepted-state update.
**Observable outcome:** Expired invitations remain unaccepted; a future invitation becomes accepted.
**Dependencies:** None.
**Files:** Modify `src/invitations/acceptance.py`; create `tests/invitations/test_acceptance.py`.
**Interfaces:** Preserve `accept_invitation(invitation: Invitation, now: datetime) -> Literal["expired", "accepted"]`. Existing `Invitation` is a dataclass with `expires_at: datetime` and `accepted: bool = False`, in the same module. Both timestamps are UTC-aware.

**Implementation:** Write this test first in `tests/invitations/test_acceptance.py`:

```python
from datetime import datetime

import pytest

from invitations.acceptance import Invitation, accept_invitation


@pytest.mark.parametrize(
    "expiry, expected_result, expected_accepted",
    [
        ("2030-01-01T11:59:59+00:00", "expired", False),
        ("2030-01-01T12:00:00+00:00", "expired", False),
        ("2030-01-01T12:00:01+00:00", "accepted", True),
    ],
)
def test_acceptance_expiry(expiry, expected_result, expected_accepted):
    invitation = Invitation(expires_at=datetime.fromisoformat(expiry))
    now = datetime.fromisoformat("2030-01-01T12:00:00+00:00")

    assert accept_invitation(invitation, now) == expected_result
    assert invitation.accepted is expected_accepted
```

After observing RED, replace the existing function in `src/invitations/acceptance.py` with this complete body. Retain the existing dataclass and imports of `datetime` and `Literal`:

```python
def accept_invitation(
    invitation: Invitation, now: datetime
) -> Literal["expired", "accepted"]:
    if invitation.expires_at <= now:
        return "expired"
    invitation.accepted = True
    return "accepted"
```

**Exclusions:** Persistence, invitation revocation, new dependencies and additional validation.
**Concrete cases:** The test supplies exact timestamps, return values and resulting accepted state for before/equal/after expiry. No additional layer participates in this example.
**Verification:** Run `uv run pytest tests/invitations/test_acceptance.py -v` before implementation and observe the two expired rows fail. After implementation, the same command passes all three rows and checks the returned result and state together. Run the project's required checks.
````
