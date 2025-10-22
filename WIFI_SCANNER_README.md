# WiFi Device Scanner

A Python-based tool to scan your local WiFi network and list all connected devices.

## Features

- Scans local network for connected devices
- Displays IP addresses, hostnames, and MAC addresses
- REST API endpoints for integration
- Simple command-line interface
- Concurrent scanning for fast results

## Requirements

- Python 3.7+
- Network access with ping capability
- Root/Administrator privileges may be needed for MAC address detection on some systems

## Installation

No additional dependencies required! The scanner uses Python standard libraries:
- `socket`
- `ipaddress`
- `subprocess`
- `concurrent.futures`

For the API server, install FastAPI and Uvicorn:

```bash
cd backend
pip install -r requirements.txt
```

## Usage

### Command Line Interface

Run the simple CLI scanner:

```bash
python scan_wifi.py
```

This will:
1. Detect your local network
2. Scan all IP addresses in the network range
3. Display all found devices with their information

Example output:
```
======================================================================
WiFi Device Scanner
======================================================================

Scanning local network for connected devices...
This may take 1-2 minutes depending on network size...

Network Information:
----------------------------------------------------------------------
  Local IP:      192.168.1.100
  Network Range: 192.168.1.0/24
  Subnet Mask:   255.255.255.0

Found 5 device(s):
======================================================================

Device #1
  IP Address:  192.168.1.1
  Hostname:    router.local
  MAC Address: aa:bb:cc:dd:ee:ff
  Status:      online

Device #2
  IP Address:  192.168.1.100
  Hostname:    my-computer
  MAC Address: 11:22:33:44:55:66
  Status:      online

======================================================================
Scan complete!
```

### Python Module

Use the scanner in your Python code:

```python
from backend.network.wifi_scanner import scan_wifi_devices, WiFiDeviceScanner

# Quick scan
result = scan_wifi_devices()
print(f"Found {result['device_count']} devices")
for device in result['devices']:
    print(f"{device['ip']} - {device['hostname']}")

# Advanced usage
scanner = WiFiDeviceScanner()
network_info = scanner.get_network_info()
devices = scanner.scan_network(max_workers=100)  # Faster scanning
```

### REST API

Start the API server:

```bash
cd backend
python -m network.api
```

Or using uvicorn:

```bash
cd backend
uvicorn network.api:app --host 0.0.0.0 --port 8001
```

#### API Endpoints

**Scan Network:**
```bash
curl http://localhost:8001/wifi/scan
```

Response:
```json
{
  "network_info": {
    "local_ip": "192.168.1.100",
    "network_range": "192.168.1.0/24",
    "subnet_mask": "255.255.255.0"
  },
  "devices": [
    {
      "ip": "192.168.1.1",
      "hostname": "router.local",
      "mac_address": "aa:bb:cc:dd:ee:ff",
      "status": "online"
    }
  ],
  "device_count": 1
}
```

**Get Network Info:**
```bash
curl http://localhost:8001/wifi/network-info
```

**Health Check:**
```bash
curl http://localhost:8001/health
```

## How It Works

1. **Network Detection**: Detects your local IP address and calculates the network range (assumes /24 subnet)
2. **IP Scanning**: Pings each IP address in the range to check if devices are online
3. **Device Information**:
   - Resolves hostnames using reverse DNS lookup
   - Retrieves MAC addresses from ARP table (Linux/macOS)
4. **Concurrent Processing**: Uses thread pool for fast parallel scanning

## Platform Support

- **Linux**: Full support (IP, hostname, MAC address)
- **macOS**: Full support (IP, hostname, MAC address)
- **Windows**: Partial support (IP, hostname; MAC address detection may be limited)

## Permissions

- Basic scanning (IP, hostname) works without special privileges
- MAC address detection may require:
  - **Linux/macOS**: Run as root/sudo or ensure ARP table is populated
  - **Windows**: Administrator privileges may be needed

## Performance

- Default: Scans ~254 addresses in 30-60 seconds
- Adjustable: Use `max_workers` parameter to control scan speed
- Network dependent: Results vary based on network size and response times

## Security Considerations

- Only scans your local network
- Does not modify any network settings
- Read-only operations (ping and ARP lookup)
- No credentials or sensitive data collection

## Troubleshooting

**No devices found:**
- Check network connectivity
- Ensure devices respond to ping
- Some devices may have ping disabled

**MAC addresses show as "Unknown":**
- Try running with sudo/administrator privileges
- Ensure ARP table is populated (ping devices first)
- Some systems may restrict ARP access

**Slow scanning:**
- Reduce `max_workers` if causing network issues
- Check network latency
- Consider scanning specific IP ranges

## Integration with AllTech Healthcare

This WiFi scanner can be integrated into the AllTech Healthcare platform for:
- Network monitoring and device management
- IoT medical device discovery
- Network security auditing
- IT infrastructure management

## Files

- `backend/network/wifi_scanner.py` - Core scanner module
- `backend/network/api.py` - REST API endpoints
- `backend/network/__init__.py` - Module initialization
- `scan_wifi.py` - Command-line interface script

## License

Part of the AllTech Healthcare platform.
