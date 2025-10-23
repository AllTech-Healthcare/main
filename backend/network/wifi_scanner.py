"""WiFi device scanner module for detecting devices on the local network."""

import subprocess
import re
import socket
from typing import Dict, List, Any
import ipaddress


def get_local_ip_and_network() -> tuple:
    """Get the local IP address and network range."""
    try:
        # Create a socket to determine the local IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()

        # Assume /24 subnet (most common for home networks)
        network = ipaddress.IPv4Network(f"{local_ip}/24", strict=False)
        return local_ip, str(network)
    except Exception as e:
        # Fallback to common private network range
        return "192.168.1.1", "192.168.1.0/24"


def scan_with_arp() -> List[Dict[str, str]]:
    """Scan network using ARP (Linux/Unix systems)."""
    devices = []
    try:
        # Use arp-scan if available (requires sudo/root)
        result = subprocess.run(
            ['arp-scan', '--localnet', '--plain'],
            capture_output=True,
            text=True,
            timeout=30
        )

        if result.returncode == 0:
            for line in result.stdout.split('\n'):
                parts = line.split()
                if len(parts) >= 2:
                    ip = parts[0]
                    mac = parts[1]
                    if re.match(r'^\d+\.\d+\.\d+\.\d+$', ip):
                        hostname = get_hostname(ip)
                        devices.append({
                            'ip': ip,
                            'mac_address': mac.upper(),
                            'hostname': hostname
                        })
    except (subprocess.TimeoutExpired, FileNotFoundError):
        pass

    return devices


def scan_with_ip_neighbor() -> List[Dict[str, str]]:
    """Scan network using ip neighbor (Linux systems)."""
    devices = []
    try:
        result = subprocess.run(
            ['ip', 'neighbor', 'show'],
            capture_output=True,
            text=True,
            timeout=10
        )

        if result.returncode == 0:
            for line in result.stdout.split('\n'):
                # Format: IP dev INTERFACE lladdr MAC_ADDRESS STATE
                match = re.search(
                    r'(\d+\.\d+\.\d+\.\d+)\s+dev\s+\S+\s+lladdr\s+([\da-fA-F:]+)\s+(\w+)',
                    line
                )
                if match:
                    ip = match.group(1)
                    mac = match.group(2)
                    state = match.group(3)

                    # Only include reachable/active devices
                    if state.upper() in ['REACHABLE', 'STALE', 'DELAY', 'PROBE']:
                        hostname = get_hostname(ip)
                        devices.append({
                            'ip': ip,
                            'mac_address': mac.upper(),
                            'hostname': hostname
                        })
    except (subprocess.TimeoutExpired, FileNotFoundError):
        pass

    return devices


def scan_with_nmap(network_range: str) -> List[Dict[str, str]]:
    """Scan network using nmap."""
    devices = []
    try:
        result = subprocess.run(
            ['nmap', '-sn', network_range],
            capture_output=True,
            text=True,
            timeout=60
        )

        if result.returncode == 0:
            # Parse nmap output
            current_ip = None
            for line in result.stdout.split('\n'):
                # Look for IP addresses
                ip_match = re.search(r'Nmap scan report for (?:(\S+) \()?(\d+\.\d+\.\d+\.\d+)\)?', line)
                if ip_match:
                    hostname = ip_match.group(1) if ip_match.group(1) else ''
                    current_ip = ip_match.group(2)

                # Look for MAC addresses
                mac_match = re.search(r'MAC Address: ([\da-fA-F:]+)', line)
                if mac_match and current_ip:
                    mac = mac_match.group(1)
                    if not hostname:
                        hostname = get_hostname(current_ip)

                    devices.append({
                        'ip': current_ip,
                        'mac_address': mac.upper(),
                        'hostname': hostname or 'Unknown'
                    })
                    current_ip = None
    except (subprocess.TimeoutExpired, FileNotFoundError):
        pass

    return devices


def ping_sweep(network_range: str) -> List[Dict[str, str]]:
    """Perform a simple ping sweep and then check ARP table."""
    devices = []

    try:
        network = ipaddress.IPv4Network(network_range)

        # Ping each IP in the range (limit to /24 or smaller)
        if network.prefixlen >= 24:
            for ip in network.hosts():
                subprocess.run(
                    ['ping', '-c', '1', '-W', '1', str(ip)],
                    capture_output=True,
                    timeout=2
                )
    except Exception:
        pass

    # After pinging, check the ARP table
    return scan_with_ip_neighbor()


def get_hostname(ip: str) -> str:
    """Get hostname for an IP address."""
    try:
        hostname = socket.gethostbyaddr(ip)[0]
        return hostname
    except (socket.herror, socket.gaierror, socket.timeout):
        return 'Unknown'


def scan_wifi_devices() -> Dict[str, Any]:
    """
    Scan the local network for WiFi devices.

    Returns:
        dict: A dictionary containing:
            - device_count (int): Number of devices found
            - devices (list): List of device dictionaries with ip, hostname, and mac_address
            - network_range (str): The network range that was scanned
    """
    local_ip, network_range = get_local_ip_and_network()
    devices = []

    # Try multiple scanning methods in order of preference
    # Method 1: arp-scan (most reliable but requires root)
    devices = scan_with_arp()

    # Method 2: ip neighbor (works without root on Linux)
    if not devices:
        devices = scan_with_ip_neighbor()

    # Method 3: nmap (if available)
    if not devices:
        devices = scan_with_nmap(network_range)

    # Method 4: ping sweep + ARP table (fallback)
    if not devices:
        devices = ping_sweep(network_range)

    # Remove duplicates based on IP address
    unique_devices = {}
    for device in devices:
        if device['ip'] not in unique_devices:
            unique_devices[device['ip']] = device

    devices_list = list(unique_devices.values())

    # Sort by IP address
    devices_list.sort(key=lambda x: ipaddress.IPv4Address(x['ip']))

    return {
        'device_count': len(devices_list),
        'devices': devices_list,
        'network_range': network_range,
        'local_ip': local_ip
    }


if __name__ == '__main__':
    # Test the scanner
    result = scan_wifi_devices()
    print(f"Network Range: {result['network_range']}")
    print(f"Local IP: {result['local_ip']}")
    print(f"Found {result['device_count']} devices:")
    print("-" * 70)
    for device in result['devices']:
        print(f"{device['ip']:<15} {device['mac_address']:<18} {device['hostname']}")
