/*global define*/
define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	var Vector3D =  Backbone.Model.extend({
		defaults: {
			x: 0.0,
			y: 0.0,
			z: 0.0
		}
	});

	return Vector3D;
});