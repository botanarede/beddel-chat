# Git Workflow Quick Reference

## 🚀 Quick Commands

### Daily Development

```bash
# Work on the package
cd packages/beddel
# ... make changes ...
pnpm run build

# Test in the example app
cd ../..
pnpm dev
```

### Publishing a New Version

```bash
# From the root directory
pnpm run release:package
```

This single command will:
1. Build the package
2. Push to the isolated repository
3. Publish to npm

### Step-by-Step Release (Manual)

```bash
# 1. Update version
cd packages/beddel
pnpm run version:minor  # or version:patch, version:major

# 2. Update CHANGELOG.md manually

# 3. Build
pnpm run build

# 4. Commit to example repo
cd ../..
git add packages/beddel
git commit -m "release: beddel v0.2.0"
git push origin main

# 5. Push to isolated package repo
pnpm run package:push

# 6. Publish to npm
pnpm run package:publish
```

---

## 📦 Available npm Scripts

### Root Package (`/package.json`)

| Script | Description |
|--------|-------------|
| `pnpm run package:build` | Build the beddel package |
| `pnpm run package:push` | Push package to isolated repo (git subtree) |
| `pnpm run package:pull` | Pull changes from isolated repo |
| `pnpm run package:publish` | Publish package to npm |
| `pnpm run package:sync` | Build, commit, and push in one command |
| `pnpm run release:package` | Complete release: build + push + publish |

### Package (`/packages/beddel/package.json`)

| Script | Description |
|--------|-------------|
| `pnpm run build` | Compile TypeScript |
| `pnpm run dev` | Watch mode compilation |
| `pnpm run version:patch` | Bump patch version (0.2.0 → 0.2.1) |
| `pnpm run version:minor` | Bump minor version (0.2.0 → 0.3.0) |
| `pnpm run version:major` | Bump major version (0.2.0 → 1.0.0) |

---

## 🔧 Git Remotes

Check configured remotes:
```bash
git remote -v
```

Expected output:
```
beddel-package  https://github.com/botanarede/beddel-alpha.git (fetch)
beddel-package  https://github.com/botanarede/beddel-alpha.git (push)
origin          https://github.com/botanarede/beddel-alpha-example.git (fetch)
origin          https://github.com/botanarede/beddel-alpha-example.git (push)
```

---

## ⚠️ Common Issues

### "Updates were rejected"

If the isolated repo has changes:
```bash
pnpm run package:pull  # Pull changes first
pnpm run package:push  # Then push
```

### "Remote already exists"

The remote is already configured, you're good to go!

### "Authentication required" during npm publish

```bash
npm login
# Then try again:
pnpm run package:publish
```

---

## 📝 Workflow Example

### Scenario: Adding a new feature

```bash
# 1. Create feature branch (optional)
git checkout -b feature/new-agent-type

# 2. Work on the package
cd packages/beddel/src
# ... edit files ...

# 3. Build and test
cd ..
pnpm run build
cd ../..
pnpm dev  # Test in the example app

# 4. Commit to example repo
git add packages/beddel
git commit -m "feat: add new agent type"
git push origin feature/new-agent-type

# 5. After PR merge to main, release:
git checkout main
git pull
cd packages/beddel
pnpm run version:minor  # 0.2.0 → 0.3.0
cd ../..

# 6. Update CHANGELOG.md

# 7. Release
pnpm run release:package
```

---

## 🎯 Best Practices

✅ **Always build before pushing**: `pnpm run package:build`  
✅ **Update CHANGELOG.md** for every release  
✅ **Use semantic versioning**: patch/minor/major  
✅ **Test in example app** before publishing  
✅ **Commit to example repo first**, then push to package repo  
✅ **Tag releases** in git: `git tag -a beddel-v0.2.0 -m "Release v0.2.0"`
