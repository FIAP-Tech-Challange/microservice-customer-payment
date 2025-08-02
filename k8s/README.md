# Tech Challenge - Kubernetes Deployment

Este diretório contém os arquivos de configuração para deployment da aplicação Tech Challenge no Kubernetes usando MicroK8s.

## 📁 Artefatos Kubernetes

### 🗂️ Estrutura dos Arquivos

- **`namespace.yaml`** - Define o namespace isolado `tech-challenge` para organizar todos os recursos
- **`secrets.yaml`** - Contém configurações sensíveis codificadas em base64 (senhas, tokens, chaves API)
- **`deployment.yaml`** - Define os deployments da aplicação NestJS e banco PostgreSQL com health checks
- **`service.yaml`** - Expõe os serviços internamente (ClusterIP) e externamente (NodePort/LoadBalancer)
- **`hpa.yaml`** - Configura o Horizontal Pod Autoscaler para escalonamento automático da aplicação
- **`kustomization.yaml`** - Arquivo de configuração do Kustomize para aplicar todos os recursos juntos

### 📋 Detalhamento dos Artefatos

#### **namespace.yaml**
```yaml
# Cria um namespace isolado para a aplicação
apiVersion: v1
kind: Namespace
metadata:
  name: tech-challenge
```

#### **secrets.yaml**
Contém todas as configurações sensíveis codificadas em base64:
- Credenciais do PostgreSQL (usuário, senha, database)
- URL de conexão com o banco
- Chaves JWT para autenticação
- Porta da aplicação

#### **deployment.yaml**
Define dois deployments principais:

**1. PostgreSQL (postgres-deployment)**
- Imagem: `postgres:15`
- Volume persistente de 5GB
- Health checks com `pg_isready`
- Configurações TCP/IP habilitadas
- Variáveis de ambiente para configuração

**2. Aplicação NestJS (tech-challenge-app-deployment)**
- Imagem: `localhost:32000/tech-challenge:latest`
- 2 réplicas para alta disponibilidade (gerenciadas pelo HPA)
- Health checks no endpoint `/health`
- Init container para aguardar PostgreSQL
- Resources otimizados: 128Mi/100m (requests) e 256Mi/200m (limits)
- Horizontal Pod Autoscaler configurado (2-8 réplicas)

#### **service.yaml**
Define três serviços:

**1. postgres-service (ClusterIP)**
- Exposição interna do PostgreSQL na porta 5432
- Usado pela aplicação para conectar no banco

**2. tech-challenge-app-nodeport (NodePort)**
- Exposição externa da aplicação na porta 30000
- Acesso direto via `localhost:30000`

**3. tech-challenge-app-loadbalancer (LoadBalancer)**
- Exposição via LoadBalancer (requer MetalLB)
- IP externo automático quando disponível

#### **hpa.yaml**
Configura o Horizontal Pod Autoscaler para escalonamento automático:
- **Target**: Apenas a aplicação NestJS (PostgreSQL mantém réplica fixa)
- **Min/Max réplicas**: 2 a 8 pods baseado na demanda
- **Métricas**: CPU (70%) e Memória (80%) como triggers
- **Comportamento**: Políticas de scale-up rápido e scale-down conservador
- **Estabilização**: Evita oscilações desnecessárias

#### **kustomization.yaml**
Arquivo que gerencia a aplicação de todos os recursos:
- Lista todos os arquivos YAML a serem aplicados
- Define labels comuns para todos os recursos
- Permite aplicar tudo com um único comando

## 🚀 Pré-requisitos

1. **MicroK8s instalado e configurado**
2. **Addons necessários habilitados:**
   ```bash
   microk8s enable dns
   microk8s enable storage
   microk8s enable registry
   microk8s enable metrics-server  # Necessário para HPA
   microk8s enable metallb  # Opcional, para LoadBalancer
   ```
3. **Docker disponível para build da imagem**

## 📦 Deploy Manual Completo

### **1. Preparação da Imagem**
```bash
# Navegar para o diretório raiz do projeto
# Build da imagem Docker
docker build -t tech-challenge .

# Tag para o registry local
docker tag tech-challenge localhost:32000/tech-challenge:latest

# Push para o registry do MicroK8s
docker push localhost:32000/tech-challenge:latest
```

