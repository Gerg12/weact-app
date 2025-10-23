# CI/CD Quick Start Guide

## 🚀 Getting Started with GitLab CI/CD

### Prerequisites

1. GitLab account and repository
2. GitLab Runner configured (or use shared runners)
3. Access to configure CI/CD variables

---

## Step 1: Configure CI/CD Variables

Navigate to: **Settings → CI/CD → Variables**

### Required Variables (Add these first):

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL = https://your-domain.com
NEXT_PUBLIC_GRAPHQL_ENDPOINT = https://your-wordpress.com/graphql

# Stripe (if using payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_...
STRIPE_SECRET_KEY = sk_test_...  (Mark as Masked & Protected)
```

### Optional Variables (Add based on your deployment):

**For Vercel Deployment:**
```bash
VERCEL_TOKEN = your-token-here  (Masked & Protected)
VERCEL_SCOPE = your-team-name
```

**For SonarQube:**
```bash
SONAR_HOST_URL = https://sonarqube.your-domain.com
SONAR_TOKEN = your-sonar-token  (Masked & Protected)
```

---

## Step 2: Enable the Pipeline

1. Commit `.gitlab-ci.yml` to your repository
2. Push to GitLab
3. Pipeline will automatically start!

```bash
git add .gitlab-ci.yml
git commit -m "Add CI/CD pipeline"
git push origin main
```

---

## Step 3: Monitor Your First Pipeline

1. Go to **CI/CD → Pipelines**
2. Click on the running pipeline
3. Watch each stage complete:
   - ✅ Install dependencies
   - ✅ Lint & Type check
   - ✅ Security scan
   - ✅ Build production bundle

---

## Step 4: Configure Deployment

### Option A: Vercel (Recommended)

1. Get Vercel token: https://vercel.com/account/tokens
2. Add to GitLab variables
3. Uncomment Vercel section in `.gitlab-ci.yml`:

```yaml
# Find this in deploy:staging job
- npm install -g vercel
- vercel deploy --token=$VERCEL_TOKEN --scope=$VERCEL_SCOPE --prod=false
```

### Option B: Netlify

1. Get Netlify token and site ID
2. Add to GitLab variables
3. Uncomment Netlify section in `.gitlab-ci.yml`

### Option C: Docker

1. Build and test locally:
```bash
docker build -t headless-storefront .
docker run -p 3000:3000 headless-storefront
```

2. Push to registry in pipeline (already configured)

---

## Step 5: Deploy to Staging

1. Go to **CI/CD → Pipelines**
2. Click on successful pipeline for `develop` branch
3. Find `deploy:staging` job
4. Click **Play** button to deploy

---

## Step 6: Deploy to Production

1. Merge to `main` branch
2. Go to pipeline
3. Find `deploy:production` job
4. Click **Play** button (requires manual approval)
5. Confirm deployment

---

## 🔧 Local Testing

### Test Docker Build Locally

```bash
# Build image
docker build -t headless-storefront:local .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_GRAPHQL_ENDPOINT=your-endpoint \
  headless-storefront:local

# Test health check
curl http://localhost:3000/api/health
```

### Test with Docker Compose

```bash
# Create .env file
cp .env.example .env
# Edit .env with your values

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 📊 View Pipeline Results

### Build Artifacts
1. Go to pipeline job
2. Click **Browse** under artifacts
3. Download `.next/` build output

### Test Coverage
1. Go to `test:unit` job
2. View coverage report in artifacts
3. Check coverage trends over time

### Security Reports
1. Go to `security:*` jobs
2. Download security scan reports
3. Review vulnerabilities

---

## 🐛 Troubleshooting

### Pipeline Fails at Install Stage

```bash
# Clear cache manually
# Go to: CI/CD → Pipelines → Clear Runner Caches
```

### Build Fails

Check environment variables:
```bash
# In job logs, verify variables are set
echo $NEXT_PUBLIC_SITE_URL
echo $NEXT_PUBLIC_GRAPHQL_ENDPOINT
```

### Deployment Fails

1. Check deployment credentials
2. Verify server accessibility
3. Review deployment job logs
4. Test connection manually

---

## 📈 Best Practices

### Branch Strategy

```
main (production)
  ↑
develop (staging)
  ↑
feature/* (testing only)
```

### Workflow

1. Create feature branch from `develop`
2. Push code → Pipeline runs lint & tests
3. Create Merge Request
4. Review + Approve
5. Merge to `develop` → Deploy to staging
6. Test staging
7. Merge to `main` → Deploy to production

---

## 🎯 Common Tasks

### Run Pipeline for Specific Branch

```bash
git checkout feature/my-feature
git push origin feature/my-feature
# Pipeline starts automatically
```

### Manually Trigger Pipeline

1. Go to **CI/CD → Pipelines**
2. Click **Run Pipeline**
3. Select branch
4. Add variables if needed
5. Click **Run**

### View Pipeline Logs

```bash
# Using GitLab CLI (if installed)
glab ci view

# Or use web interface
# CI/CD → Pipelines → Click pipeline → Click job
```

### Cancel Running Pipeline

1. Go to running pipeline
2. Click **Cancel** button
3. Confirm cancellation

---

## 🔐 Security Checklist

- [ ] All secrets marked as "Masked" and "Protected"
- [ ] Branch protection enabled on `main`
- [ ] Required approvals configured
- [ ] Security scans passing
- [ ] No secrets in code repository

---

## 📚 Additional Resources

- [GitLab CI/CD Documentation](https://docs.gitlab.com/ee/ci/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [SonarQube Setup](https://docs.sonarqube.org/latest/)

---

## 🆘 Need Help?

1. Check `.gitlab-ci-README.md` for detailed documentation
2. Review job logs in GitLab
3. Check GitLab Runner status
4. Verify CI/CD variable configuration
5. Test locally with Docker

---

## ✅ Quick Verification

After setup, verify everything works:

```bash
# 1. Pipeline runs on push
git commit --allow-empty -m "Test pipeline"
git push

# 2. Health check works
curl https://your-staging-url.com/api/health

# 3. Build artifacts created
# Check in GitLab UI → Pipeline → Job → Artifacts

# 4. Security scans complete
# Check security:* jobs in pipeline
```

---

## 🎉 You're Ready!

Your CI/CD pipeline is now configured and ready to automate your deployments!

Next steps:
- Add unit tests
- Configure E2E tests
- Set up monitoring
- Add performance budgets

