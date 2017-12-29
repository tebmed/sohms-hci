var template = {
	"type": "object",
	"elements": [
		{
			"name": "ressources",
			"type": "array",
			"item": {
				"type": "object",
				"elements": [
					{
						"name": "id",
						"type": "integer"
					},
					{
						"name": "nb",
						"type": "integer"
					},
					{
						"name": "name",
						"type": "string"
					},
					{
						"name": "services",
						"type": "array",
						"item": {
							"type": "object",
							"elements": [
								{
									"name": "id",
									"type": "integer"
								},
								{
									"name": "duration",
									"type": "integer"
								}
							]
						}
					}
				]
			}
		},
		{
			"name": "services",
			"type": "array",
			"item": {
				"type": "object",
				"elements": [
					{
						"name": "id",
						"type": "integer"
					},
					{
						"name": "name",
						"type": "string"
					}
				]
			}
		},
		{
			"name": "perturbations",
			"type": "array",
			"item": {
				"type": "object",
				"elements": [
					{
						"name": "trigger",
						"type": "string"
					},
					{
						"name": "action",
						"type": "string"
					}
				]
			}
		},
		{
			"name": "orders",
			"type": "array",
			"item": {
				"type": "object",
				"elements": [
					{
						"name": "id",
						"type": "integer"
					},
					{
						"name": "products",
						"type": "array",
						"item": {
							"type": "object",
							"elements": [
								{
									"name": "id",
									"type": "integer" 
								},
								{
									"name": "nb",
									"type": "integer"
								}
							]
						}
					}
				]
			}
		},
		{
			"name": "products",
			"type": "array",
			"item": {
				"type": "object",
				"elements": [
					{
						"name": "id",
						"type": "integer"
					},
					{
						"name": "description",
						"type": "string"
					},
					{
						"name": "services",
						"type": "array",
						"item": {
							"type": "array",
							"item": {
								"type": "integer"
							}
						}
					}
				]
			}
		},
		{
			"name": "layoutSpec",
			"type": "object",
			"elements": [
				{
					"name": "nodes",
					"type": "array",
					"item": {
						"type": "object",
						"elements": [
							{
								"name": "id",
								"type": "integer"
							},
							{
								"name": "name",
								"type": "string"
							},
							{
								"name": "ressource",
								"type": "integer",
								"optional": true
							}
						]
					}
				},
				{
					"name": "arcs",
					"type": "array",
					"item": {
						"type": "object",
						"elements": [
							{
								"name": "id",
								"type": "string"
							},
							{
								"name": "from",
								"type": "integer"
							},
							{
								"name": "to",
								"type": "integer"
							},
							{
								"name": "size",
								"type": "integer"
							}
						]
					}
				}
			]
		}
	]
};
