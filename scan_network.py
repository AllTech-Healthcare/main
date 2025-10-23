#!/usr/bin/env python3
"""
WiFi Network Device Scanner

This script scans the local network for connected devices.
You must be connected to the WiFi network before running this script.

Usage:
    python scan_network.py

    Or make it executable and run directly:
    chmod +x scan_network.py
    ./scan_network.py

Requirements:
    - You must be connected to the WiFi network you want to scan
    - For best results, run with sudo: sudo python scan_network.py
    - Optional tools for better scanning: arp-scan, nmap
"""

import sys
import os

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.network.wifi_scanner import scan_wifi_devices


def main():
    """Run the WiFi device scanner and display results."""
    print("=" * 80)
    print("WiFi Network Device Scanner")
    print("=" * 80)
    print("\nScanning your local network for connected devices...")
    print("This may take 30-60 seconds...\n")

    try:
        result = scan_wifi_devices()

        print("=" * 80)
        print("SCAN RESULTS")
        print("=" * 80)
        print(f"Network Range:  {result['network_range']}")
        print(f"Your Local IP:  {result['local_ip']}")
        print(f"Devices Found:  {result['device_count']}")
        print("=" * 80)

        if result['device_count'] > 0:
            print("\nConnected Devices:")
            print("-" * 80)
            print(f"{'IP Address':<16} {'MAC Address':<20} {'Hostname'}")
            print("-" * 80)

            for device in result['devices']:
                print(f"{device['ip']:<16} {device['mac_address']:<20} {device['hostname']}")
        else:
            print("\nNo devices found.")
            print("\nTroubleshooting:")
            print("1. Make sure you are connected to the WiFi network")
            print("2. Try running with sudo for better results: sudo python scan_network.py")
            print("3. Install scanning tools: sudo apt-get install arp-scan nmap")
            print("4. Some devices may be hidden or have firewalls enabled")

        print("=" * 80)

    except KeyboardInterrupt:
        print("\n\nScan cancelled by user.")
        sys.exit(0)
    except Exception as e:
        print(f"\nError during scan: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
