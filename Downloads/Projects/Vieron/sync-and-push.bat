@echo off
echo Syncing with remote repository...
echo.

echo Step 1: Fetching remote changes...
git fetch origin
echo.

echo Step 2: Pulling and rebasing...
git pull origin main --rebase
echo.

echo Step 3: Pushing your changes...
git push origin main
echo.

echo Done!
pause