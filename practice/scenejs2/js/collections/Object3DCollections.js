/*global define */
define([
	'underscore',
	'backbone',
	'backboneLocalstorage',
	'models/Object3D'
], function (_, Backbone, Store, Object3D) {
	'use strict';

	var Object3DCollection = Backbone.Collection.extend({
		// Reference to this collection's model.
		model: Object3D,

		// Save all of the todo items under the `"todos"` namespace.
		localStorage: new Store('object3D-backbone'),

		//Create new Object
		// carete : function (type){


		// },

		// // Filter down the list of all todo items that are finished.
		// completed: function () {
		// 	return this.where({completed: true});
		// },

		// // Filter down the list to only todo items that are still not finished.
		// remaining: function () {
		// 	return this.where({completed: false});
		// },

		// // We keep the Todos in sequential order, despite being saved by unordered
		// // GUID in the database. This generates the next order number for new items.
		// nextOrder: function () {
		// 	return this.length ? this.last().get('order') + 1 : 1;
		// },

		// Todos are sorted by their original insertion order.
		// comparator: 'order'
	});

	return new Object3DCollection();
});
