# WiFi Scanner Deployment Guide

## Deployment Options

### Option 1: Local Python Deployment (Recommended for Testing)

Run directly on your local machine with network access:

```bash
# Install dependencies
pip install -r backend/requirements.txt

# Run the scanner
python demo_wifi_scanner.py

# Or use it programmatically
python -c "
from backend.network.wifi_scanner import scan_wifi_devices
result = scan_wifi_devices()
print(f\"Found {result['device_count']} devices\")
for device in result['devices']:
    print(f\"{device['ip']} - {device['hostname']} - {device['mac_address']}\")
"
```

### Option 2: Docker Deployment

Build and run the backend service with WiFi scanning capabilities:

```bash
# Build the backend image
docker build -t alltech-backend ./backend

# Run the container with network access
docker run --network host alltech-backend

# Or run interactively for testing
docker run -it --network host alltech-backend /bin/bash
# Then inside container:
python -c "from backend.network.wifi_scanner import scan_wifi_devices; print(scan_wifi_devices())"
```

**Note**: The `--network host` flag is required for the container to access the host's network for device scanning.

### Option 3: Production Deployment

#### Prerequisites
- Server with network access
- Python 3.11+
- Appropriate network permissions for ARP and ICMP

#### Steps

1. **Clone the repository and checkout the branch**:
```bash
git clone <repository-url>
cd main
git checkout claude/wifi-device-scanner-011CUNK3WZwC6oPMN93DhXYp
```

2. **Install dependencies**:
```bash
cd backend
pip install -r requirements.txt
```

3. **Run the scanner as a service** (create systemd service or use process manager):
```bash
# Example with uvicorn if creating an API endpoint
uvicorn auth.auth_service:app --host 0.0.0.0 --port 8000
```

4. **Test the scanner**:
```bash
python -c "from backend.network.wifi_scanner import scan_wifi_devices; print(scan_wifi_devices())"
```

## Integration with FastAPI

To expose the scanner via API, add this endpoint to your FastAPI service:

```python
from fastapi import FastAPI
from backend.network.wifi_scanner import scan_wifi_devices

app = FastAPI()

@app.get("/api/network/scan")
async def scan_network():
    """Scan the local network for devices."""
    result = scan_wifi_devices()
    return result
```

## Permissions Required

### Linux/macOS
- May need to run with `sudo` for full MAC address resolution
- Requires ICMP ping permissions (usually available by default)
- ARP cache access for MAC address lookup

### Windows
- Run terminal as Administrator for full functionality
- Firewall may need to allow ICMP packets

## Testing the Deployment

After deployment, verify the scanner is working:

```bash
# Run the demo script
python demo_wifi_scanner.py

# Check output format
# Should show: Found X devices with IP, hostname, and MAC address
```

## Troubleshooting

### No devices found
- Verify network connectivity: `ping 8.8.8.8`
- Check if running in containerized environment without host network access
- Ensure firewall allows ICMP and ARP traffic
- Try running with elevated privileges

### Missing MAC addresses
- Some devices may not respond to ARP requests
- Try running with elevated privileges (sudo/Administrator)
- MAC addresses populate in ARP cache after ping

### Slow scanning
- Adjust `max_workers` parameter: `scan_wifi_devices(max_workers=100)`
- Smaller networks scan faster
- Consider scanning specific subnets

## Performance Tuning

```python
# Fast scan (fewer workers, may miss some devices)
result = scan_wifi_devices(max_workers=25)

# Balanced (default)
result = scan_wifi_devices(max_workers=50)

# Thorough scan (more workers, slower but comprehensive)
result = scan_wifi_devices(max_workers=100)

# Scan specific network
result = scan_wifi_devices(network='192.168.1.0/24')
```

## Security Considerations

- Only scan networks you own or have permission to scan
- Network scanning may trigger IDS/IPS alerts
- Use responsibly and in compliance with network policies
- Consider rate limiting in production environments

## Next Steps

1. Merge the branch via Pull Request
2. Run CI/CD tests
3. Deploy to staging environment
4. Test with real network
5. Deploy to production
