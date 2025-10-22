#!/usr/bin/env python3
"""
Quick test script for WiFi device scanning
"""

from backend.network.wifi_scanner import scan_wifi_devices

print("Starting WiFi scan...\n")

result = scan_wifi_devices()

print(f"Found {result['device_count']} devices\n")
print("=" * 80)

for device in result['devices']:
    print(f"{device['ip']} - {device['hostname']} - {device['mac_address']}")

print("=" * 80)
print("\nScan complete!")
