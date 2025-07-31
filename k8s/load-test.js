import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

var ambiente = "http://192.168.28.161:30000"
const API_KEY = "xFcv8efXxt"

export const options = {
    scenarios: {
        // Cenário principal de teste de carga com stages
        load_test_scenario: {
            executor: "ramping-vus",
            stages: [
                { duration: '30s', target: 20 },  // Ramp-up rápido
                { duration: '1m', target: 50 },   // Escala para 50 usuários
                { duration: '2m', target: 80 },   // Pico de 80 usuários
                { duration: '1m', target: 100 },  // SPIKE extremo
                { duration: '1m', target: 0 },    // Cool-down
            ],
            startTime: "0s",
        },
        
        // Cenário adicional para testes pontuais
        burst_test_scenario: {
            executor: "constant-arrival-rate",
            duration: '30s',
            rate: 50,
            timeUnit: '1s',
            preAllocatedVUs: 10,
            maxVUs: 30,
            startTime: "6m", // Inicia após o cenário principal
        },
    },
    
    thresholds: {
        http_req_duration: ['p(95)<3000'],
        http_req_failed: ['rate<0.1'],
        'http_req_duration{name:customers}': ['p(99)<5000'],
    },
    
    summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
    summaryTimeUnit: 'ms',
};

const loginData = {
    "email": "david.email@gmail.com",
    "password": "Senh@12"
}

const loginHeaders = {
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
    }
}

export function setup() {
    console.log("🚀 Iniciando setup do teste de carga...")
    console.log("🔐 Fazendo login para obter token de autenticação...")
    
    const loginResponse = http.post(
        `${ambiente}/v1/auth/login`,
        JSON.stringify(loginData),
        loginHeaders
    )
    
    const loginCheck = check(loginResponse, {
        'login status é 200 ou 201': (res) => res.status === 200 || res.status === 201,
        'token presente no response': (res) => {
            try {
                const body = JSON.parse(res.body);
                return body.access_token && body.access_token.length > 0;
            } catch (e) {
                return false;
            }
        }
    });
    
    if (loginCheck) {
        const loginBody = JSON.parse(loginResponse.body);
        console.log("✅ Token de autenticação obtido com sucesso");
        return { 
            token: loginBody.access_token,
            ambiente: ambiente 
        };
    } else {
        console.error(`❌ Falha no login: ${loginResponse.status}`);
        console.error(`❌ Response: ${loginResponse.body}`);
        return { 
            token: null,
            ambiente: ambiente 
        };
    }
}

export default function (data) {
    
    if (!data.token) {
        console.error('❌ Token não disponível - abortando execução');
        return;
    }
    
    const authHeaders = {
        headers: {
            'Authorization': `Bearer ${data.token}`
        }
    }
    
    for (let i = 0; i < 3; i++) {
        const customersResponse = http.get(
            `${data.ambiente}/v1/customers?name=David%20Teixeira`,
            Object.assign({}, authHeaders, {
                tags: { name: 'customers' }
            })
        );
        
        check(customersResponse, {
            'customers status code é 200': (res) => res.status === 200,
            'customers response time < 3s': (res) => res.timings.duration < 3000,
            'customers response não está vazio': (res) => res.body.length > 0
        });
        
        sleep(0.1);
    }
    
    sleep(0.5);
}

export function teardown(data) {
    console.log("🏁 Encerrando o teste de carga...");
    console.log("📊 Para verificar o resultado do scaling:");
    console.log("   microk8s kubectl get hpa -n tech-challenge");
    console.log("   microk8s kubectl get pods -n tech-challenge");
    console.log("   microk8s kubectl top pods -n tech-challenge");
}

export function handleSummary(data) {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    
    return {
        [`reports/k6-report-${timestamp}.html`]: htmlReport(data, { 
            title: "Tech Challenge - Load Test Report" 
        }),
        stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
}
