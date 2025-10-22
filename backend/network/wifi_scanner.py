"""WiFi device scanner for network discovery.

This module provides functionality to scan the local network for connected devices,
retrieving their IP addresses, MAC addresses, and hostnames.
"""

import socket
import subprocess
import platform
import ipaddress
import re
from typing import Dict, List, Optional
from concurrent.futures import ThreadPoolExecutor, as_completed


def get_local_ip() -> str:
    """Get the local IP address of the machine.

    Returns:
        str: Local IP address
    """
    try:
        # Create a socket to determine the local IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except Exception:
        return "127.0.0.1"


def get_local_network() -> str:
    """Get the local network subnet.

    Returns:
        str: Network subnet in CIDR notation (e.g., '192.168.1.0/24')
    """
    local_ip = get_local_ip()
    # Assume /24 subnet for most home/office networks
    network_parts = local_ip.split('.')
    network_parts[-1] = '0'
    return '.'.join(network_parts) + '/24'


def ping_host(ip: str, timeout: int = 1) -> bool:
    """Ping a host to check if it's alive.

    Args:
        ip: IP address to ping
        timeout: Timeout in seconds

    Returns:
        bool: True if host is reachable, False otherwise
    """
    system = platform.system().lower()

    # Different ping commands for different OS
    if system == 'windows':
        command = ['ping', '-n', '1', '-w', str(timeout * 1000), ip]
    else:
        command = ['ping', '-c', '1', '-W', str(timeout), ip]

    try:
        result = subprocess.run(
            command,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            timeout=timeout + 1
        )
        return result.returncode == 0
    except (subprocess.TimeoutExpired, Exception):
        return False


def get_mac_address(ip: str) -> Optional[str]:
    """Get the MAC address for a given IP address using ARP.

    Args:
        ip: IP address

    Returns:
        Optional[str]: MAC address or None if not found
    """
    system = platform.system().lower()

    try:
        if system == 'windows':
            # Windows ARP command
            result = subprocess.run(
                ['arp', '-a', ip],
                capture_output=True,
                text=True,
                timeout=2
            )
        else:
            # Linux/Mac ARP command
            result = subprocess.run(
                ['arp', '-n', ip],
                capture_output=True,
                text=True,
                timeout=2
            )

        if result.returncode == 0:
            # Parse MAC address from output
            # Match MAC address patterns like aa:bb:cc:dd:ee:ff or aa-bb-cc-dd-ee-ff
            mac_pattern = r'([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})'
            match = re.search(mac_pattern, result.stdout)
            if match:
                return match.group(0).upper()
    except Exception:
        pass

    return None


def get_hostname(ip: str) -> str:
    """Get the hostname for a given IP address.

    Args:
        ip: IP address

    Returns:
        str: Hostname or 'Unknown' if not found
    """
    try:
        hostname = socket.gethostbyaddr(ip)[0]
        return hostname
    except (socket.herror, socket.gaierror):
        return "Unknown"


def scan_single_host(ip: str) -> Optional[Dict[str, str]]:
    """Scan a single host and return device information.

    Args:
        ip: IP address to scan

    Returns:
        Optional[Dict[str, str]]: Device information or None if host is not reachable
    """
    if ping_host(ip):
        mac_address = get_mac_address(ip)
        hostname = get_hostname(ip)

        return {
            'ip': ip,
            'mac_address': mac_address or 'Unknown',
            'hostname': hostname
        }
    return None


def scan_wifi_devices(network: Optional[str] = None, max_workers: int = 50) -> Dict:
    """Scan the local network for connected WiFi devices.

    This function scans the local network subnet to discover all connected devices.
    It retrieves IP addresses, MAC addresses, and hostnames for each device found.

    Args:
        network: Network subnet in CIDR notation (e.g., '192.168.1.0/24').
                If None, automatically detects the local network.
        max_workers: Maximum number of concurrent threads for scanning (default: 50)

    Returns:
        Dict: Dictionary containing:
            - device_count (int): Number of devices found
            - devices (List[Dict]): List of device information dictionaries,
                                   each containing 'ip', 'mac_address', and 'hostname'

    Example:
        >>> result = scan_wifi_devices()
        >>> print(f"Found {result['device_count']} devices")
        >>> for device in result['devices']:
        ...     print(f"{device['ip']} - {device['hostname']} - {device['mac_address']}")
    """
    if network is None:
        network = get_local_network()

    # Parse the network
    try:
        net = ipaddress.ip_network(network, strict=False)
    except ValueError as e:
        return {
            'device_count': 0,
            'devices': [],
            'error': f'Invalid network: {e}'
        }

    devices = []

    # Scan all hosts in the network using thread pool
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit all ping tasks
        future_to_ip = {
            executor.submit(scan_single_host, str(ip)): str(ip)
            for ip in net.hosts()
        }

        # Collect results as they complete
        for future in as_completed(future_to_ip):
            try:
                result = future.result()
                if result:
                    devices.append(result)
            except Exception:
                # Skip hosts that cause errors
                pass

    # Sort devices by IP address
    devices.sort(key=lambda x: ipaddress.ip_address(x['ip']))

    return {
        'device_count': len(devices),
        'devices': devices
    }


if __name__ == '__main__':
    # Test the scanner
    print("Scanning local network for devices...")
    result = scan_wifi_devices()
    print(f"\nFound {result['device_count']} devices:")
    print("-" * 70)
    for device in result['devices']:
        print(f"{device['ip']:15} | {device['hostname']:30} | {device['mac_address']}")
