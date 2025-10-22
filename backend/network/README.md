# Network Module

This module provides network utilities for the AllTech Healthcare system.

## WiFi Device Scanner

The WiFi device scanner allows you to discover all devices connected to your local network.

### Features

- Automatic local network detection
- Concurrent scanning for fast results
- Retrieves IP addresses, MAC addresses, and hostnames
- Cross-platform support (Windows, Linux, macOS)
- Thread-safe concurrent scanning

### Usage

```python
from backend.network.wifi_scanner import scan_wifi_devices

# Scan the local network
result = scan_wifi_devices()

# Display results
print(f"Found {result['device_count']} devices")
for device in result['devices']:
    print(f"{device['ip']} - {device['hostname']} - {device['mac_address']}")
```

### Advanced Usage

```python
# Scan a specific network
result = scan_wifi_devices(network='192.168.1.0/24')

# Use custom number of worker threads
result = scan_wifi_devices(max_workers=100)
```

### Return Value

The `scan_wifi_devices()` function returns a dictionary with the following structure:

```python
{
    'device_count': int,  # Number of devices found
    'devices': [          # List of device dictionaries
        {
            'ip': str,           # IP address (e.g., '192.168.1.100')
            'mac_address': str,  # MAC address (e.g., 'AA:BB:CC:DD:EE:FF')
            'hostname': str      # Hostname (e.g., 'laptop-1' or 'Unknown')
        },
        ...
    ]
}
```

### Requirements

- Python 3.7+
- Standard library modules (no additional dependencies required)
- Network access with appropriate permissions
- For MAC address discovery, may require elevated privileges on some systems

### Notes

- The scanner uses ICMP ping to check host availability
- MAC addresses are retrieved using the system's ARP cache
- Hostname resolution may fail for devices without proper DNS entries
- Scanning speed can be adjusted using the `max_workers` parameter
- Default network subnet is /24 (254 hosts)

### Command-Line Usage

You can also run the scanner directly from the command line:

```bash
python -m backend.network.wifi_scanner
```

This will scan the local network and display a formatted table of discovered devices.

### Testing

Run the unit tests with:

```bash
pytest backend/tests/test_wifi_scanner.py -v
```

### Security Considerations

- This tool performs active network scanning which may trigger security alerts
- Use only on networks you own or have permission to scan
- Some networks may block ICMP ping requests
- Firewall rules may affect scanning results
