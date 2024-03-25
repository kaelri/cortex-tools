const cortexCharacterDefault = {
	"$schema": "https://cortex.engard.me/data/cortex_character_schema.json",
	"version": 0,
	"id": null,
	"created": 0,
	"modified": 0,
	"name": "Name",
	"description": "Description",
	"pronouns": "",
	"traitSets": [
		{
			"name": "Distinctions",
			"description": "Trait set description",
			"features": [ 'description', 'sfx', 'hinder' ],
			"style": "distinctions",
			"location": "left",
			"noun": "Distinction",
			"traits": [
				{
					"name": "Distinction 1",
					"value": 8,
					"description": "Trait description",
					"sfx": [
						{
							"name": "Hinder",
							"description": "Gain a PP when you switch out this distinction’s d8 for a d4."
						}
					]
				},
				{
					"name": "Distinction 2",
					"value": 8,
					"description": "Trait description",
					"sfx": [
						{
							"name": "Hinder",
							"description": "Gain a PP when you switch out this distinction’s d8 for a d4."
						}
					]
				},
				{
					"name": "Distinction 3",
					"value": 8,
					"description": "Trait description",
					"sfx": [
						{
							"name": "Hinder",
							"description": "Gain a PP when you switch out this distinction’s d8 for a d4."
						}
					]
				}
			]
		},
		{
			"name": "Attributes",
			"description": "Trait set description",
			"features": [],
			"style": "default",
			"location": "attributes",
			"noun": "Attribute",
			"allowStatement": true,
			"allowSFX": false,
			"allowHinder": false,
			"traits": [
				{
					"name": "Attribute 1",
					"value": 8,
					"description": "Trait description",
					"sfx": []
				}
			]
		},
		{
			"name": "New trait set",
			"description": "Trait set description",
			"features": [],
			"style": "default",
			"location": "left",
			"noun": "",
			"allowStatement": true,
			"allowSFX": false,
			"allowHinder": false,
			"traits": [
				{
					"name": "New trait",
					"value": 6,
					"description": "Trait description",
					"sfx": []
				}
			]
		}
	],
	"portrait": {
		"url": "",
		"alignment": "center"
	}	
}
