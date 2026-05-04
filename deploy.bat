@echo off
echo ============================================
echo   Hexo One-Click Deploy and Backup Script
echo ============================================

:: 1. Clean and Generate (Using npx to avoid "command not found" issue)
echo [1/3] Cleaning and generating static files...
call npx hexo clean
call npx hexo g

:: 2. Deploy to GitHub Pages
echo [2/3] Deploying to GitHub Pages...
call npx hexo d

:: 3. Backup source code to Git
echo [3/3] Backing up source code to Git...

:: Check if git repository is initialized
if not exist .git (
    echo [Info] Initializing Git repository and adding remote...
    git init
    git remote add origin https://github.com/amerdommi241-oss/.github.io.git
)

git add .
git commit -m "Auto-update content and backup source"

:: Try to push to main branch
echo [Info] Pushing to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo [Info] Failed to push to main, trying master branch...
    git push origin master
)

echo.
echo ============================================
echo   All tasks completed successfully!
echo ============================================
pause
