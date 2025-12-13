# LMS Project - Deployment Guide

## Overview
This guide will walk you through deploying your LMS project with:
- **Backend**: Django REST API on Render (Free tier)
- **Frontend**: React application on Vercel (Free tier)
- **Database**: PostgreSQL (provided by Render)

---

## 📋 Pre-Deployment Checklist

✅ All code pushed to GitHub  
✅ Deployment files created (runtime.txt, build.sh, Procfile, vercel.json)  
✅ Production dependencies added (dj-database-url, gunicorn, whitenoise)  
✅ Settings configured for environment variables  

---

## 🚀 Part 1: Deploy Backend to Render

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Click "Get Started" or "Sign Up"
3. Sign up with GitHub (recommended for easy repo access)

### Step 2: Create New Web Service
1. From Render dashboard, click **"New +"** → **"Web Service"**
2. Click **"Connect a repository"** (or "Configure account" if first time)
3. Authorize Render to access your GitHub repositories
4. Select your repository: `LucyBurns87/lms-project`

### Step 3: Configure Web Service
Fill in the following settings:

| Field | Value |
|-------|-------|
| **Name** | `lms-backend` (or your preferred name) |
| **Region** | Choose closest to you (e.g., Oregon, Frankfurt) |
| **Root Directory** | `backend` |
| **Environment** | `Python 3` |
| **Build Command** | `chmod +x build.sh && ./build.sh` |
| **Start Command** | `gunicorn lms_backend.wsgi:application` |
| **Plan** | `Free` |

### Step 4: Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"** and add these:

| Key | Value | Notes |
|-----|-------|-------|
| `SECRET_KEY` | Generate new key (see below) | **REQUIRED** |
| `DEBUG` | `False` | **REQUIRED** |
| `ALLOWED_HOSTS` | `.onrender.com` | **REQUIRED** |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000` | Update after frontend deployment |
| `PYTHON_VERSION` | `3.11.9` | Matches runtime.txt |

**Generate SECRET_KEY:**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Step 5: Deploy Backend
1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies from requirements.txt
   - Run build.sh (collectstatic + migrations)
   - Start gunicorn server
3. Wait 5-10 minutes for first deployment
4. **Copy your backend URL** (e.g., `https://lms-backend-xxxx.onrender.com`)

### Step 6: Verify Backend Deployment
Test these endpoints in your browser:
- `https://lms-backend-xxxx.onrender.com/api/` - Should show API root
- `https://lms-backend-xxxx.onrender.com/admin/` - Should show Django admin

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Sign up with GitHub (recommended)

### Step 2: Import Project
1. From Vercel dashboard, click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Select your repository: `LucyBurns87/lms-project`
4. Click **"Import"**

### Step 3: Configure Project
| Field | Value |
|-------|-------|
| **Project Name** | `lms-frontend` |
| **Framework Preset** | `Create React App` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` (auto-detected) |
| **Output Directory** | `build` (auto-detected) |

### Step 4: Add Environment Variable
Click **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://lms-backend-xxxx.onrender.com/api` |

⚠️ **Important**: Replace `xxxx` with your actual Render backend URL from Part 1, Step 5.

### Step 5: Deploy Frontend
1. Click **"Deploy"**
2. Vercel will automatically:
   - Install npm dependencies
   - Build React app
   - Deploy to CDN
3. Wait 2-3 minutes
4. **Copy your frontend URL** (e.g., `https://lms-frontend.vercel.app`)

---

## 🔗 Part 3: Connect Frontend & Backend

### Step 1: Update Backend CORS Settings
1. Go back to Render dashboard
2. Click on your `lms-backend` service
3. Go to **"Environment"** tab
4. Find `CORS_ALLOWED_ORIGINS` variable
5. Update value to include your Vercel URL:
   ```
   https://lms-frontend.vercel.app,http://localhost:3000
   ```
6. Click **"Save Changes"**
7. Service will automatically redeploy (takes 2-3 minutes)

### Step 2: Update ALLOWED_HOSTS
1. In the same Environment tab, find `ALLOWED_HOSTS`
2. Update to:
   ```
   .onrender.com,.vercel.app,lms-backend-xxxx.onrender.com
   ```
3. Click **"Save Changes"**

---

## ✅ Part 4: Test Your Deployment

### Test Backend
1. Open: `https://lms-backend-xxxx.onrender.com/api/`
2. You should see the API root with links to endpoints
3. Try: `https://lms-backend-xxxx.onrender.com/api/courses/`
   - Should return `[]` or list of courses

