"""Unit tests for WiFi device scanner."""

import socket
import pytest
from unittest.mock import patch, MagicMock
from backend.network.wifi_scanner import (
    get_local_ip,
    get_local_network,
    ping_host,
    get_mac_address,
    get_hostname,
    scan_single_host,
    scan_wifi_devices
)


def test_get_local_ip():
    """Test getting local IP address."""
    ip = get_local_ip()
    assert isinstance(ip, str)
    assert len(ip.split('.')) == 4


def test_get_local_network():
    """Test getting local network subnet."""
    network = get_local_network()
    assert isinstance(network, str)
    assert network.endswith('/24')


@patch('subprocess.run')
def test_ping_host_success(mock_run):
    """Test successful ping."""
    mock_run.return_value = MagicMock(returncode=0)
    result = ping_host('192.168.1.1')
    assert result is True


@patch('subprocess.run')
def test_ping_host_failure(mock_run):
    """Test failed ping."""
    mock_run.return_value = MagicMock(returncode=1)
    result = ping_host('192.168.1.1')
    assert result is False


@patch('subprocess.run')
def test_get_mac_address(mock_run):
    """Test getting MAC address."""
    mock_run.return_value = MagicMock(
        returncode=0,
        stdout='? (192.168.1.1) at aa:bb:cc:dd:ee:ff [ether] on eth0'
    )
    mac = get_mac_address('192.168.1.1')
    assert mac == 'AA:BB:CC:DD:EE:FF'


@patch('socket.gethostbyaddr')
def test_get_hostname_success(mock_gethostbyaddr):
    """Test successful hostname resolution."""
    mock_gethostbyaddr.return_value = ('test-device', [], ['192.168.1.1'])
    hostname = get_hostname('192.168.1.1')
    assert hostname == 'test-device'


@patch('socket.gethostbyaddr')
def test_get_hostname_failure(mock_gethostbyaddr):
    """Test failed hostname resolution."""
    mock_gethostbyaddr.side_effect = socket.herror
    hostname = get_hostname('192.168.1.1')
    assert hostname == 'Unknown'


@patch('backend.network.wifi_scanner.ping_host')
@patch('backend.network.wifi_scanner.get_mac_address')
@patch('backend.network.wifi_scanner.get_hostname')
def test_scan_single_host(mock_hostname, mock_mac, mock_ping):
    """Test scanning a single host."""
    mock_ping.return_value = True
    mock_mac.return_value = 'AA:BB:CC:DD:EE:FF'
    mock_hostname.return_value = 'test-device'

    result = scan_single_host('192.168.1.1')

    assert result is not None
    assert result['ip'] == '192.168.1.1'
    assert result['mac_address'] == 'AA:BB:CC:DD:EE:FF'
    assert result['hostname'] == 'test-device'


@patch('backend.network.wifi_scanner.ping_host')
def test_scan_single_host_unreachable(mock_ping):
    """Test scanning an unreachable host."""
    mock_ping.return_value = False
    result = scan_single_host('192.168.1.1')
    assert result is None


@patch('backend.network.wifi_scanner.get_local_network')
@patch('backend.network.wifi_scanner.scan_single_host')
def test_scan_wifi_devices(mock_scan_single, mock_get_network):
    """Test scanning WiFi devices."""
    mock_get_network.return_value = '192.168.1.0/30'  # Small network for testing

    # Mock scan results
    def scan_side_effect(ip):
        if ip == '192.168.1.1':
            return {
                'ip': '192.168.1.1',
                'mac_address': 'AA:BB:CC:DD:EE:FF',
                'hostname': 'router'
            }
        elif ip == '192.168.1.2':
            return {
                'ip': '192.168.1.2',
                'mac_address': '11:22:33:44:55:66',
                'hostname': 'device-1'
            }
        return None

    mock_scan_single.side_effect = scan_side_effect

    result = scan_wifi_devices()

    assert 'device_count' in result
    assert 'devices' in result
    assert result['device_count'] == 2
    assert len(result['devices']) == 2


def test_scan_wifi_devices_invalid_network():
    """Test scanning with invalid network."""
    result = scan_wifi_devices(network='invalid')
    assert result['device_count'] == 0
    assert 'error' in result
