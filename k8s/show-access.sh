#!/bin/bash

# Script para mostrar como acessar a aplicação após o deploy

echo "🔍 Verificando acesso à aplicação tech-challenge"
echo ""

# Verificar se os pods estão rodando
echo "1. Status dos pods:"
microk8s kubectl get pods -n tech-challenge

echo ""
echo "2. Services disponíveis:"
microk8s kubectl get services -n tech-challenge

echo ""
echo "3. Como acessar a aplicação:"
echo ""

# NodePort
NODE_IP=$(microk8s kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}')
echo "🌐 Opção 1 - NodePort (recomendado):"
echo "   http://$NODE_IP:30000"
echo "   http://$NODE_IP:30000/health"

# LoadBalancer
EXTERNAL_IP=$(microk8s kubectl get service tech-challenge-app-loadbalancer -n tech-challenge -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null)

if [ -n "$EXTERNAL_IP" ]; then
    echo ""
    echo "🌐 Opção 2 - LoadBalancer:"
    echo "   http://$EXTERNAL_IP"
    echo "   http://$EXTERNAL_IP/health"
else
    echo ""
    echo "🌐 Opção 2 - LoadBalancer:"
    echo "   ⏳ Aguardando IP externo... (pode demorar se MetalLB não estiver configurado)"
    echo "   Execute: microk8s enable metallb"
fi

# Port-forward como fallback
echo ""
echo "🌐 Opção 3 - Port-forward (se as outras não funcionarem):"
echo "   microk8s kubectl port-forward service/tech-challenge-app-loadbalancer 3000:80 -n tech-challenge"
echo "   Depois acesse: http://localhost:3000"

echo ""
echo "🧪 Testar aplicação:"
echo "   curl http://$NODE_IP:30000/health"
echo "   curl http://$NODE_IP:30000/categories"

echo ""
echo "📋 Para acompanhar logs:"
echo "   microk8s kubectl logs -f deployment/tech-challenge-app-deployment -n tech-challenge"
