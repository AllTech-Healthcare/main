#!/usr/bin/env python3
"""
Test script to check network configuration
"""

from backend.network.wifi_scanner import WiFiDeviceScanner

scanner = WiFiDeviceScanner()
network_info = scanner.get_network_info()

print("Network Configuration:")
print("=" * 80)
print(f"Local IP:      {network_info['local_ip']}")
print(f"Network Range: {network_info['network_range']}")
print(f"Subnet Mask:   {network_info['subnet_mask']}")
print("=" * 80)

# Test ping on a few common IPs
import ipaddress
print("\nTesting connectivity to a few IPs...")
network = ipaddress.IPv4Network(network_info['network_range'], strict=False)
test_ips = list(network.hosts())[:5]  # Test first 5 IPs

for ip in test_ips:
    result = scanner._ping_host(str(ip))
    print(f"{ip}: {'ONLINE' if result else 'offline'}")
