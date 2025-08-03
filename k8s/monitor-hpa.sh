#!/bin/bash

echo "📈 Monitoramento em Tempo Real do HPA"
echo "====================================="
echo "Pressione Ctrl+C para parar"
echo ""

while true; do
    clear
    echo "🕒 $(date '+%H:%M:%S') - Monitoramento do Autoscaling"
    echo "=================================================="
    echo ""
    
    echo "📊 HPA Status:"
    microk8s kubectl get hpa -n tech-challenge --no-headers 2>/dev/null || echo "HPA não encontrado"
    echo ""
    
    echo "💾 Recursos dos Pods:"
    microk8s kubectl top pods -n tech-challenge --no-headers --sort-by=cpu 2>/dev/null | head -10 || echo "Métricas não disponíveis"
    echo ""
    
    echo "📦 Réplicas Atuais:"
    REPLICAS=$(microk8s kubectl get deployment tech-challenge-app-deployment -n tech-challenge -o jsonpath='{.status.replicas}' 2>/dev/null)
    READY=$(microk8s kubectl get deployment tech-challenge-app-deployment -n tech-challenge -o jsonpath='{.status.readyReplicas}' 2>/dev/null)
    echo "   Deployment: $READY/$REPLICAS pods prontos"
    
    microk8s kubectl get pods -n tech-challenge --no-headers 2>/dev/null | grep tech-challenge-app | wc -l | xargs echo "   Pods rodando:"
    echo ""
    
    echo "🔥 Últimos 3 eventos:"
    microk8s kubectl get events -n tech-challenge --sort-by='.lastTimestamp' --no-headers 2>/dev/null | tail -3 | cut -c1-100
    echo ""
    
    sleep 3
done
