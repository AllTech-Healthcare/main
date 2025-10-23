"""Tests for WiFi scanner module."""

import unittest
from unittest.mock import patch, MagicMock
from backend.network.wifi_scanner import (
    scan_wifi_devices,
    get_hostname,
    get_local_ip_and_network
)


class TestWiFiScanner(unittest.TestCase):
    """Test cases for WiFi scanner functionality."""

    def test_scan_wifi_devices_structure(self):
        """Test that scan_wifi_devices returns correct structure."""
        result = scan_wifi_devices()

        # Check return structure
        self.assertIn('device_count', result)
        self.assertIn('devices', result)
        self.assertIn('network_range', result)
        self.assertIn('local_ip', result)

        # Check types
        self.assertIsInstance(result['device_count'], int)
        self.assertIsInstance(result['devices'], list)
        self.assertIsInstance(result['network_range'], str)
        self.assertIsInstance(result['local_ip'], str)

        # Verify device count matches list length
        self.assertEqual(result['device_count'], len(result['devices']))

    def test_get_local_ip_and_network(self):
        """Test local IP and network detection."""
        local_ip, network_range = get_local_ip_and_network()

        # Check that values are strings
        self.assertIsInstance(local_ip, str)
        self.assertIsInstance(network_range, str)

        # Check network range format (should be CIDR notation)
        self.assertIn('/', network_range)

    @patch('backend.network.wifi_scanner.scan_with_ip_neighbor')
    def test_scan_with_mock_devices(self, mock_scan):
        """Test scanning with mocked devices."""
        # Mock device data
        mock_devices = [
            {
                'ip': '192.168.1.100',
                'mac_address': 'AA:BB:CC:DD:EE:01',
                'hostname': 'device1.local'
            },
            {
                'ip': '192.168.1.101',
                'mac_address': 'AA:BB:CC:DD:EE:02',
                'hostname': 'device2.local'
            }
        ]
        mock_scan.return_value = mock_devices

        result = scan_wifi_devices()

        # Verify results
        self.assertEqual(result['device_count'], 2)
        self.assertEqual(len(result['devices']), 2)

        # Verify device structure
        for device in result['devices']:
            self.assertIn('ip', device)
            self.assertIn('mac_address', device)
            self.assertIn('hostname', device)

    def test_device_has_required_fields(self):
        """Test that each device has required fields."""
        result = scan_wifi_devices()

        for device in result['devices']:
            self.assertIn('ip', device)
            self.assertIn('mac_address', device)
            self.assertIn('hostname', device)
            self.assertIsInstance(device['ip'], str)
            self.assertIsInstance(device['mac_address'], str)
            self.assertIsInstance(device['hostname'], str)


if __name__ == '__main__':
    unittest.main()
