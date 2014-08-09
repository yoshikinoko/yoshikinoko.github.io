/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'lib/text!views/label.html',
	'models/Object3D',
	'models/Common'
], function ($, _, Backbone, templatelabel,Object3D, Common) {
	'use strict';

	var Object3DView = Backbone.View.extend({

		tagName:'li',
		template: _.template(templatelabel),
		events: {
			'click .info':	'showInfo',
		},
		showInfo : function(){
			var xyz = this.model.get('position');
			var x = xyz.get('x');
			var y = xyz.get('y');
			var z = xyz.get('z');
			alert('POSITION x:' + x + " y:" + y + " z:"+z);
		},
		initialize: function () {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
			this.listenTo(this.model, 'visible', this.toggleVisible);
		},
		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

	});

	return Object3DView;
});
