"""WiFi Device Scanner API endpoints.

This module provides REST API endpoints for scanning and listing
devices connected to the local WiFi network.

Endpoints:
    GET /wifi/scan - Scan network and return list of connected devices
    GET /wifi/network-info - Get information about the local network
    GET /health - Health check endpoint
"""

import logging
from typing import Dict, List
from fastapi import FastAPI, HTTPException, status

from .wifi_scanner import scan_wifi_devices, WiFiDeviceScanner

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="WiFi Device Scanner API",
    description="API for scanning and listing devices connected to WiFi network",
    version="1.0.0"
)


@app.get("/wifi/scan")
async def scan_wifi() -> Dict:
    """
    Scan the local WiFi network for connected devices.

    Returns:
        Dictionary containing:
            - network_info: Information about the local network
            - devices: List of discovered devices with IP, hostname, MAC
            - device_count: Number of devices found

    Raises:
        HTTPException: 500 if scanning fails

    Example:
        curl -X GET "http://localhost:8001/wifi/scan"
    """
    try:
        logger.info("Starting WiFi network scan...")
        result = scan_wifi_devices()
        logger.info(f"Scan completed. Found {result['device_count']} devices")
        return result
    except Exception as e:
        logger.error(f"WiFi scan failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to scan network: {str(e)}"
        )


@app.get("/wifi/network-info")
async def get_network_info() -> Dict:
    """
    Get information about the local network.

    Returns:
        Dictionary containing:
            - local_ip: The local IP address
            - network_range: Network range (e.g., 192.168.1.0/24)
            - subnet_mask: Subnet mask

    Example:
        curl -X GET "http://localhost:8001/wifi/network-info"
    """
    try:
        scanner = WiFiDeviceScanner()
        network_info = scanner.get_network_info()
        return network_info
    except Exception as e:
        logger.error(f"Failed to get network info: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get network information: {str(e)}"
        )


@app.get("/health")
async def health_check():
    """
    Health check endpoint for monitoring and load balancers.

    Returns:
        Dictionary with service status
    """
    return {
        "status": "healthy",
        "service": "wifi-scanner",
        "version": "1.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
