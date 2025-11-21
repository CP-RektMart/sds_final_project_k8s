#!/bin/bash

set -e

cd "$(dirname "$0")/.."

echo "=== MicroK8s Kubernetes Cluster Setup ==="
echo ""
echo "Step 1: Setup MicroK8s on all nodes"
echo "This will install MicroK8s and configure cgroups (requires reboot)"
cd ansible
ansible-playbook setup-microk8s.yaml

echo ""
echo "Step 2: Join worker nodes to cluster"
ansible-playbook join-workers.yaml

echo ""
echo "Step 3: Wait for cluster to stabilize"
sleep 30

echo ""
echo "Step 4: Deploy applications"
ansible-playbook deploy-apps.yaml

echo ""
echo "=== Setup Complete ==="
echo "Access your application at http://<any-node-ip>:30000"
