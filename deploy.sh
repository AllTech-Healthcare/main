#!/bin/bash

# WiFi Scanner Deployment Script
# This script helps deploy and run the WiFi device scanner

set -e

echo "=================================================="
echo "   AllTech Healthcare - WiFi Scanner Deployment"
echo "=================================================="
echo ""

# Check Python version
echo "Checking Python version..."
python3 --version || { echo "Python 3 is required but not installed."; exit 1; }

# Install dependencies
echo ""
echo "Installing dependencies..."
pip install -q -r backend/requirements.txt

# Run tests
echo ""
echo "Running tests..."
python -m pytest backend/tests/test_wifi_scanner.py -v

# Run the scanner
echo ""
echo "=================================================="
echo "   Running WiFi Device Scanner"
echo "=================================================="
echo ""
python demo_wifi_scanner.py

echo ""
echo "=================================================="
echo "   Deployment Complete!"
echo "=================================================="
echo ""
echo "To use the scanner in your code:"
echo ""
echo "  from backend.network.wifi_scanner import scan_wifi_devices"
echo "  result = scan_wifi_devices()"
echo "  print(result)"
echo ""
