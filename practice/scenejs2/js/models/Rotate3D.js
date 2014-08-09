/*global define*/
define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	'use strict';

	var Rotate3D = Backbone.Model.extend({
		defaults: {
			roll: 0.0, //all values are in "DEGREES"
			yaw: 0.0,
			pitch: 0.0,
		},
	});

	return Rotate3D;
});