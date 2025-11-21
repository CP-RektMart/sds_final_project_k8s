#!/bin/bash

cd "$(dirname "$0")/.."

echo "=== Cleanup Kubernetes Cluster ==="

echo ""
echo "Removing applications from cluster..."
ansible master -m shell -a "microk8s kubectl delete namespace sds --ignore-not-found=true"

echo ""
echo "Waiting for namespace deletion..."
sleep 10

echo ""
echo "Removing worker nodes from cluster..."
ansible workers -m shell -a "sudo microk8s leave" --become

echo ""
echo "=== Cleanup Complete ==="
