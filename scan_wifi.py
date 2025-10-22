#!/usr/bin/env python3
"""
Simple command-line script to scan for WiFi devices.

Usage:
    python scan_wifi.py

This script will scan the local network and display all connected devices
with their IP addresses, hostnames, and MAC addresses.
"""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from backend.network.wifi_scanner import scan_wifi_devices


def main():
    """Main function to run the WiFi scanner"""
    print("=" * 70)
    print("WiFi Device Scanner")
    print("=" * 70)
    print("\nScanning local network for connected devices...")
    print("This may take 1-2 minutes depending on network size...\n")

    try:
        result = scan_wifi_devices()

        # Display network information
        print("Network Information:")
        print("-" * 70)
        print(f"  Local IP:      {result['network_info']['local_ip']}")
        print(f"  Network Range: {result['network_info']['network_range']}")
        print(f"  Subnet Mask:   {result['network_info']['subnet_mask']}")
        print()

        # Display found devices
        print(f"Found {result['device_count']} device(s):")
        print("=" * 70)

        if result['device_count'] == 0:
            print("No devices found on the network.")
        else:
            for idx, device in enumerate(result['devices'], 1):
                print(f"\nDevice #{idx}")
                print(f"  IP Address:  {device['ip']}")
                print(f"  Hostname:    {device['hostname']}")
                print(f"  MAC Address: {device['mac_address']}")
                print(f"  Status:      {device['status']}")

        print("\n" + "=" * 70)
        print("Scan complete!")

    except KeyboardInterrupt:
        print("\n\nScan interrupted by user.")
        sys.exit(1)
    except Exception as e:
        print(f"\nError during scan: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()