### **2. Aplicação dos Recursos Kubernetes**
```bash
# Navegar para o diretório k8s
cd k8s

# Aplicar todos os recursos usando Kustomize
microk8s kubectl apply -k .

# OU aplicar cada arquivo individualmente:
microk8s kubectl apply -f namespace.yaml
microk8s kubectl apply -f secrets.yaml
microk8s kubectl apply -f deployment.yaml
microk8s kubectl apply -f service.yaml
microk8s kubectl apply -f hpa.yaml
```

### **3. Verificação do Deploy**
```bash
# Verificar namespace
microk8s kubectl get namespace tech-challenge

# Verificar todos os recursos
microk8s kubectl get all -n tech-challenge

# Verificar pods específicos
microk8s kubectl get pods -n tech-challenge

# Verificar services
microk8s kubectl get services -n tech-challenge

# Verificar secrets
microk8s kubectl get secrets -n tech-challenge

# Verificar volumes persistentes
microk8s kubectl get pvc -n tech-challenge

# Verificar HPA
microk8s kubectl get hpa -n tech-challenge
```

### **4. Monitoramento e Logs**
```bash
# Logs da aplicação
microk8s kubectl logs -f deployment/tech-challenge-app-deployment -n tech-challenge

# Logs do PostgreSQL
microk8s kubectl logs -f deployment/postgres-deployment -n tech-challenge

# Logs de um pod específico
microk8s kubectl logs -f <pod-name> -n tech-challenge

# Descrever um pod (para troubleshooting)
microk8s kubectl describe pod <pod-name> -n tech-challenge
```

### **5. Acesso à Aplicação**
```bash
# Via NodePort (acesso direto)
curl http://localhost:30000/health

# Via port-forward (alternativa)
microk8s kubectl port-forward service/tech-challenge-app-nodeport 3000:3000 -n tech-challenge

# Verificar IP do LoadBalancer (se MetalLB estiver configurado)
microk8s kubectl get service tech-challenge-app-loadbalancer -n tech-challenge
```

## 🔧 Operações de Manutenção

### **Atualizar a Aplicação**
```bash
# 1. Build nova imagem
docker build -t tech-challenge .
docker tag tech-challenge localhost:32000/tech-challenge:latest
docker push localhost:32000/tech-challenge:latest

# 2. Restart do deployment para usar nova imagem
microk8s kubectl rollout restart deployment/tech-challenge-app-deployment -n tech-challenge

# 3. Verificar status do rollout
microk8s kubectl rollout status deployment/tech-challenge-app-deployment -n tech-challenge
```

### **Scaling da Aplicação**

#### **Scaling Manual (temporário):**
```bash
# Escalar manualmente para um número específico
microk8s kubectl scale deployment tech-challenge-app-deployment --replicas=5 -n tech-challenge

# Verificar réplicas atuais
microk8s kubectl get deployment tech-challenge-app-deployment -n tech-challenge
```

#### **Horizontal Pod Autoscaler (HPA):**
```bash
# Verificar status do HPA
microk8s kubectl get hpa -n tech-challenge

# Detalhes do HPA
microk8s kubectl describe hpa tech-challenge-app-hpa -n tech-challenge

# Verificar métricas atuais
microk8s kubectl top pods -n tech-challenge

# Configurar limites do HPA (se necessário)
microk8s kubectl patch hpa tech-challenge-app-hpa -n tech-challenge -p '{"spec":{"minReplicas":3,"maxReplicas":10}}'
```

**💡 Dica**: O HPA funciona automaticamente baseado no uso de CPU (70%) e memória (80%). O scaling manual será sobrescrito pelo HPA.

### **Restart de Pods**
```bash
# Restart da aplicação
microk8s kubectl rollout restart deployment/tech-challenge-app-deployment -n tech-challenge

# Restart do PostgreSQL
microk8s kubectl rollout restart deployment/postgres-deployment -n tech-challenge
```

#### **Configuração dos Secrets**

Para modificar configurações nos secrets:

