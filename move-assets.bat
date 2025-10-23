@echo off
echo Moving assets to public folder...

mkdir public 2>nul

move "ward monitoring" public\ 2>nul
move ot public\ 2>nul
move WardBilling[1] public\ 2>nul
move "ch logo.png" public\ 2>nul

echo Done! Assets moved to public folder.
echo Now run: git add . && git commit -m "Move assets to public folder" && git push
pause
