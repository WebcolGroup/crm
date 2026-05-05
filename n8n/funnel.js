{
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "lead-webcol",
        "options": {}
      },
      "id": "a25c71bf-5936-4399-a538-0ab1eb021184",
      "name": "Webhook Lead",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [
        -1744,
        160
      ],
      "webhookId": "3327b99a-f5f7-4c0a-bf3c-8a5b329db3d5"
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "nombre",
              "value": "={{$json[\"body\"][\"nombre\"]}}"
            },
            {
              "name": "email",
              "value": "={{$json[\"body\"][\"email\"]}}"
            },
            {
              "name": "empresa",
              "value": "={{$json[\"body\"][\"empresa\"]}}"
            },
            {
              "name": "problema",
              "value": "={{$json[\"body\"][\"problema\"]}}"
            },
            {
              "name": "telefono",
              "value": "={{$json[\"body\"][\"telefono\"]}}"
            }
          ]
        },
        "options": {}
      },
      "id": "477002e0-2197-448d-beab-eaf53a6ee115",
      "name": "Normalizar Datos",
      "type": "n8n-nodes-base.set",
      "typeVersion": 2,
      "position": [
        -1536,
        160
      ]
    },
    {
      "parameters": {
        "requestMethod": "POST",
        "url": "https://crm.rammux.com/auth/login",
        "jsonParameters": true,
        "options": {
          "bodyContentType": "json"
        },
        "bodyParametersJson": "{\"email\":\"admin@webcol.co\",\"password\":\"Webcol2024!\"}",
        "headerParametersJson": "{\"Content-Type\":\"application/json\"}"
      },
      "id": "230f48e4-3345-40ef-ac59-dd2ae37da21b",
      "name": "Login CRM",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 2,
      "position": [
        -1344,
        160
      ]
    },
    {
      "parameters": {
        "requestMethod": "POST",
        "url": "https://crm.rammux.com/leads",
        "jsonParameters": true,
        "options": {
          "bodyContentType": "json"
        },
        "bodyParametersJson": "={{ JSON.stringify({ nombre: $node['Normalizar Datos'].json.nombre, email: $node['Normalizar Datos'].json.email, telefono: $node['Normalizar Datos'].json.telefono, empresa: $node['Normalizar Datos'].json.empresa, problema: $node['Normalizar Datos'].json.problema, fuente: 'landing', valor_estimado: 0 }) }}",
        "headerParametersJson": "={{ JSON.stringify({ Authorization: 'Bearer ' + $json.access_token, 'Content-Type': 'application/json' }) }}"
      },
      "id": "0f01de27-4924-4b04-bf68-941564f8338f",
      "name": "Guardar en CRM",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 2,
      "position": [
        -1136,
        160
      ]
    },
    {
      "parameters": {
        "requestMethod": "POST",
        "url": "https://api.openai.com/v1/chat/completions",
        "jsonParameters": true,
        "options": {},
        "bodyParametersJson": "={{ JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: 'Analiza este lead: Empresa: ' + $node[\"Normalizar Datos\"].json.empresa + ', Problema: ' + $node[\"Normalizar Datos\"].json.problema + '. Clasifica como HOT, WARM o COLD y responde SOLO en JSON con el campo nivel. Ejemplo: {\"nivel\":\"HOT\"}' }] }) }}",
        "headerParametersJson": "={{ JSON.stringify({ Authorization: 'Bearer ' + $vars.OPENAI_API_KEY, 'Content-Type': 'application/json' }) }}"
      },
      "id": "10f9d450-7dad-48c6-9ea4-81c56569f859",
      "name": "Lead Scoring IA",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 2,
      "position": [
        -992,
        400
      ]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{JSON.parse($json[\"choices\"][0][\"message\"][\"content\"]).nivel}}",
              "value2": "HOT"
            }
          ]
        }
      },
      "id": "9801c43c-2667-4469-b81d-d23b84771ab1",
      "name": "Es Lead HOT?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [
        -848,
        160
      ]
    },
    {
      "parameters": {
        "requestMethod": "POST",
        "url": "={{  'https://graph.facebook.com/v18.0/' + $vars.WHATSAPP_PHONE_NUMBER_ID + '/messages' }}",
        "jsonParameters": true,
        "options": {},
        "bodyParametersJson": "={{ JSON.stringify({ messaging_product: 'whatsapp', to: $node['Normalizar Datos'].json.telefono, type: 'text', text: { body: '🔥 Nuevo lead HOT!.nNombre: ' + $node['Normalizar Datos'].json.nombre + '.nEmpresa: ' + $node['Normalizar Datos'].json.empresa + '.nProblema: ' + $node['Normalizar Datos'].json.problema + '.nEmail: ' + $node['Normalizar Datos'].json.email } }) }}",
        "headerParametersJson": "={{ JSON.stringify({ Authorization: 'Bearer ' + $vars.WHATSAPP_TOKEN, 'Content-Type': 'application/json' }) }}"
      },
      "id": "a726f09f-ff9f-4123-8fa3-dd64b603cfb2",
      "name": "Enviar WhatsApp",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 2,
      "position": [
        -656,
        48
      ]
    },
    {
      "parameters": {
        "unit": "days"
      },
      "id": "3f6e4402-4da4-4e95-998c-7701ac1f0e27",
      "name": "Esperar 1 día",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1,
      "position": [
        -656,
        448
      ],
      "webhookId": "423be52e-ad8b-48e8-9662-f6c669bdffec"
    },
    {
      "parameters": {
        "requestMethod": "POST",
        "url": "={{  'https://graph.facebook.com/v18.0/' + $vars.WHATSAPP_PHONE_NUMBER_ID + '/messages' }}",
        "jsonParameters": true,
        "options": {},
        "bodyParametersJson": "={{ JSON.stringify({ messaging_product: 'whatsapp', to: $node['Normalizar Datos'].json.telefono, type: 'text', text: { body: '👋 Follow up - ' + $node['Normalizar Datos'].json.nombre + ', ¿pudimos ayudarte con: ' + $node['Normalizar Datos'].json.problema + '? Estamos listos para una demo. 🚀' } }) }}",
        "headerParametersJson": "={{ JSON.stringify({ Authorization: 'Bearer ' + $vars.WHATSAPP_TOKEN, 'Content-Type': 'application/json' }) }}"
      },
      "id": "321a9dbe-0a4f-4647-83db-0de702ad615f",
      "name": "Follow Up WhatsApp",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 2,
      "position": [
        -448,
        448
      ]
    }
  ],
  "connections": {
    "Webhook Lead": {
      "main": [
        [
          {
            "node": "Normalizar Datos",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Normalizar Datos": {
      "main": [
        [
          {
            "node": "Login CRM",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Login CRM": {
      "main": [
        [
          {
            "node": "Guardar en CRM",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Guardar en CRM": {
      "main": [
        [
          {
            "node": "Lead Scoring IA",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Lead Scoring IA": {
      "main": [
        [
          {
            "node": "Es Lead HOT?",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Es Lead HOT?": {
      "main": [
        [
          {
            "node": "Enviar WhatsApp",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Esperar 1 día",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Esperar 1 día": {
      "main": [
        [
          {
            "node": "Follow Up WhatsApp",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "a402ad187cc643a58b07233419b157d08d76373a0c0593a3af52e09407dc06e0"
  }
}