### Test Frontend
1. Open: `https://lms-frontend.vercel.app`
2. Try to register a new user
3. Try to login
4. Navigate through the app

### Test Integration
1. Login as a student
2. Try to submit an assignment
3. Login as a teacher
4. Check if you can see enrollments
5. Verify all features work end-to-end

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Build fails with "Module not found"
- **Solution**: Make sure all dependencies are in `backend/requirements.txt`
- Run: `pip freeze > requirements.txt` locally and push

**Problem**: "SECRET_KEY not set" error
- **Solution**: Add SECRET_KEY environment variable in Render
- Generate with: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`

**Problem**: Database migrations fail
- **Solution**: Check Render logs for specific error
- May need to run migrations manually via Render Shell:
  ```bash
  python manage.py migrate
  ```

**Problem**: Static files not loading (admin panel looks unstyled)
- **Solution**: Verify whitenoise is in requirements.txt and middleware
- Check `collectstatic` ran in build.sh

**Problem**: CORS errors in browser console
- **Solution**: Update CORS_ALLOWED_ORIGINS to include your Vercel URL
- Make sure no trailing slashes in URLs

### Frontend Issues

**Problem**: "Failed to fetch" or "Network Error"
- **Solution**: Check REACT_APP_API_URL is correct
- Verify backend is running
- Check browser console for CORS errors

**Problem**: Build fails with "Cannot find module"
- **Solution**: Make sure package.json has all dependencies
- Try running `npm install` locally and pushing updated package-lock.json

**Problem**: Environment variable not working
- **Solution**: Rebuild deployment after adding env vars
- In Vercel: Deployments → Three dots → Redeploy

**Problem**: Routing doesn't work (404 on refresh)
- **Solution**: Verify vercel.json exists with SPA routing config

### Database Issues

**Problem**: Need to access production database
- **Solution**: Use Render Shell:
  1. Go to Render dashboard → your service
  2. Click "Shell" tab
  3. Run: `python manage.py dbshell`

**Problem**: Want to load initial data
- **Solution**: 
  1. Create fixtures locally: `python manage.py dumpdata > fixtures.json`
  2. Add fixtures to repo
  3. In Render Shell: `python manage.py loaddata fixtures.json`

---

## 📊 Monitoring & Maintenance

### View Logs
- **Render**: Dashboard → Service → "Logs" tab
- **Vercel**: Dashboard → Project → "Deployments" → Click deployment → "View Function Logs"

### Render Free Tier Limitations
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month (enough for one service)
- **Workaround**: Use a service like UptimeRobot to ping your backend every 14 minutes

### Vercel Free Tier
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- Global CDN

---

## 🔒 Security Checklist

Before going live, verify:
- [ ] DEBUG=False in production
- [ ] SECRET_KEY is unique and secret (not in git)
- [ ] ALLOWED_HOSTS configured correctly
- [ ] CORS_ALLOWED_ORIGINS only includes your domains
- [ ] Database credentials are secure
- [ ] SSL/HTTPS enabled (automatic on Render/Vercel)
- [ ] Admin panel has strong password

---

## 🚀 Next Steps

1. **Custom Domain** (Optional):
   - Render: Settings → Custom Domain → Add your domain
   - Vercel: Settings → Domains → Add your domain

2. **Set Up Monitoring**:
   - Use [UptimeRobot](https://uptimerobot.com) to monitor uptime
   - Set up email alerts for downtime

3. **Database Backups**:
   - Render provides automatic backups on paid plans
   - For free tier, periodically export data:
     ```bash
     python manage.py dumpdata > backup.json
     ```

4. **Performance Optimization**:
   - Enable Redis caching (requires paid plan)
   - Optimize database queries
   - Compress frontend assets

---

## 📞 Support

- **Render Documentation**: https://render.com/docs
- **Vercel Documentation**: https://vercel.com/docs
- **Django Deployment**: https://docs.djangoproject.com/en/4.2/howto/deployment/

---

## 📝 Your Deployment URLs

Fill these in after deployment:

- **Backend URL**: `https://lms-backend-xxxx.onrender.com`
- **Frontend URL**: `https://lms-frontend.vercel.app`
- **Admin Panel**: `https://lms-backend-xxxx.onrender.com/admin/`

---

**Deployment Date**: December 13, 2025  
**Last Updated**: December 13, 2025