```bash
# Decodificar um valor atual
microk8s kubectl get secret tech-challenge-secrets -n tech-challenge -o jsonpath='{.data.DB_PASSWORD}' | base64 -d

# Criar novo valor codificado
echo "nova_senha" | base64

# Editar o secret
microk8s kubectl edit secret tech-challenge-secrets -n tech-challenge

# Restart da aplicação após mudanças nos secrets
microk8s kubectl rollout restart deployment/tech-challenge-app-deployment -n tech-challenge
```

## 🛠️ Scripts Disponíveis

- **`cleanup.sh`** - Remove completamente a aplicação e limpa o ambiente
- **`show-access.sh`** - Mostra informações de acesso à aplicação

### **Como usar os scripts:**
```bash
# Mostrar informações de acesso
./show-access.sh

# Limpeza completa do ambiente
./cleanup.sh
```

## 🔍 Troubleshooting

### **Verificar Status Geral**
```bash
# Status dos pods
microk8s kubectl get pods -n tech-challenge

# Eventos do namespace
microk8s kubectl get events -n tech-challenge --sort-by='.lastTimestamp'

# Descrever recursos problemáticos
microk8s kubectl describe pod <pod-name> -n tech-challenge
microk8s kubectl describe service <service-name> -n tech-challenge
```

## 🧹 Limpeza Completa

Para remover todos os recursos:

```bash
# Usando o script (recomendado)
./cleanup.sh

# OU manualmente
microk8s kubectl delete namespace tech-challenge

# Limpar imagens Docker locais
docker rmi tech-challenge:latest
docker rmi localhost:32000/tech-challenge:latest
```

## 📊 Monitoramento

### **Verificar Health da Aplicação**
```bash
# Via NodePort
curl http://localhost:30000/health

# Via port-forward
microk8s kubectl port-forward service/tech-challenge-app-nodeport 3000:3000 -n tech-challenge &
curl http://localhost:3000/health
```

### **Monitorar Recursos**
```bash
# CPU e Memória dos pods
microk8s kubectl top pods -n tech-challenge

# CPU e Memória dos nodes
microk8s kubectl top nodes

# Status do HPA
microk8s kubectl get hpa -n tech-challenge

# Histórico de scaling (últimos events)
microk8s kubectl get events -n tech-challenge --field-selector reason=SuccessfulRescale

# Uso do volume persistente
microk8s kubectl get pvc -n tech-challenge
```

## 🚀 Testes de Carga com K6

### **Pré-requisitos para Testes**

1. **Instalar K6 no Ubuntu/WSL:**
```bash
# Atualizar repositórios
sudo apt update

# Instalar dependências
sudo apt install -y gnupg software-properties-common

# Adicionar chave GPG do K6
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69

# Adicionar repositório do K6
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list

# Instalar K6
sudo apt update
sudo apt install k6

# Verificar instalação
k6 version
```

### **Executar Testes de Carga**

O arquivo `load-test.js` está configurado para:
- ✅ **Autenticação JWT** automática
- ✅ **Múltiplos cenários** de carga
- ✅ **Relatório HTML** automático
- ✅ **Validação do HPA** durante o teste

#### **Execução Simples:**
```bash
# Criar diretório para relatórios
mkdir -p reports

# Executar teste (gera HTML automaticamente)
k6 run load-test.js
```

#### **Estrutura do Teste:**
- **Cenário 1 (ramping-vus)**: Escala gradualmente de 20 a 100 usuários virtuais
- **Cenário 2 (constant-arrival-rate)**: 50 requisições/segundo por 30 segundos
- **Autenticação**: Login automático para obter token JWT
- **Endpoints**: Testa endpoint `/v1/customers` com autenticação
- **Thresholds**: Valida tempo de resposta < 3s e taxa de erro < 10%

#### **Verificar Resultados:**

**1. Relatório HTML:**
```bash
# Ver relatórios gerados
ls -la reports/
```

**2. Monitorar HPA durante teste:**
```bash
# Em outro terminal, monitorar scaling em tempo real
watch -n 5 "microk8s kubectl get hpa -n tech-challenge && echo '---' && microk8s kubectl get pods -n tech-challenge"
```

**3. Verificar métricas após teste:**
```bash
# Status final do HPA
microk8s kubectl get hpa -n tech-challenge

# Pods ativos
microk8s kubectl get pods -n tech-challenge

# Utilização de recursos
microk8s kubectl top pods -n tech-challenge

# Eventos de scaling
microk8s kubectl get events -n tech-challenge --field-selector reason=SuccessfulRescale
```

