/*global define*/
define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	'use strict';

	var Color3D = Backbone.Model.extend({
		defaults: {
			//r, g, b values from 0.0 to 1.0
			r : 0, 
			g : 0,
			b : 0,
		}
	});

	return Color3D;
});