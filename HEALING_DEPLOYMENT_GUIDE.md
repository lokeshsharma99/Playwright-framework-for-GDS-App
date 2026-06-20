# Auto-Healer Deployment Guide — Lower Environments

## Overview

This guide covers **operational deployment** of the AI Auto-Healer in lower environments (dev, QA, staging) with **automatic PR merging** to keep pipelines healthy without manual intervention.

**Pattern:** 
- ✅ Lower envs → auto-heal enabled, auto-PR enabled, **auto-merge enabled**
- 🔒 Production → auto-heal enabled, auto-PR enabled, **manual review required**

---

## Deployment Scenarios

### Scenario 1: Test/Demo Branch (Current Setup)

**Branch:** `test/auto-heal-demo` (or any feature branch)

**Workflow trigger:** Push to this branch
```yaml
on:
  push:
    branches: [test/auto-heal-demo]
```

**Auto-merge policy:** ✅ Enabled
- Heal PR is automatically merged after validation passes
- Branch protection: None required (or minimal)
- Confidence: High — exploratory test with frequent locator changes

**Usage:**
```bash
# Push test code with broken locators
git push origin test/auto-heal-demo

# Workflow runs:
# 1. Run tests (some fail due to broken locators)
# 2. Auto-healer detects & fixes locators
# 3. Re-run tests to validate fix
# 4. Open heal PR
# 5. **AUTO-MERGE** heal PR (no human click needed)
# 6. Next CI run picks up healed locators ✓
```

---

### Scenario 2: Staging Branch (Dev+QA)

**Branch:** `develop` or `staging`

**Workflow trigger:**
```yaml
on:
  push:
    branches: [develop, staging]
```

**Auto-merge policy:** ✅ Enabled with safeguards
- Heal PR auto-merges only if:
  - Validation re-run **passes 100%** (all tests green)
  - No concurrent failures detected
  - PR is from the auto-healer bot account (not human)

**Label-based gating:**
```bash
# Only auto-merge if labeled "auto-heal"
# Manually-opened PRs get labeled "manual-fix" (skip auto-merge)

if [ "$PR_LABEL" = "auto-heal" ] && [ "$VALIDATION_EXIT_CODE" = "0" ]; then
  gh pr merge --auto --squash
fi
```

**Usage:**
```bash
# QA discovers test flakes due to locator drift
# Commits test fix on staging
git push origin staging

# Workflow auto-heals & merges
# → Dev/QA notified of fix via PR (without toil)
```

---

### Scenario 3: Production (main)

**Branch:** `main`

**Workflow trigger:**
```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

**Auto-merge policy:** ❌ DISABLED

Workflow steps:
```yaml
- name: Auto-merge heal PR (lower env policy)
  if: github.ref_name != 'main'  # SKIP on main
  run: gh pr merge --auto --squash || true

- name: "Prod: Heal PR requires review"
  if: github.ref_name == 'main'
  run: |
    echo "✅ Heal PR opened for manual review"
    echo "Link: $PR_URL"
    # PR sits in queue for code owner approval
```

**Approval flow (manual):**
1. Auto-healer detects broken locator in prod tests
2. Opens heal PR with suggested fix + explanation
3. **Code owner reviews** fix for correctness
4. Code owner manually merges (or requests changes)
5. Next prod deployment includes healed locators

**Rationale:**
- Prod tests are trusted, rare failures
- Locator changes should be intentional & reviewed
- Zero risk of unreviewed code changes landing in prod

---

## Branch Protection Rules

### Lower Envs (test, develop, staging)

```yaml
# GitHub Settings → Branches → Branch protection rule
# for develop, staging, test/*

Require a pull request before merging: OFF
  (Allow direct push + immediate merge)

Allow auto-merge: ✅ ON
  (Bots can auto-merge heal PRs)

Require status checks to pass before merging: ✅ ON
  (Heal PR only merges after tests pass)

Require branches to be up to date: OFF
  (Fast-track auto-merge without rebasing)

Allow force pushes: ✅ ON
  (Allow healer to rebase/rewrite if needed)
```

### Production (main)

```yaml
# GitHub Settings → Branches → Branch protection rule
# for main

Require a pull request before merging: ✅ ON
  (All changes via PR)

Require approvals: ✅ ON
  (At least 1 code owner approval)

Require status checks to pass before merging: ✅ ON
  (Tests must pass + CI green)

Require branches to be up to date: ✅ ON
  (Must be rebased before merge)

Allow auto-merge: ❌ OFF
  (No bots can auto-merge)

Allow force pushes: ❌ OFF
  (Preserve audit trail)

Dismiss stale pull request approvals: ✅ ON
  (If commits pushed, re-review)
