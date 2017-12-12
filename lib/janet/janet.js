/*!
 * Janet
 * JSON template validator
 *
 * Copyright (c) 2017 Thibaud Courtoison
 * Licensed under MIT License
 */

var Janet = function(types) { this.types = types; };

Janet.validate = function(json, template, types, meta) {

	// Validate arguments
	if (typeof json == "string") {
		try {
			json = JSON.parse(json);
		} catch (e) {
			return [e.message];
		}
	}
	types = types || [];

	// If not meta, validate template
	if (!meta) {
		var validateTemplate = Janet.validate(template,Janet.baseTemplate,Janet.baseTemplateTypes,true);
		if (validateTemplate != true) {
			return validateTemplate;
		}
	}

	// Validate json
	var validator = new Janet(types);
	var errors = validator.validateNode(meta ? 'template' : 'root', json, template);
	return errors.length > 0 ? errors : true;
};

Janet.baseTemplate = {
	type: "node",
};

Janet.baseTemplateTypes = {
	node: {
		type: "object",
		elements: [
			{
				name: "name",
				type: "string",
				optional: true
			},
			{
				name: "type",
				type: "string"
			},
			{
				name: "item",
				type: "node",
				optional: true
			},
			{
				name: "elements",
				type: "array",
				item: {
					type: "node"
				},
				optional: true
			},
			{
				name: "optional",
				type: "boolean",
				optional: true
			}
		]
	}
};

Janet.prototype.validateNode = function(key, node, template) {

	//console.log(key, node, template);

	if (['object','array','string','integer','boolean'].indexOf(template.type) == -1 &&
		!this.types[template.type]) {
		return [this.error(key,"type unrecognize")];
	}

	if (template.type == 'object') {
 		return this.validateObject(key, node, template);
 	} else if (template.type == 'array') {
		return this.validateArray(key, node, template);
	} else if (template.type == 'string') {
		return this.validateString(key, node, template);
	} else if (template.type == 'integer') {
		return this.validateInteger(key, node, template);
	} else if (template.type == 'boolean') {
		return this.validateBoolean(key, node, template);
	} else {
		template.item = this.types[template.type].item;
		template.elements = this.types[template.type].elements;
		template.type = this.types[template.type].type;
		return this.validateNode(key, node, template);
	}
};

Janet.prototype.validateObject = function(key, node, template) {

	if (typeof node != 'object') {
		return [this.error(key,"should be of type Object")];
	}

	var errors = [];

	if (template.elements) {
		for (var i = 0; i < template.elements.length; i++) {
			var innerTemplate = template.elements[i];
			var innerKey = key+'.'+innerTemplate.name;
			var innerNode = node[innerTemplate.name];
			if (innerNode === null || innerNode === undefined) {
				if (!innerTemplate.optional) {
					errors.push(this.error(innerKey,"is missing"));
				}
			} else {
				errors = errors.concat(this.validateNode(innerKey,innerNode,innerTemplate));
			}
		}
	}

	return errors;
};

Janet.prototype.validateArray = function(key, node, template) {

	if (!Array.isArray(node)) {
		return [this.error(key,"should be of type Array")];
	}

	var errors = [];

	for (var i = 0; i < node.length; i++) {
		var innerNode = node[i];
		var innerKey = key+'.'+i;
		errors = errors.concat(this.validateNode(innerKey,innerNode,template.item));
	}

	return errors;
};

Janet.prototype.validateString = function(key, node, template) {

	if (typeof node != 'string') {
		return [this.error(key,"should be of type String")];
	}

	return [];
};

Janet.prototype.validateInteger = function(key, node, template) {

	if (!Number.isInteger(node)) {
		return [this.error(key,"should be of type Integer")];
	}

	return [];
};

Janet.prototype.validateBoolean = function(key, node, template) {

	if (typeof node != 'boolean') {
		return [this.error(key,"should be of type Boolean")];
	}

	return [];
}

Janet.prototype.error = function(key, message) {
	return "'"+key+"' "+message;
};
