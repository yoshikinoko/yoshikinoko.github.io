define([
	'underscore',
	'backbone',
	'models/Vector3D',
	'models/Rotate3D',
	'models/Color3D',
	'models/Common'
], function(_, Backbone, Vector3D, Rotate3D, Color3D, Common) {
	'use strict';

	var Object3D = Backbone.Model.extend({
		defaults: function() {
			return {
				position: new Vector3D(),
				rotation: new Rotate3D(),
				size: new Vector3D(),
				color: new Color3D(),
				labelname: 'object',
				type: Common.Object3D_BALL_KEY
			};
		},
	});
	return Object3D;
});