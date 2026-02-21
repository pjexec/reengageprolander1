---
description: Deploy lander to Railway after making changes
---

# Deploy to Railway

Use this workflow when the user asks to "push" or "deploy" changes to the lander.

// turbo-all

1. Stage all changes:
```bash
git add -A
```

2. Commit with a descriptive message:
```bash
git commit -m "<descriptive message about changes>"
```

3. Push to GitHub:
```bash
git push
```

4. Deploy to Railway:
```bash
cd /Users/chuckmullaney/Documents/PainlessAI/reengage_lander2/reengageprolander1-repo && railway up --detach
```

The deployment will be queued and built on Railway. The user can check the build logs at the Railway dashboard if needed.
