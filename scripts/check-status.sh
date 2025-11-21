#!/bin/bash

cd "$(dirname "$0")/.."

echo "=== Cluster Nodes ==="
ansible master -m shell -a "microk8s kubectl get nodes"

echo ""
echo "=== Pods in sds namespace ==="
ansible master -m shell -a "microk8s kubectl get pods -n sds"

echo ""
echo "=== Services in sds namespace ==="
ansible master -m shell -a "microk8s kubectl get svc -n sds"

echo ""
echo "=== Deployments in sds namespace ==="
ansible master -m shell -a "microk8s kubectl get deployments -n sds"
