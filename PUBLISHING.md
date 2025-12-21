# Publishing Guide

## Prerequisites

1. npm account with publish access
2. GitHub repository created at `github.com/botanarede/beddel`

## Setup Standalone Repository

```bash
# From packages/beddel directory
git init
git remote add origin https://github.com/botanarede/beddel.git
```

## Pre-publish Checklist

- [ ] Update version in `package.json`
- [ ] Update `CHANGELOG.md` with changes
- [ ] Run `pnpm build` (or `npm run build`)
- [ ] Run `pnpm test` (or `npm test`)
- [ ] Run `pnpm lint` (or `npm run lint`)
- [ ] Verify package contents: `npm pack --dry-run`

## Publishing

```bash
# Login to npm (first time only)
npm login

# Publish to npm
npm publish

# Or with specific tag
npm publish --tag beta
```

## Version Bumping

```bash
# Patch release (0.2.3 -> 0.2.4)
npm run version:patch

# Minor release (0.2.3 -> 0.3.0)
npm run version:minor

# Major release (0.2.3 -> 1.0.0)
npm run version:major
```

## Post-publish

1. Push tags to GitHub: `git push --tags`
2. Create GitHub release with changelog notes
