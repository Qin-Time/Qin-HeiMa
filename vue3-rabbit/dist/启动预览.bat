@echo off
chcp 65001 >nul
title 网页预览服务器
echo ========================================
echo   正在启动网页预览，请稍候...
echo ========================================
echo.

:: 检查是否安装了 Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js 环境，无法自动启动！
    echo 请安装 Node.js 后再试。
    pause
    exit
)

:: 使用 npx serve 启动服务器
:: -s 参数代表开启单页应用(SPA)模式，完美支持 Vue 的 history 路由，刷新不会 404
echo 正在启动本地服务器...
echo 浏览器将自动打开，如果未自动打开，请手动访问: http://localhost:3000
echo.
echo [提示] 保持此黑框开启，关闭黑框将停止网页预览。
echo ========================================
start "" http://localhost:3000
npx -y serve -s . -l 3000

pause