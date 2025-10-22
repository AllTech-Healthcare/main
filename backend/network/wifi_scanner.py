"""
WiFi Device Scanner Module
Scans the local network to discover connected devices
"""

import socket
import ipaddress
import concurrent.futures
from typing import List, Dict, Optional
import subprocess
import platform
import re


class WiFiDeviceScanner:
    """Scanner to detect devices connected to the local WiFi network"""

    def __init__(self):
        self.local_ip = self._get_local_ip()
        self.network = self._get_network_range()

    def _get_local_ip(self) -> str:
        """Get the local IP address of this machine"""
        try:
            # Create a socket to determine local IP
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            local_ip = s.getsockname()[0]
            s.close()
            return local_ip
        except Exception as e:
            return "127.0.0.1"

    def _get_network_range(self) -> Optional[ipaddress.IPv4Network]:
        """Get the network range based on local IP"""
        try:
            # Assume /24 subnet (most common for home networks)
            network = ipaddress.IPv4Network(f"{self.local_ip}/24", strict=False)
            return network
        except Exception as e:
            return None

    def _ping_host(self, ip: str, timeout: int = 1) -> bool:
        """Ping a host to check if it's alive"""
        try:
            param = "-n" if platform.system().lower() == "windows" else "-c"
            command = ["ping", param, "1", "-W" if platform.system().lower() != "windows" else "-w",
                      str(timeout * 1000) if platform.system().lower() == "windows" else str(timeout), str(ip)]

            result = subprocess.run(
                command,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                timeout=timeout + 1
            )
            return result.returncode == 0
        except Exception:
            return False

    def _get_hostname(self, ip: str) -> str:
        """Try to resolve hostname for an IP address"""
        try:
            hostname = socket.gethostbyaddr(ip)[0]
            return hostname
        except (socket.herror, socket.gaierror):
            return "Unknown"

    def _get_mac_address(self, ip: str) -> str:
        """Try to get MAC address for an IP (Linux/Unix only)"""
        try:
            if platform.system().lower() == "linux":
                # Try using ARP table
                result = subprocess.run(
                    ["arp", "-n", ip],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    timeout=2
                )
                output = result.stdout.decode()

                # Parse MAC address from ARP output
                mac_pattern = r'([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})'
                match = re.search(mac_pattern, output)
                if match:
                    return match.group(0)

            elif platform.system().lower() == "darwin":  # macOS
                result = subprocess.run(
                    ["arp", "-n", ip],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    timeout=2
                )
                output = result.stdout.decode()
                mac_pattern = r'([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})'
                match = re.search(mac_pattern, output)
                if match:
                    return match.group(0)

            return "Unknown"
        except Exception:
            return "Unknown"

    def _scan_single_ip(self, ip: str) -> Optional[Dict[str, str]]:
        """Scan a single IP address"""
        if self._ping_host(ip):
            hostname = self._get_hostname(ip)
            mac_address = self._get_mac_address(ip)

            return {
                "ip": ip,
                "hostname": hostname,
                "mac_address": mac_address,
                "status": "online"
            }
        return None

    def scan_network(self, max_workers: int = 50) -> List[Dict[str, str]]:
        """
        Scan the entire network for connected devices

        Args:
            max_workers: Maximum number of concurrent threads

        Returns:
            List of dictionaries containing device information
        """
        if not self.network:
            return []

        devices = []
        ip_list = [str(ip) for ip in self.network.hosts()]

        # Use ThreadPoolExecutor for concurrent scanning
        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_ip = {executor.submit(self._scan_single_ip, ip): ip for ip in ip_list}

            for future in concurrent.futures.as_completed(future_to_ip):
                result = future.result()
                if result:
                    devices.append(result)

        # Sort by IP address
        devices.sort(key=lambda x: ipaddress.IPv4Address(x['ip']))

        return devices

    def get_network_info(self) -> Dict[str, str]:
        """Get information about the local network"""
        return {
            "local_ip": self.local_ip,
            "network_range": str(self.network) if self.network else "Unknown",
            "subnet_mask": str(self.network.netmask) if self.network else "Unknown"
        }


def scan_wifi_devices() -> Dict[str, any]:
    """
    Main function to scan for WiFi devices

    Returns:
        Dictionary containing network info and list of devices
    """
    scanner = WiFiDeviceScanner()
    network_info = scanner.get_network_info()
    devices = scanner.scan_network()

    return {
        "network_info": network_info,
        "devices": devices,
        "device_count": len(devices)
    }


if __name__ == "__main__":
    # Test the scanner
    print("Scanning WiFi network for connected devices...")
    print("This may take a minute or two...\n")

    result = scan_wifi_devices()

    print(f"Network Information:")
    print(f"  Local IP: {result['network_info']['local_ip']}")
    print(f"  Network Range: {result['network_info']['network_range']}")
    print(f"  Subnet Mask: {result['network_info']['subnet_mask']}")
    print(f"\nFound {result['device_count']} device(s):\n")

    for device in result['devices']:
        print(f"IP Address: {device['ip']}")
        print(f"  Hostname: {device['hostname']}")
        print(f"  MAC Address: {device['mac_address']}")
        print(f"  Status: {device['status']}")
        print()
