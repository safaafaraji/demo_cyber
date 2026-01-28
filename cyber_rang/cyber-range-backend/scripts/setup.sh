#!/bin/bash
# Setup script
echo "Installing dependencies..."
npm install
echo "Setting up environment..."
cp .env.example .env
echo "Done."