### **Interpretar Resultados**

#### **Métricas do K6 (Relatório HTML):**
- **HTTP Requests**: Total de requisições processadas
- **Response Time**: Tempo médio, mínimo, máximo e percentis
- **Error Rate**: Porcentagem de falhas
- **Throughput**: Requisições por segundo
- **Checks**: Validações de status code e tempo de resposta

#### **Comportamento do HPA:**
- **Target CPU**: 70% (configurado para escalar quando ultrapassar)
- **Target Memory**: 80% (configurado para escalar quando ultrapassar)
- **Min Replicas**: 2 pods mínimos
- **Max Replicas**: 8 pods máximos
- **Scale Policies**: Scale-up rápido, scale-down conservador

#### **Validação do Scaling:**
✅ **Esperado**: Durante picos de carga, HPA deve escalar de 2 para 3-8 pods
✅ **Verificação**: Pods devem voltar para 2 após o teste terminar
✅ **Performance**: Tempo de resposta deve se manter < 3s mesmo com carga alta

### **Scripts de Monitoramento**

#### **Monitoramento em Tempo Real:**
```bash
# Executar monitor-hpa.sh em paralelo ao teste
chmod +x monitor-hpa.sh
./monitor-hpa.sh
```

### **Cenários de Teste Configurados**

#### **Cenário 1: Ramping Load Test**
```javascript
{
    executor: "ramping-vus",
    stages: [
        { duration: '30s', target: 20 },  // Ramp-up rápido
        { duration: '1m', target: 50 },   // Escala para 50 usuários
        { duration: '2m', target: 80 },   // Pico de 80 usuários
        { duration: '1m', target: 100 },  // SPIKE extremo
        { duration: '1m', target: 0 },    // Cool-down
    ],
}
```

#### **Cenário 2: Burst Test**
```javascript
{
    executor: "constant-arrival-rate",
    duration: '30s',
    rate: 50,                // 50 req/segundo
    timeUnit: '1s',
    preAllocatedVUs: 10,
    maxVUs: 30,
}
```

### **Troubleshooting dos Testes**

#### **❌ Falha de Autenticação (401)**
```bash
# Verificar se secrets JWT estão corretos
microk8s kubectl get secret tech-challenge-secrets -n tech-challenge -o jsonpath='{.data.JWT_SECRET}' | base64 -d

# Verificar endpoint de login
curl -X POST http://localhost:30000/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "x-api-key: xFcv8efXxt" \
  -d '{"email":"david.email@gmail.com","password":"Senh@12"}'
```

#### **❌ HPA não está escalando**
```bash
# Verificar se metrics-server está funcionando
microk8s kubectl top pods -n tech-challenge

# Verificar configuração do HPA
microk8s kubectl describe hpa tech-challenge-app-hpa -n tech-challenge

# Verificar resource requests/limits dos pods
microk8s kubectl describe deployment tech-challenge-app-deployment -n tech-challenge
```

#### **❌ Alta taxa de erro nos testes**
```bash
# Verificar logs da aplicação durante teste
microk8s kubectl logs -f deployment/tech-challenge-app-deployment -n tech-challenge

# Verificar health dos pods
microk8s kubectl get pods -n tech-challenge

# Reduzir intensidade do teste se necessário
# Edite load-test.js e diminua os targets/rates
```

### **Personalizar Testes**

Para ajustar os testes conforme necessário:

#### **Modificar Intensidade:**
```javascript
// Em load-test.js, ajustar stages:
stages: [
    { duration: '30s', target: 10 },  // Menos usuários
    { duration: '1m', target: 25 },   // Carga moderada
    { duration: '1m', target: 50 },   // Pico menor
    { duration: '30s', target: 0 },   // Cool-down
],
```

#### **Configurar Thresholds:**
```javascript
thresholds: {
    http_req_duration: ['p(95)<2000'],     // 95% < 2s
    http_req_failed: ['rate<0.05'],        // < 5% erro
    'http_req_duration{name:customers}': ['p(99)<4000'],  // 99% < 4s
},
```
