/*global define */
define([
	'underscore',
	'backbone',
	'collections/Object3DCollections',
	'views/Object3DView',
	'models/Object3D',
	'models/Vector3D',
	'models/Rotate3D',
	'models/Color3D',
	'models/Common'
], function(_, Backbone, Object3DCollection, Object3DView, Object3D, Vector3D, Rotate3D, Color3D, Common) {
	'use strict';

	var WorldView = Backbone.View.extend({
		el: '#worldview',
		tagName: 'ul',
		events: {
			"click #btn_create": "crateNewObject"
		},
		nodeRoot: {
			id: Common.ID_ROOTNODE, //FIXME
			nodes: []
		},
		nodeCamera: {
			id: Common.ID_CAMERA, 
			type: "cameras/orbit2",
			yaw: 0,
			pitch: 0,
			zoom: 50,
			zoomSensitivity: 0.1,
			nodes: []
		},
		nodeMaterial: {
			id: Common.ID_SPHERE_ROOT,
			type: "material",
			color: {
				r: 0.6,
				g: 0.6,
				b: 0.9
			},
			nodes: []
		},
		blueGrid: {
			// Blue color for ground plane
			type: "material",
			color: {
				r: 0.8,
				g: 0.8,
				b: 1.0
			},
			nodes: [
				// Grid ground plane geometry, implemented by plugin at
				// http://scenejs.org/api/latest/plugins/node/prims/grid.js
				{
					type: "prims/grid",
					size: {
						x: 1000,
						z: 1000
					},
					xSegments: 200,
					zSegments: 200
				}
			]
		},

		myScene: null,
		mySceneCanvas: null,
		//functions not used ... begins here.
		createIDAndName: function(latNumber, longNumber) {
			var idname = String(Common.IDNAME_HEADER + latNumber + Common.IDNAME_DELIMITER + longNumber);
			return idname;
		},
		OrbitCameraMatrix: function(MouseX, MouseY) {
			myScene.getNode(id_CameraOrbit, function(cameraOrbit) {
				myScene.getNode(ObjID, function(movingObject) {
					myScene.getNode(id_Edgeline, function(edgeLineObject) {
						if (cameraOrbit) {
							var cameraMatrix;
							var eye;
							var look;
							cameraMatrix = cameraOrbit.nodes[0].getMatrix();
							eye = cameraOrbit.nodes[0].getEye();
							look = cameraOrbit.nodes[0].getLook();
							if (movingObject) {
								if (!ObjOriginalPos) {
									ObjOriginalPos = movingObject.getXYZ();
								}

								//X Vector of World Matrix
								VecRight = {
									x: cameraMatrix[0],
									y: cameraMatrix[4],
									z: cameraMatrix[8],
								};

								//Y Vector of World Matrix
								VecUp = {
									x: cameraMatrix[1],
									y: cameraMatrix[5],
									z: cameraMatrix[9],
								};

								//Z Vector of World Matrix
								VecZ = {
									x: cameraMatrix[2],
									y: cameraMatrix[6],
									z: cameraMatrix[10],
								};

								//Vector from eye to selected Object
								VecTgtFmEye = {
									x: ObjOriginalPos.x - eye.x,
									y: ObjOriginalPos.y - eye.y,
									z: ObjOriginalPos.z - eye.z,
								};

								//Cross product of VecZ and Vector from eye to target
								var distance = VecTgtFmEye.x * VecZ.x + VecTgtFmEye.y * VecZ.y + VecTgtFmEye.z * VecZ.z;

								var MouseDiff = {
									x: ClickPos.x - MouseX,
									y: (ClickPos.y - MouseY) * -1
								};

								var PosDiff = {
									x: VecRight.x * MouseDiff.x + VecUp.x * MouseDiff.y,
									y: VecRight.y * MouseDiff.x + VecUp.y * MouseDiff.y,
									z: VecRight.z * MouseDiff.x + VecUp.z * MouseDiff.y
								};

								PosDiff.x *= distance;
								PosDiff.y *= distance;
								PosDiff.z *= distance;

								var newPosition = {
									x: ObjOriginalPos.x + PosDiff.x,
									y: ObjOriginalPos.y + PosDiff.y,
									z: ObjOriginalPos.z + PosDiff.z,
								};


								movingObject.setXYZ(newPosition);

								var msgP = {
									x: newPosition.x.toFixed(2),
									y: newPosition.y.toFixed(2),
									z: newPosition.z.toFixed(2)
								};


								var edgeList = _.filter(sphere.pointsIndexies, function(v) {
									return v.id == ObjID;
								});

								sphere.positions[edgeList[0].x] = newPosition.x;
								sphere.positions[edgeList[0].y] = newPosition.y;
								sphere.positions[edgeList[0].z] = newPosition.z;

								console.log("edges");
								console.log(edgeList);
								var labelMessage = "Moving : " + ObjID + " x:" + msgP.x + " y:" + msgP.y + " z:" + msgP.z;
								edgeLineObject.setPositions({
									positions: sphere.positions
								});

								UpdateLabelMessage(labelMessage);
							}
						}
					});
				});
			});
		},

		OrbitCameraDisable: function() {
			myScene.getNode(id_CameraOrbit, function(cameraOrbit) {
				if (cameraOrbit) {
					cameraOrbit.OrbitCameraDisable();
				}
			});
		},

		OrbitCameraEnable: function() {
			myScene.getNode(id_CameraOrbit, function(cameraOrbit) {
				if (cameraOrbit) {
					cameraOrbit.OrbitCameraEnable();
				}
			});
		},
		createVertexSphere: function(idname, x, y, z) {
			var r = {
				id: idname,
				type: "translate",
				x: x,
				y: y,
				z: z,
				nodes: [{
					type: "name",
					name: idname,
					nodes: [{
						radius: 0.1,
						type: "prims/sphere"
					}]
				}]
			};
			return r;
		},

		createVertexPoint: function(radius) {
			var latitudeBands = 20;
			var longitudeBands = 30;
			var positions = [];
			for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
				var theta = latNumber * Math.PI / latitudeBands;
				var sinTheta = Math.sin(theta);
				var cosTheta = Math.cos(theta);

				for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
					if ((latNumber == 0) && (longNumber > 0))
						break;
					if (latNumber == latitudeBands && longNumber > 0)
						break;

					var phi = longNumber * 2 * Math.PI / longitudeBands;
					var sinPhi = Math.sin(phi);
					var cosPhi = Math.cos(phi);
					var x = cosPhi * sinTheta;
					var y = cosTheta;
					var z = sinPhi * sinTheta;
					var xp = radius * x;
					var yp = radius * y;
					var zp = radius * z;
					positions.push(xp);
					positions.push(yp);
					positions.push(zp);
				}
			}


			var result = {
				positions: positions
			};
			return result;
		},
		//functions not used ... ends here.
		initialize: function() {

			this.$positionX = this.$('#position-x');
			this.$positionY = this.$('#position-y');
			this.$positionZ = this.$('#position-z');
			this.$rotationX = this.$('#rotation-x');
			this.$rotationY = this.$('#rotation-y');
			this.$rotationZ = this.$('#rotation-z');
			this.$sizeX = this.$('#size-x');
			this.$sizeY = this.$('#size-y');
			this.$sizeZ = this.$('#size-z');
			this.$color = this.$('#obj_color');
			this.$name = this.$('#obj_name');

			// Setup Scene JS
			SceneJS.setConfigs({
				pluginPath: "scenejs2/js/lib/scenejs/plugins"
			});

			this.nodeCamera.nodes.push(this.blueGrid);
			this.nodeRoot.nodes.push(this.nodeCamera);
			this.myScene = SceneJS.createScene(this.nodeRoot);
			this.mySceneCanvas = this.myScene.getCanvas();

		},
		render: function() {
			Object3DCollection.each(function(object3D) {
				var object3DView = new Object3DView({
					model: object3D
				});
				this.$el.append(object3DView.render().el);
			}, this);
			return this;
		},



		create: function(type, x, y, z, roll, pitch, yaw, w, h, d) {
			var position = new Vector3D({
				x: x,
				y: y,
				z: z
			});
			var rotation = new Vector3D({
				x: roll,
				y: pitch,
				z: yaw
			});
			var size = new Vector3D({
				x: w,
				y: h,
				z: d
			});
			var obj = new Object3D({
				position: position,
				rotation: rotation,
				size: size,
				type: type
			});
			this.collection.add(obj);
		},
		moving: false,
		onMouseHit: function(hit) {
			if (!this.moving) {
				info.innerHTML = "Pick hit: " + JSON.stringify(hit);
				ObjID = hit.name;
				//disable motion of orbit camera
				OrbitCameraDisable();
				//Set the original click point
				ClickPos = {
					x: (hit.canvasPos[0] - canvas.width / 2.0) / (canvas.width),
					y: (hit.canvasPos[1] - canvas.height / 2.0) / (canvas.height)
				};
				GetObjectPosition(ObjID);
				ObjOriginalPos = null;
				moving = true;
			}
		},
		pick: function(cid) {
			//update the values
		},
		create3DObject: function(type, x, y, z, roll, pitch, yaw, w, h, d, r, g, b) {
			var position = new Vector3D({
				x: x,
				y: y,
				z: z
			});
			var rotation = new Rotate3D({
				roll: roll,
				pitch: pitch,
				yaw: yaw
			});
			var size = new Vector3D({
				x: w,
				y: h,
				z: d
			});
			var color = new Color3D({
				r: r,
				g: g,
				b: b,
			});
			var obj = new Object3D({
				position: position,
				rotation: rotation,
				size: size,
				color: color,
				type: type
			});
			return obj;
		},
		createSceneJSObj: function(object3D) {
			var position = object3D.get('position');
			var rotation = object3D.get('position');
			var size = object3D.get('size');
			var color = object3D.get('color');
			var type = object3D.get('type');

			var nodeRotationRoll = {
				type: "rotate",
				id: Common.NodeNameRotateRoll(object3D),
				angle: rotation.get('roll'),
				x: 1.0,
				y: 0.0,
				z: 0.0,
				nodes: []
			};
			var nodeRotationPitch = {
				type: "rotate",
				id: Common.NodeNameRotatePitch(object3D),
				angle: rotation.get('pitch'),
				x: 0.0,
				y: 0.0,
				z: 1.0,
				nodes: []
			};
			var nodeRotationYaw = {
				type: "rotate",
				id: Common.NodeNameRotateYaw(object3D),
				angle: rotation.get('yaw'),
				x: 0.0,
				y: 1.0,
				z: 0.0,
				nodes: []
			};
			var nodeTranslate = {
				id: Common.NodeNameTransfer(object3D),
				type: "translate",
				x: position.get('x'),
				y: position.get('y'),
				z: position.get('z'),
				nodes: []
			};
			var nodeColor = {
				type: "material",
				id: Common.NodeNameColor(object3D),
				color: {
					r: color.get('r'),
					g: color.get('g'),
					b: color.get('b')
				},
				nodes: []
			};
			var nodeObj = {
				type: "prims/sphere",
				id: Common.NodeNameObject(object3D),
				name: Common.NodeNameObject(object3D),
				radius: size.get('x'),
			};

			if (type == Common.Object3D_CUBE_KEY) {
				nodeObj = {
					type: "prims/box",
					id: Common.NodeNameObject(object3D),
					name: Common.NodeNameObject(object3D),
					xSize: size.get('x'),
					ySize: size.get('y'),
					zSize: size.get('z')
				};
			}
			nodeColor.nodes.push(nodeObj);
			nodeTranslate.nodes.push(nodeColor);
			nodeRotationYaw.nodes.push(nodeTranslate);
			nodeRotationPitch.nodes.push(nodeRotationYaw);
			nodeRotationRoll.nodes.push(nodeRotationPitch);

			this.myScene.getNode(Common.ID_CAMERA, function(cameraNode) {
				cameraNode.getCamera().addNode(nodeRotationRoll);
			});
			return nodeRotationRoll;
		},

		crateNewObject: function() {
			console.log('create New Object');
			var atr = this.newAttributes();
			console.log('attributes of  Object');
			console.log(atr);
			var j = new Object3D(atr);
			this.createSceneJSObj(j);
		},

		newAttributes: function() {
			var position = new Vector3D({
				x: parseFloat(this.$positionX.val().trim()),
				y: parseFloat(this.$positionY.val().trim()),
				z: parseFloat(this.$positionZ.val().trim()),
			});

			var rotation = new Rotate3D({
				roll: parseFloat(this.$rotationX.val().trim()),
				yaw: parseFloat(this.$rotationY.val().trim()),
				pitch: parseFloat(this.$rotationZ.val().trim()),
			});

			var size = new Vector3D({
				x: parseFloat(this.$sizeX.val().trim()),
				y: parseFloat(this.$sizeY.val().trim()),
				z: parseFloat(this.$sizeZ.val().trim()),
			});

			//FIXME bug on converting hex to decimal
			var colorCode = this.$color.val();
			var colIR = parseInt(colorCode.substring(1, 2), 16);
			var colIG = parseInt(colorCode.substring(3, 2), 16);
			var colIB = parseInt(colorCode.substring(5, 2), 16);
			var colorR = parseFloat(colIR) / 255.0;
			var colorG = parseFloat(colIG) / 255.0;
			var colorB = parseFloat(colIB) / 255.0;
			var color = new Color3D({
				r: colorR,
				g: colorG,
				b: colorB
			});

			return {
				position: position,
				rotation: rotation,
				size: size,
				color: color,
				labelname: this.$name.val().trim(),
				type: $("input[name='objecttype']:checked").val()
			};
		}
	});

	return WorldView;

});