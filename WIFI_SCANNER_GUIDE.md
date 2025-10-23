# WiFi Device Scanner - User Guide

## What This Scanner Does

This scanner **discovers devices connected to your WiFi network**. It will show you:
- IP addresses of connected devices
- MAC addresses (hardware addresses)
- Hostnames (device names like "Johns-iPhone" or "Living-Room-TV")

## Prerequisites

### 1. Connect to Your WiFi Network First

**Network Name:** Phillips Fibre
**Password:** 0828911812

You must connect your computer to this WiFi network **before** running the scanner.

### 2. System Requirements

This scanner works on:
- Linux (Ubuntu, Debian, Raspberry Pi OS, etc.)
- macOS (with limitations)
- Windows (via WSL - Windows Subsystem for Linux)

### 3. Optional Tools (Recommended for Better Results)

Install these tools for more accurate scanning:

**On Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install arp-scan nmap
```

**On macOS:**
```bash
brew install arp-scan nmap
```

## Installation Steps

### Step 1: Get the Code

Copy the entire project to your computer:

```bash
# If you have git installed
git clone <repository-url>
cd main

# OR download and extract the ZIP file from GitHub
```

### Step 2: Ensure Python is Installed

```bash
python3 --version
# Should show Python 3.7 or higher
```

## How to Run the Scanner

### Method 1: Using the Standalone Script (Easiest)

```bash
# Navigate to the project directory
cd /path/to/main

# Run the scanner
python3 scan_network.py

# For best results, run with sudo (requires admin password)
sudo python3 scan_network.py
```

### Method 2: Using the Python Module Directly

```bash
# Your original command
python3 -c "
from backend.network.wifi_scanner import scan_wifi_devices
result = scan_wifi_devices()
print(f\"Found {result['device_count']} devices\")
for device in result['devices']:
    print(f\"{device['ip']} - {device['hostname']} - {device['mac_address']}\")
"
```

### Method 3: Interactive Python

```bash
python3
```

Then in the Python shell:
```python
from backend.network.wifi_scanner import scan_wifi_devices

result = scan_wifi_devices()
print(f"Found {result['device_count']} devices on {result['network_range']}")

for device in result['devices']:
    print(f"{device['ip']:<15} {device['hostname']:<30} {device['mac_address']}")
```

## Example Output

```
================================================================================
WiFi Network Device Scanner
================================================================================

Scanning your local network for connected devices...
This may take 30-60 seconds...

================================================================================
SCAN RESULTS
================================================================================
Network Range:  192.168.1.0/24
Your Local IP:  192.168.1.100
Devices Found:  8
================================================================================

Connected Devices:
--------------------------------------------------------------------------------
IP Address       MAC Address          Hostname
--------------------------------------------------------------------------------
192.168.1.1      A1:B2:C3:D4:E5:F6    phillips-router.local
192.168.1.100    11:22:33:44:55:66    My-Laptop
192.168.1.101    AA:BB:CC:DD:EE:FF    iPhone-12
192.168.1.102    12:34:56:78:9A:BC    Smart-TV
192.168.1.103    99:88:77:66:55:44    Alexa-Echo
192.168.1.105    AB:CD:EF:12:34:56    Printer-HP
192.168.1.110    55:44:33:22:11:00    iPad-Pro
192.168.1.120    FF:EE:DD:CC:BB:AA    Desktop-PC
================================================================================
```

## Troubleshooting

### Problem: "No devices found"

**Solutions:**
1. **Verify WiFi connection:** Make sure you're connected to "Phillips Fibre"
   ```bash
   # On Linux
   nmcli device wifi list
   ip addr show

   # On macOS
   networksetup -getairportnetwork en0
   ```

2. **Run with sudo** for better access to network tools:
   ```bash
   sudo python3 scan_network.py
   ```

3. **Install scanning tools:**
   ```bash
   sudo apt-get install arp-scan nmap
   ```

4. **Try triggering the ARP cache:**
   - Open your router's web interface (usually http://192.168.1.1)
   - This forces your computer to discover other devices

### Problem: "Permission denied" errors

**Solution:** Run with sudo:
```bash
sudo python3 scan_network.py
```

### Problem: "ModuleNotFoundError"

**Solution:** Make sure you're in the correct directory:
```bash
cd /path/to/main
pwd  # Should show the directory containing 'backend' folder
ls -la backend/network/  # Should show wifi_scanner.py
```

## Understanding the Results

### IP Address
- The network address of each device (e.g., 192.168.1.100)
- Usually assigned automatically by your router

### MAC Address
- The unique hardware address of the device's network adapter
- Format: XX:XX:XX:XX:XX:XX (12 hexadecimal digits)
- This never changes for a device

### Hostname
- The friendly name of the device
- May show "Unknown" if the device doesn't broadcast its name
- Examples: "Johns-iPhone", "Living-Room-TV", "phillips-router.local"

## Where to Run This

### ✅ WORKS:
- Physical laptop/desktop connected to "Phillips Fibre"
- Raspberry Pi on the same network
- Linux server on the network
- WSL2 on Windows (with some limitations)

### ❌ DOES NOT WORK:
- Docker containers (isolated network)
- Virtual machines without bridged networking
- Remote servers not on your local network
- This development environment (container-based)

## Security & Privacy Notes

- This scanner only works on networks you're connected to
- It uses standard network discovery protocols (ARP, ICMP)
- It doesn't hack or compromise devices
- It only sees devices that are currently connected
- Some devices may be hidden if they have strict firewall rules

## Next Steps

After scanning, you might want to:
1. Identify unknown devices on your network
2. Check if all devices are authorized
3. Monitor for new devices connecting
4. Set up device-specific access controls on your router

## Need Help?

If you have issues:
1. Make sure you're connected to "Phillips Fibre" WiFi
2. Try running with `sudo`
3. Install the optional tools (arp-scan, nmap)
4. Check that your firewall isn't blocking the scan
