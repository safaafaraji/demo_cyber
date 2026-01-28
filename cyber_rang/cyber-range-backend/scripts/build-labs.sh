#!/bin/bash

# Configuration
BASE_DIR="/Users/safaafaraji/projets6/cyber_rang/cyber-range-backend/labs-images"

echo "🚀 Starting Lab Images Build Process..."

# 1. SQL Injection Basic
echo "📦 Building SQL Injection Basic..."
docker build -t cyber-range/sqli-basic "$BASE_DIR/web-security/sql-injection-basic"

# 2. XSS Reflected
echo "📦 Building XSS Reflected..."
docker build -t cyber-range/xss-reflected "$BASE_DIR/web-security/xss-reflected"

# 3. Command Injection
echo "📦 Building Command Injection..."
docker build -t cyber-range/cmd-injection "$BASE_DIR/web-security/command-injection"

# 4. FTP Bruteforce
echo "📦 Building FTP Bruteforce..."
docker build -t cyber-range/ftp-weak "$BASE_DIR/network-security/ftp-bruteforce"

# 5. Telnet Weak Auth
echo "📦 Building Telnet Weak Auth..."
docker build -t cyber-range/telnet-sniff "$BASE_DIR/network-security/telnet-weak-auth"

# 6. Weak RSA
echo "📦 Building Weak RSA..."
docker build -t cyber-range/weak-rsa "$BASE_DIR/cryptography/weak-rsa"

# 7. Memory Dump
echo "📦 Building Memory Dump Analysis..."
docker build -t cyber-range/mem-dump "$BASE_DIR/forensics/memory-dump-analysis"

echo "✅ All core lab images have been built!"
echo "You can now start these labs from the platform dashboard."