```

---

## Workflow Configuration Examples

### Lower Env: Always Auto-Merge

```yaml
name: Test + Auto-heal
on:
  push:
    branches: [develop, test/*, staging]

jobs:
  test-heal:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run tests
        run: npm test --trace on
        continue-on-error: true
      
      - uses: bunnycodec/auto_healing_framework@v1
        id: heal
        with:
          auto-pr: true
          mode: azure-openai
      
      - name: Auto-merge heal PR (lower env)
        if: steps.heal.outcome == 'success'
        run: |
          PR_URL="$(grep -Eo 'https://github.com/.*' heal-output.txt | head -n1)"
          if [ -n "$PR_URL" ]; then
            REPO="$(echo "$PR_URL" | sed 's|.*/||' | sed 's| .*||')"
            PR_NUM="$(echo "$PR_URL" | grep -oE '[0-9]+$')"
            gh pr merge "$PR_NUM" --repo "$REPO" --auto --squash --delete-branch || true
          fi
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Prod: Manual Review Required

```yaml
name: Test + Auto-heal (Prod)
on:
  push:
    branches: [main]

jobs:
  test-heal:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run tests
        run: npm test --trace on
        continue-on-error: true
      
      - uses: bunnycodec/auto_healing_framework@v1
        with:
          auto-pr: true
          mode: azure-openai
      
      # NO AUTO-MERGE STEP
      # PR sits for human review

      - name: Notify on heal PR
        if: failure()
        run: |
          echo "🔒 Heal PR opened for manual review on main"
          echo "⚠️  Do NOT auto-merge prod PRs"
          echo "→ Visit Actions tab to review"
```

---

## Monitoring & Auditing

### Track Auto-Merged Heals

```bash
# Count auto-merged heals per branch
gh pr list --state merged \
  --search "label:auto-heal branch:develop" \
  --json number,mergedAt,author \
  --jq 'length'

# View recent auto-merges
gh pr list --state merged \
  --search "label:auto-heal" \
  --json number,title,mergedAt,author
```

### Alert on High Failure Rate

If same locator is healed more than 3× in 7 days → escalate:
```bash
# Query: SELECT FAIL_LOCATOR, COUNT(*) 
#        FROM HEALS WHERE DATE > NOW - 7DAYS
#        GROUP BY FAIL_LOCATOR HAVING COUNT > 3

# Interpretation: Locator is inherently fragile → needs redesign
```

---

## Risk Mitigation

| Risk | Detection | Mitigation |
|---|---|---|
| Bad fix auto-merged | Validation re-run fails | Rollback: revert merge, re-run with `--dry-run` |
| Wrong branch auto-merges | Branch filter fails | Check workflow `if: github.ref_name` condition |
| Unreviewed prod change | Manual gate skipped | Tag "main" branch with `allow_automerge: false` |
| Merge bot account compromised | Unexpected PR open | Audit PR history for suspicious merges |
| Many false positives | High churn | Run report-only (--dry-run) first; tune AI mode |

---

## Rollout Playbook (8 Weeks)

### Week 1–2: Measure Pain
- Track manual locator fixes in lower envs
- Estimate FTE toil (e.g., 2 hrs/day on locator fixes)

### Week 3–4: Pilot Report-Only
- Deploy healer in `--dry-run` mode on develop
- Generate heal reports but don't open PRs
- Tune AI engine (switch to azure-openai if rule-engine too noisy)

### Week 5: Security Review
- Code review: auto-healer codebase + workflow logic
- Permissions audit: healer bot has only `contents:write` + `pull-requests:write`
- Secrets: AI_API_KEY rotation & audit

### Week 6: Enable Auto-PR (Report → PR)
- Enable `--auto-pr` on develop only
- PRs require manual merge (no auto-merge yet)
- Validate: healers' PRs are correct ~95% of the time

### Week 7: Enable Auto-Merge (Test Branches)
- Enable `--auto-merge` on test/* and staging only
- Monitor: merge rate, re-run failures, rollback frequency
- Alert threshold: if rollback > 2×/week → disable

### Week 8: Production Ready
- Hardened workflow in place
- Prod branch protection: manual review required
- Runbook documented for ops team

---

## FAQ

**Q: What if auto-merge merges a bad fix?**  
A: Validation step re-runs tests first. If validation fails, PR is not created → no merge. If a fix slips through (rare), next test run detects the same locator is still broken → flag as regression → manually revert.

**Q: Can I auto-merge PRs on main?**  
A: ❌ Not recommended. Prod test changes must be intentional & approved. Use auto-merge only on dev/staging.

**Q: What if the healer is wrong 50% of the time?**  
A: Use `--dry-run` to generate reports first; don't open PRs. Then tune the AI engine: switch to `azure-openai` or adjust confidence thresholds.

**Q: How do I rollback a bad merge?**  
A: `git revert <commit-hash> && git push origin <branch>`. Healer will detect the reverted locator on next run and offer another fix.

---

## Next Steps

1. ✅ Decide: Which branches allow auto-merge? (test/*, develop, staging)
2. ✅ Configure: Branch protection rules per environment
3. ✅ Deploy: Update workflows with auto-merge logic
4. ✅ Monitor: Set up alerts for high failure rates
5. ✅ Communicate: Notify team of new auto-heal behavior

---

**Questions?** See main [README.md](README.md) or file an issue.
