/*global define*/
'use strict';

define([], function() {
	return {
		Object3D_BALL_KEY: "Object3D_BALL",
		Object3D_CUBE_KEY: "Object3D_CUBE",
		IDNAME_HEADER: "TID_",
		IDNAME_DELIMITER: "_",
		ID_ROOTNODE: "ID_ROOTNODE",
		ID_CAMERA: "ID_CAMREAORBIT",
		ID_SPHERE_ROOT: "ID_SPHERE_ROOT",

		NodeNameTransfer: function(object3D) {
			return "" + this._node_prefix_transfer + object3D.cid;
		},
		NodeNameRotateRoll: function(object3D) {
			return "" + this._node_prefix_rotate_roll + object3D.cid;
		},
		NodeNameRotateYaw: function(object3D) {
			return "" + this._node_prefix_rotate_yaw + object3D.cid;
		},
		NodeNameRotatePitch: function(object3D) {
			return "" + this._node_prefix_rotate_pitch + object3D.cid;
		},
		NodeNameColor: function(object3D) {
			return "" + this._node_prefix_color + object3D.cid;
		},
		NodeNameObject: function(object3D) {
			return "" + this._node_prefix_object + object3D.cid;
		},
		//Private values
		_node_prefix_transfer: "node_transfer_",
		_node_prefix_rotate_roll: "node_rotate_roll",
		_node_prefix_rotate_yaw: "node_rotate_yaw",
		_node_prefix_rotate_pitch: "node_rotate_pitch",
		_node_prefix_color: "node_color_",
		_node_prefix_object: "node_object_"
	};
});