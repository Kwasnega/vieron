@echo off
echo Fixing Git remote URL...
echo.

echo Current remote:
git remote -v
echo.

echo Removing incorrect remote...
git remote remove origin
echo.

echo Adding correct remote (vieron)...
git remote add origin https://github.com/Kwasnega/vieron.git
echo.

echo New remote:
git remote -v
echo.

echo Attempting to push...
git push -u origin main
echo.

echo If push failed, you may need to pull first:
echo git pull origin main --rebase
echo Then push again:
echo git push origin main
echo.

pause