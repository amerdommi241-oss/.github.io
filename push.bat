@echo off
chcp 65001
echo 正在添加更改...
git add source/_posts/airport-recommendations.md
echo.
echo 正在提交更改...
git commit -m "style: highlight top 3 airports with red text in recommendations table"
echo.
echo 正在推送到远程仓库...
git push
echo.
echo 推送完成！请按任意键退出。
pause
