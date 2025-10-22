"""Demo script for WiFi device scanner with detailed output."""

from backend.network.wifi_scanner import (
    scan_wifi_devices,
    get_local_ip,
    get_local_network
)

print("WiFi Device Scanner Demo")
print("=" * 70)
print()

# Show local network info
local_ip = get_local_ip()
local_network = get_local_network()

print(f"Local IP Address: {local_ip}")
print(f"Scanning Network: {local_network}")
print()

# Perform the scan
print("Scanning for devices...")
result = scan_wifi_devices()

print(f"\nFound {result['device_count']} devices")

if result['device_count'] > 0:
    print("\nDevice List:")
    print("-" * 70)
    print(f"{'IP Address':<15} | {'Hostname':<30} | {'MAC Address'}")
    print("-" * 70)

    for device in result['devices']:
        print(f"{device['ip']:<15} | {device['hostname']:<30} | {device['mac_address']}")
else:
    print("\nNo devices found on the network.")
    print("\nNote: In containerized or restricted environments, network")
    print("scanning may be limited. Try running on a local machine with")
    print("network access for actual device discovery.")

print("\n" + "=" * 70)
print("Example output on a real network might look like:")
print("-" * 70)
print(f"{'192.168.1.1':<15} | {'router.local':<30} | {'AA:BB:CC:DD:EE:FF'}")
print(f"{'192.168.1.100':<15} | {'laptop-1':<30} | {'11:22:33:44:55:66'}")
print(f"{'192.168.1.101':<15} | {'phone-android':<30} | {'77:88:99:AA:BB:CC'}")
print(f"{'192.168.1.102':<15} | {'Unknown':<30} | {'DD:EE:FF:00:11:22'}")
