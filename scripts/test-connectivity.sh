#!/bin/bash

cd "$(dirname "$0")/.."

echo "=== Testing SSH Connectivity to All Raspberry Pi Nodes ==="
echo ""

cd ansible

echo "Testing connection to all nodes..."
ansible all -m ping

echo ""
echo "=== Checking OS ==="
ansible all -m shell -a "lsb_release -a"

echo ""
echo "=== Checking uptime ==="
ansible all -m shell -a "uptime"