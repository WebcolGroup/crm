{
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "lead-webcol",
        "options": {}
      },
      "id": "a69858b1-85a7-47db-8a7a-d93cc250ff51",
      "name": "Webhook Lead",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [
        -3216,
        272
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
      "id": "fc6d9028-e7e5-4afa-8f56-d417e371039f",
      "name": "Normalizar Datos",
      "type": "n8n-nodes-base.set",
      "typeVersion": 2,
      "position": [
        -3008,
        272
      ]
    },
    {
      "parameters": {
        "requestMethod": "POST",
        "url": "https://crm.rammux.com/auth/login",
        "allowUnauthorizedCerts": true,
        "jsonParameters": true,
        "options": {
          "bodyContentType": "json"
        },
        "bodyParametersJson": "{\"email\":\"admin@webcol.co\",\"password\":\"Webcol2024!\"}",
        "headerParametersJson": "{\"Content-Type\":\"application/json\"}"
      },
      "id": "6c21c301-0f8f-4ec2-8109-c472ab23b0cc",
      "name": "Login CRM",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 2,
      "position": [
        -2816,
        272
      ]
    },
    {
      "parameters": {
        "requestMethod": "POST",
        "url": "https://crm.rammux.com/leads",
        "allowUnauthorizedCerts": true,
        "jsonParameters": true,
        "options": {
          "bodyContentType": "json"
        },
        "bodyParametersJson": "={{ JSON.stringify({ nombre: $node['Normalizar Datos'].json.nombre, email: $node['Normalizar Datos'].json.email, telefono: $node['Normalizar Datos'].json.telefono, empresa: $node['Normalizar Datos'].json.empresa, problema: $node['Normalizar Datos'].json.problema, fuente: 'landing', valor_estimado: 0 }) }}",
        "headerParametersJson": "={{ JSON.stringify({ Authorization: 'Bearer ' + $json.access_token, 'Content-Type': 'application/json' }) }}"
      },
      "id": "6ff2090a-1ea1-4e4a-9d43-3cd8853d8d96",
      "name": "Guardar en CRM",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 2,
      "position": [
        -2608,
        272
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
      "id": "f44abf2a-5e51-4b7f-b6f2-34b9afda41b6",
      "name": "Es Lead HOT?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [
        -2320,
        272
      ]
    },
    {
      "parameters": {
        "requestMethod": "POST",
        "url": "={{  'https://graph.facebook.com/v25.0/' + $vars.WHATSAPP_PHONE_NUMBER_ID + '/messages' }}",
        "jsonParameters": true,
        "options": {},
        "bodyParametersJson": "={{ JSON.stringify({ messaging_product: 'whatsapp', to: $node['Normalizar Datos'].json.telefono, type: 'text', text: { body: '🔥 Nuevo lead HOT!.nNombre: ' + $node['Normalizar Datos'].json.nombre + '.nEmpresa: ' + $node['Normalizar Datos'].json.empresa + '.nProblema: ' + $node['Normalizar Datos'].json.problema + '.nEmail: ' + $node['Normalizar Datos'].json.email } }) }}",
        "headerParametersJson": "={{ JSON.stringify({ Authorization: 'Bearer ' + $vars.WHATSAPP_TOKEN, 'Content-Type': 'application/json' }) }}"
      },
      "id": "3f0e2bd5-4fc1-4c9d-9c21-dfb1ca2069ed",
      "name": "Enviar WhatsApp",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 2,
      "position": [
        -2128,
        160
      ]
    },
    {
      "parameters": {
        "unit": "days"
      },
      "id": "89e8b066-1232-4296-b0b0-1a2641e865a2",
      "name": "Esperar 1 día",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1,
      "position": [
        -2128,
        560
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
      "id": "c52a5ee5-06be-460a-9f77-26e881afc0cd",
      "name": "Follow Up WhatsApp",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 2,
      "position": [
        -1920,
        560
      ]
    },
    {
      "parameters": {
        "requestMethod": "POST",
        "url": "https://api.openai.com/v1/responses",
        "allowUnauthorizedCerts": true,
        "jsonParameters": true,
        "options": {},
        "bodyParametersJson": "={{ JSON.stringify({\n  model: 'gpt-4.1-mini',\n  input: [\n    {\n      role: 'system',\n      content: 'Eres un experto en ventas B2B y calificación de leads. Analizas intención de compra real, urgencia y capacidad de pago.'\n    },\n    {\n      role: 'user',\n      content:\n        'Analiza el siguiente lead:\\n' +\n        'Empresa: ' + $node[\"Normalizar Datos\"].json.empresa + '\\n' +\n        'Problema: ' + $node[\"Normalizar Datos\"].json.problema + '\\n\\n' +\n\n        'Clasifica el lead según:\\n' +\n        '- HOT: tiene urgencia clara, problema crítico y alta intención de compra\\n' +\n        '- WARM: tiene interés pero sin urgencia clara o información incompleta\\n' +\n        '- COLD: baja intención, solo exploración o problema poco claro\\n\\n' +\n\n        'Responde SOLO con JSON válido, sin texto adicional.\\n' +\n        'Formato exacto:\\n' +\n        '{\"nivel\":\"HOT\"}'\n    }\n  ],\n  temperature: 0\n}) }}",
        "headerParametersJson": "={{ {\n  \"Authorization\": \"Bearer \" + $env.OPENAI_API_KEY_FUNNEL,\n  \"Content-Type\": \"application/json\"\n} }}"
      },
      "id": "b89c44b4-5634-4fee-9f14-6f4858f2cb90",
      "name": "Lead Scoring IA1",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 2,
      "position": [
        -2448,
        512
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
            "node": "Lead Scoring IA1",
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
    },
    "Lead Scoring IA1": {
      "main": [
        [
          {
            "node": "Es Lead HOT?",
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