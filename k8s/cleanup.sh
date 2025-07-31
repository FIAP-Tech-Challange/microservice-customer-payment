#!/bin/bash

# Script para limpar completamente o deployment da aplicação tech-challenge

echo "🧹 Limpando completamente o ambiente tech-challenge"
echo ""

# Função para confirmar ação
confirm() {
    read -p "$1 (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Operação cancelada"
        exit 1
    fi
}

# Verificar se o namespace existe
if microk8s kubectl get namespace tech-challenge >/dev/null 2>&1; then
    echo "🔍 Namespace 'tech-challenge' encontrado"
    echo ""
    
    # Mostrar recursos que serão deletados
    echo "📋 Recursos que serão deletados:"
    echo ""
    echo "=== PODS ==="
    microk8s kubectl get pods -n tech-challenge 2>/dev/null || echo "Nenhum pod encontrado"
    
    echo ""
    echo "=== SERVICES ==="
    microk8s kubectl get services -n tech-challenge 2>/dev/null || echo "Nenhum service encontrado"
    
    echo ""
    echo "=== DEPLOYMENTS ==="
    microk8s kubectl get deployments -n tech-challenge 2>/dev/null || echo "Nenhum deployment encontrado"
    
    echo ""
    echo "=== SECRETS ==="
    microk8s kubectl get secrets -n tech-challenge 2>/dev/null || echo "Nenhum secret encontrado"
    
    echo ""
    echo "=== PERSISTENT VOLUME CLAIMS ==="
    microk8s kubectl get pvc -n tech-challenge 2>/dev/null || echo "Nenhum PVC encontrado"
    
    echo ""
    echo "⚠️  ATENÇÃO: Isso vai deletar TODOS os dados do PostgreSQL!"
    echo "⚠️  Essa ação é IRREVERSÍVEL!"
    echo ""
    
    confirm "Tem certeza que deseja deletar TUDO?"
    
    echo ""
    echo "🗑️  Deletando namespace e todos os recursos..."
    
    # Deletar o namespace inteiro (isso remove tudo dentro dele)
    microk8s kubectl delete namespace tech-challenge
    
    echo "⏳ Aguardando namespace ser completamente removido..."
    
    # Aguardar até o namespace ser completamente removido
    while microk8s kubectl get namespace tech-challenge >/dev/null 2>&1; do
        echo "   Aguardando remoção completa..."
        sleep 3
    done
    
    echo "✅ Namespace 'tech-challenge' completamente removido!"
    
else
    echo "ℹ️  Namespace 'tech-challenge' não existe"
fi

echo ""
echo "🧹 Verificando e limpando recursos órfãos..."

# Verificar se há PVs órfãos relacionados ao tech-challenge
ORPHAN_PVS=$(microk8s kubectl get pv 2>/dev/null | grep "tech-challenge" | awk '{print $1}' || true)
if [ -n "$ORPHAN_PVS" ]; then
    echo "🗑️  Removendo Persistent Volumes órfãos:"
    for pv in $ORPHAN_PVS; do
        echo "   Deletando PV: $pv"
        microk8s kubectl delete pv $pv 2>/dev/null || true
    done
fi

# Verificar pods em outros namespaces
echo "🔍 Verificando pods órfãos em outros namespaces..."
ORPHAN_PODS=$(microk8s kubectl get pods --all-namespaces 2>/dev/null | grep "tech-challenge" || true)
if [ -n "$ORPHAN_PODS" ]; then
    echo "⚠️  Encontrados pods relacionados em outros namespaces:"
    echo "$ORPHAN_PODS"
    echo ""
    confirm "Deseja remover estes pods também?"
    
    # Deletar pods órfãos por namespace
    microk8s kubectl get pods --all-namespaces -o jsonpath='{range .items[*]}{.metadata.namespace}{" "}{.metadata.name}{"\n"}{end}' 2>/dev/null | \
    grep -i tech-challenge | \
    while read namespace pod; do
        if [ "$namespace" != "tech-challenge" ]; then
            echo "🗑️  Deletando pod órfão: $pod (namespace: $namespace)"
            microk8s kubectl delete pod $pod -n $namespace --force --grace-period=0 2>/dev/null || true
        fi
    done
fi

# Limpar imagens do registry local (opcional)
echo ""
read -p "🐳 Deseja limpar também as imagens Docker do registry local? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🧹 Limpando registry local..."
    
    # Verificar se existe pod do registry
    REGISTRY_POD=$(microk8s kubectl get pods -n container-registry -o jsonpath="{.items[0].metadata.name}" 2>/dev/null || true)
    
    if [ ! -z "$REGISTRY_POD" ]; then
        echo "🗑️  Removendo imagem tech-challenge do registry..."
        microk8s kubectl exec -n container-registry $REGISTRY_POD -- sh -c "rm -rf /var/lib/registry/docker/registry/v2/repositories/tech-challenge" 2>/dev/null || echo "Imagem não encontrada no registry"
        
        echo "🔄 Reiniciando registry..."
        microk8s kubectl delete pod $REGISTRY_POD -n container-registry 2>/dev/null || true
        microk8s kubectl wait --for=condition=ready pod -l app=registry -n container-registry --timeout=60s 2>/dev/null || true
        echo "✅ Registry limpo!"
    else
        echo "ℹ️  Registry não encontrado"
    fi
    
    # Limpar imagens Docker locais
    echo "🧹 Limpando imagens Docker locais..."
    docker rmi tech-challenge:latest 2>/dev/null || echo "Imagem local não encontrada"
    docker rmi localhost:32000/tech-challenge:latest 2>/dev/null || echo "Imagem taggeada não encontrada"
    
    # Limpar imagens não utilizadas
    echo "🧹 Removendo imagens Docker não utilizadas..."
    docker image prune -f 2>/dev/null || true
fi

echo ""
echo "🔍 Verificação final..."

# Verificação final
if microk8s kubectl get namespace tech-challenge >/dev/null 2>&1; then
    echo "❌ ERRO: Namespace ainda existe!"
    exit 1
else
    echo "✅ Namespace removido"
fi

# Verificar se não há pods relacionados
REMAINING_PODS=$(microk8s kubectl get pods --all-namespaces 2>/dev/null | grep -i tech-challenge || true)
if [ -n "$REMAINING_PODS" ]; then
    echo "⚠️  Ainda existem pods relacionados:"
    echo "$REMAINING_PODS"
else
    echo "✅ Nenhum pod relacionado encontrado"
fi

# Verificar PVs
REMAINING_PVS=$(microk8s kubectl get pv 2>/dev/null | grep -i tech-challenge || true)
if [ -n "$REMAINING_PVS" ]; then
    echo "⚠️  Ainda existem Persistent Volumes:"
    echo "$REMAINING_PVS"
else
    echo "✅ Nenhum Persistent Volume relacionado encontrado"
fi

echo ""
echo "🎉 Limpeza completa finalizada!"
echo ""
echo "📋 O ambiente está limpo e pronto para um novo deploy:"
echo "   microk8s kubectl apply -k ."
echo ""
echo "💡 Para verificar que está tudo limpo:"
echo "   microk8s kubectl get all --all-namespaces | grep tech-challenge"
