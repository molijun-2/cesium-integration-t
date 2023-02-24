/// Note that the following code is ES5
/// Get rid of unnecessary call of jquery as far as possible
import $ from "jquery";

function MovementCtrl(viewer)	// Cesium.viewer
{
    // Private fields pre-defined
	//Eric Yuen - 2017-Sep-09
	var _baseMoveRate = 1000*(1/40);	// Mimic a 3m/s movement
	
	var SPEED_UP_RATE = 10;
	// var ROTATE_SPEED_UP_RATE = 2.5;
	var HUMAN_HEIGHT = 2.5 + 4.5; // 倾斜高度
	//var MOVE_STEP = 2; //2 metre
	var ROTATE_STEP = 0.01/_baseMoveRate;  // radian ~ 0.6 deg.
	var ZOOM_FOV_STEP = 0.035; //radian ~ 2deg
	
	var ZOOM_FOV_MIN = 5 * Math.PI/180;
	var ZOOM_FOV_MAX = 120* Math.PI/180;
	
	var isLocked = false;
	
	var _viewer = viewer;		// cesium viewer
	var _flags = {				// Determine how user is moving
		looking : false,
		moveForward : false,
		moveBackward : false,
		moveUp : false,
		moveDown : false,
		moveLeft : false,
		moveRight : false,
		speedUp : false,
		zoomIn: false,
		zoomOut: false
	};
	// var _moveRate = 1;		// How fast is camera moving with key control
	
	var _moveRate = _baseMoveRate;
	
	// Private fields derived
	var _canvas = _viewer.canvas;
	var _handler = new Cesium.ScreenSpaceEventHandler(_canvas);
	var _ellipsoid = _viewer.scene.globe.ellipsoid;
	var _heading = _viewer.scene.camera.heading;
	var _pitch = _viewer.scene.camera.pitch;
	
	var _prevPosition = {
		orientation:{},
		duration: 2
	};	// Camera position and orientation before switching to human view
	
	// Public fields
	this.humanFlag = true;		// Whether it is human mode. If not, then it is bird eye mode
								// First set this to true and then toggle it in initiation construction,
	this.montageFlag = false;
	this._onToggledHandler = function () {;};
	
	/* 
	 * Private functions
	 */
	// Read flag according to user input key
	var _funcGetFlagForKeyCode = function(keyCode) {
		switch (keyCode) {
			case 'U'.charCodeAt(0):
				return 'moveForward';
			case 'J'.charCodeAt(0):
				return 'moveBackward';
			case 'Q'.charCodeAt(0):
				return 'turnLeft';
			case 'E'.charCodeAt(0):	
				return 'turnRight';
			case 'T'.charCodeAt(0):
				return 'turnUp';
			case 'G'.charCodeAt(0):
				return 'turnDown';
			case 'D'.charCodeAt(0):
				return 'moveRight';
			case 'A'.charCodeAt(0):
				return 'moveLeft';
			case 'I'.charCodeAt(0):
				return 'moveUp';
			case 'K'.charCodeAt(0):
				return 'moveDown';
			case 'W'.charCodeAt(0):
				return 'moveFront';		// Altitude constant
			case 'S'.charCodeAt(0):
				return 'moveBack';		// Altitude constant
			case 'R'.charCodeAt(0):
				return 'moveHigh';		// XY constant
			//Edited by Alice to disable CTRL+F
			case 'F'.charCodeAt(0):
				return 'moveLow';		// XY constant
				
			case 'O'.charCodeAt(0):
				//alert ('rollLeft');
				return 'rollLeft';		// XY constant
			case 'P'.charCodeAt(0):
				return 'rollRight';		// XY constant	
				
			// case 'Z'.charCodeAt(0):
			// 	return 'zoomIn';		// Eric Yuen , FOV Decrease, Focal Length increase Zoom-In, 
			// case 'X'.charCodeAt(0):
			// 	return 'zoomOut';		// Eric Yuen , FOV increase, Focal Length decrease , Zoom-out, 
	
			case 'Z'.charCodeAt(0):
				return 'turnUp';		// Eric Yuen , FOV Decrease, Focal Length increase Zoom-In, 
			case 'X'.charCodeAt(0):
				return 'turnDown';		// Eric Yuen , FOV increase, Focal Length decrease , Zoom-out, 
			case 16: 
				//shift
				//alert ('speedUp by Shift!');
				return 'speedUp';
			default:
				return undefined;
		}
	};
	
	var _funcsetMovementSky = function(camera) {
		if(isLocked)
			return;
		
		let isAnyFlagPresent = false;
		if (_flags.moveForward) {
			isAnyFlagPresent = true;
			camera.moveForward(_moveRate);
		}
		if (_flags.moveBackward) {
			isAnyFlagPresent = true;
			camera.moveBackward(_moveRate);
		}
		if (_flags.moveUp) {
			isAnyFlagPresent = true;
			camera.moveUp(_moveRate);
		}
		if (_flags.moveDown) {
			isAnyFlagPresent = true;
			camera.moveDown(_moveRate);
		}
		if (_flags.moveLeft) {
			isAnyFlagPresent = true;
			camera.moveLeft(_moveRate);
		}
		if (_flags.moveRight) {
			isAnyFlagPresent = true;
			camera.moveRight(_moveRate);
		}
		
		if (_flags.zoomIn) {
			isAnyFlagPresent = true;
			camera.frustum.fov -= ZOOM_FOV_STEP;
			if  (camera.frustum.fov < ZOOM_FOV_MIN  )
			{
				camera.frustum.fov = ZOOM_FOV_MIN;
			}
		}
		if (_flags.zoomOut) {
			isAnyFlagPresent = true;
			camera.frustum.fov += ZOOM_FOV_STEP;
			if  (camera.frustum.fov  >  ZOOM_FOV_MAX  )
			{
				camera.frustum.fov = ZOOM_FOV_MAX;
			}
		}
		if (_flags.rollLeft) {
			isAnyFlagPresent = true;
			camera.setView({
				orientation: {
					//heading: camera.heading - 1/80,
					heading: camera.heading,
					pitch: camera.pitch,
					roll: camera.roll + (_baseMoveRate* ROTATE_STEP )
				}
			});
		}
		if (_flags.rollRight) {
			isAnyFlagPresent = true;
			camera.setView({
				orientation: {
					//heading: camera.heading - 1/80,
					heading: camera.heading ,
					pitch: camera.pitch,
					roll: camera.roll - (_baseMoveRate* ROTATE_STEP )
				}
			});
		}
		if (_flags.turnLeft) {
			isAnyFlagPresent = true;
			console.log(camera.heading - (_baseMoveRate* ROTATE_STEP ))
			camera.setView({
				orientation: {
					//heading: camera.heading - 1/80,o
					heading: camera.heading - (_baseMoveRate* ROTATE_STEP ) ,
					pitch: camera.pitch,
					roll: camera.roll
				}
			});
		}
		if (_flags.turnRight) {
			isAnyFlagPresent = true;
			console.log(camera.heading + (_baseMoveRate* ROTATE_STEP ))
			camera.setView({
				orientation: {
					//heading: camera.heading + 1/80,
					heading: camera.heading + (_baseMoveRate* ROTATE_STEP ) ,
					pitch: camera.pitch,
					roll: camera.roll
				}
			});
		}
		if (_flags.turnUp) {
			isAnyFlagPresent = true;
			camera.setView({
				orientation: {
					heading: camera.heading,
					//pitch: camera.pitch + 1/80,
					pitch: camera.pitch + (_baseMoveRate* ROTATE_STEP ) ,
					roll: camera.roll
				}
			});
		}
		if (_flags.turnDown) {
			isAnyFlagPresent = true;
			var newPitch = camera.pitch - (_baseMoveRate* ROTATE_STEP );
			// Trying to fix to top view if reached -90deg, but not working and camear still trivering
			if(newPitch < -Math.PI/2)
				newPitch = -Math.PI/2;
			
			camera.setView({
				orientation: {
					heading: camera.heading,
					//pitch: camera.pitch - 1/80,
					pitch: camera.pitch - (_baseMoveRate* ROTATE_STEP ) ,
					roll: camera.roll
				}
			});
		}
		if (_flags.moveHigh) {
			isAnyFlagPresent = true;
			var carto = camera.positionCartographic;
			camera.setView({
				destination: Cesium.Cartesian3.fromDegrees(carto.longitude*180/Math.PI,carto.latitude*180/Math.PI,carto.height+_moveRate),
				orientation: {
					heading: camera.heading,
					pitch: camera.pitch,
					roll: camera.roll
				}
			});
		}
		if (_flags.moveLow) {
			isAnyFlagPresent = true;
			var carto = camera.positionCartographic;
			camera.setView({
				destination: Cesium.Cartesian3.fromDegrees(carto.longitude*180/Math.PI,carto.latitude*180/Math.PI,carto.height-_moveRate),
				orientation: {
					heading: camera.heading,
					pitch: camera.pitch,
					roll: camera.roll
				}
			});
		}
		if (_flags.moveFront) {
			isAnyFlagPresent = true;
			var heading = camera.heading;
			var carto = camera.positionCartographic;
			var lng = carto.longitude*180/Math.PI + _moveRate*Math.sin(heading)/100000;
			var lat = carto.latitude*180/Math.PI + _moveRate*Math.cos(heading)/100000;
			
			camera.setView({
				destination: Cesium.Cartesian3.fromDegrees(lng, lat, carto.height),
				orientation: {
					heading: camera.heading,
					pitch: camera.pitch,
					roll: camera.roll
				}
			});
		}
		if (_flags.moveBack) {
			isAnyFlagPresent = true;
			var heading = camera.heading;
			var carto = camera.positionCartographic;
			var lng = carto.longitude*180/Math.PI - _moveRate*Math.sin(heading)/100000;
			var lat = carto.latitude*180/Math.PI - _moveRate*Math.cos(heading)/100000;
			
			camera.setView({
				destination: Cesium.Cartesian3.fromDegrees(lng, lat, carto.height),
				orientation: {
					heading: camera.heading,
					pitch: camera.pitch,
					roll: camera.roll
				}
			});
		}
		
		if(isAnyFlagPresent) {
			_viewer.scene.requestRender();
			if(window.viewer_split) {
				window.viewer_split.scene.requestRender();
			}
		}
	};
	
	// Change FOV
	var _funcChangeFOV = function(delta)
	{
		var min = 3*Math.PI/180, max = 111*Math.PI/180;
		var newFOV = _viewer.camera.frustum.fov - delta*0.05*Math.PI/180;
		
		if(newFOV >= min && newFOV <= max)
			_viewer.camera.frustum.fov = newFOV;
	};
	
	// Change FOV with more scale and may be more precise?
	var _funcChangeFOVinMontage = function(delta)
	{
		var min = 3*Math.PI/180, max = 135*Math.PI/180;
		var newFOV = _viewer.camera.frustum.fov - delta*0.01*Math.PI/180;
		
		if(newFOV >= min && newFOV <= max)
			_viewer.camera.frustum.fov = newFOV;
	};
	
	// Proposed key up event function
	var _funcKeyUp = function(e) {
		var flagName = _funcGetFlagForKeyCode(e.keyCode);
		if (typeof flagName !== 'undefined') {
			_flags[flagName] = false;
		}
		
		if(_viewer.camera.changed._listeners[1])
			_viewer.camera.changed._listeners[1]();
	};
	
	// Proposed key down event function
	var _funcKeyDown = function(e) {
		var flagName = _funcGetFlagForKeyCode(e.keyCode);
		if (typeof flagName !== 'undefined' && !$(':focus').is('input') && !$(':focus').is('textarea')) {
			_flags[flagName] = true;
		}
	};
	
	// Proposed Cesium onTick for bird eye view
	var _funcBirdEyeTick = function() {
		var camera = _viewer.camera;

		// Change movement spered based on the distance of the camera to the surface of the ellipsoid.
		var cameraCarto = _ellipsoid.cartesianToCartographic(camera.position);
		var cameraHeight = cameraCarto.height;
		if(cameraHeight<0)
			cameraHeight=0;
			
		if(!isNaN(cameraHeight)) {
			_moveRate = _baseMoveRate; // _moveRate = 0.1*Math.sqrt(cameraHeight) + 1;
			ROTATE_STEP = 0.01/_baseMoveRate;
		}
		
		if(_flags.speedUp) {
			//_moveRate = 5 *_moveRate;
			_moveRate = SPEED_UP_RATE *_moveRate;
			ROTATE_STEP = 0.025/_baseMoveRate;
		}
		_funcsetMovementSky(camera);
	};
	
	// Proposed Cesium onTick for human view
	var _funcHumanTick = function() {
		if(isLocked)
			return;
		
		var camera = _viewer.camera;

		// Change movement spered based on the distance of the camera to the surface of the ellipsoid.
		var cameraCarto = _ellipsoid.cartesianToCartographic(camera.position);
		var terrainHeight = Cesium.defaultValue(viewer.scene.globe.getHeight(new Cesium.Cartographic(cameraCarto.longitude, cameraCarto.latitude)), 0.0);
		
		//cameraCarto.height = terrainHeight+ 1.8;
		cameraCarto.height = terrainHeight + HUMAN_HEIGHT;
		
		
		_viewer.scene.camera.position = Cesium.Cartesian3.fromDegrees(cameraCarto.longitude*180/Math.PI, cameraCarto.latitude*180/Math.PI, cameraCarto.height);
		var moveRateHuman = 1;
		
		
		if(_flags.speedUp) {
			//moveRateHuman = 3*moveRateHuman;
			
			moveRateHuman = SPEED_UP_RATE * moveRateHuman;
		}
		
		if (_flags.moveFront) {
			camera.moveForward(moveRateHuman);
		}
		if (_flags.moveBack) {
			camera.moveBackward(moveRateHuman);
		}
		if (_flags.moveLeft) {
			camera.moveLeft(moveRateHuman);
		}
		if (_flags.moveRight) {
			camera.moveRight(moveRateHuman);
		}
		if (_flags.turnLeft) {
			camera.setView({
				orientation: {
					//heading: camera.heading - 1/30,
					heading: camera.heading - (moveRateHuman * ROTATE_STEP),
					pitch: camera.pitch,
					roll: camera.roll
				}
			});
		}
		if (_flags.turnRight) {
			camera.setView({
				orientation: {
					//heading: camera.heading + 1/30,
					heading: camera.heading + (moveRateHuman * ROTATE_STEP),
					pitch: camera.pitch,
					roll: camera.roll
				}
			});
		}
		if (_flags.turnUp) {
			camera.setView({
				orientation: {
					heading: camera.heading,
					//pitch: camera.pitch + 1/80,
					pitch: camera.pitch + (moveRateHuman * ROTATE_STEP),
					roll: camera.roll
				}
			});
		}
		if (_flags.turnDown) {
			camera.setView({
				orientation: {
					heading: camera.heading,
					//pitch: camera.pitch - 1/80,
					pitch: camera.pitch - (moveRateHuman * ROTATE_STEP),
					roll: camera.roll
				}
			});
		}
	};
	
	var _funcMontageTick = function() {
		if(isLocked)
			return;
		
		var camera = _viewer.camera;

		// Change movement spered based on the distance of the camera to the surface of the ellipsoid.
		var cameraCarto = _ellipsoid.cartesianToCartographic(camera.position);		
		var cameraHeight = cameraCarto.height;
		if(cameraHeight<0)
			cameraHeight=0;
			
		if(!isNaN(cameraHeight)) {
			_moveRate = _baseMoveRate; // _moveRate = 0.1*Math.sqrt(cameraHeight) + 1;
			ROTATE_STEP = 0.01/_baseMoveRate;
		}
			
		if(_flags.speedUp) {
			//_moveRate = 5*_moveRate;
			
			_moveRate = SPEED_UP_RATE * _moveRate;
			ROTATE_STEP = 0.025/_baseMoveRate;
		}
		_funcsetMovementSky(camera);
	};
	
	MovementCtrl.prototype.onToggled = function(humanFlag) {
		this._onToggledHandler(humanFlag);
	};
	
	/*
	 * Public functions
	 */
	// Toggle between bird-eye and human view
	MovementCtrl.prototype.on = function(eventName, handler) {
		switch(eventName) {
			case 'toggled': 
				this._onToggledHandler = handler;
				return handler;
		}
	};

	MovementCtrl.prototype.toggle = function() {
		// if currently bird eye mode, to switch to human mode
		// threeDGIS.threeDView.enableClickSelect();
		
		var viewer = _viewer;
		
		if(!this.humanFlag)
		{
			var thisObj = this;
			var prevPosition = _prevPosition;
			function flyToHuman(cPos){
				thisObj.humanFlag = true;
				// var cPos = _viewer.scene.camera.position;
				
				var cPosCarto = Cesium.Cartographic.fromCartesian(cPos);
				//cPosCarto.height = 1.8 +Cesium.defaultValue(viewer.scene.globe.getHeight(new Cesium.Cartographic(cPosCarto.longitude, cPosCarto.latitude)), 0.0);
				
				cPosCarto.height = HUMAN_HEIGHT + Cesium.defaultValue(viewer.scene.globe.getHeight(new Cesium.Cartographic(cPosCarto.longitude, cPosCarto.latitude)), 0.0);
				
				_viewer.scene.camera.flyTo({
					destination: Cesium.Cartesian3.fromDegrees(cPosCarto.longitude*180/Math.PI, cPosCarto.latitude*180/Math.PI, cPosCarto.height),
					orientation: {
						heading : _viewer.scene.camera.heading, // east, default value is 0.0 (north)
						pitch : -5*Math.PI/180,    // default value (looking down)
						roll : _viewer.camera.roll                        // default value
					},
					duration: 2
				});
				
				setTimeout(function() {
					_canvas.setAttribute('tabindex', '0'); // needed to put focus on the canvas
					_canvas.onclick = function() {
						_canvas.focus();
					};
					
					_heading = _viewer.scene.camera.heading;
					_pitch = _viewer.scene.camera.pitch;
					
					_viewer.scene.screenSpaceCameraController.enableRotate = false;
					_viewer.scene.screenSpaceCameraController.enableTranslate = false;
					_viewer.scene.screenSpaceCameraController.enableZoom = false;
					_viewer.scene.screenSpaceCameraController.enableTilt = false;
					_viewer.scene.screenSpaceCameraController.enableLook = false;
					_handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
					
					var startMousePosition;
					var mousePosition;

					_handler.setInputAction(function(movement) {
						_flags.looking = true;
						mousePosition = startMousePosition = Cesium.Cartesian3.clone(movement.position);
						
						Window.mouseStartX = mousePosition.x;
						Window.mouseStartY = mousePosition.y;
						
						_heading = _viewer.scene.camera.heading;
						_pitch = _viewer.scene.camera.pitch;
					}, Cesium.ScreenSpaceEventType.LEFT_DOWN);

					_handler.setInputAction(function(movement) {
						mousePosition = movement.endPosition;
						if(_flags.looking)
						{
							var width = _canvas.clientWidth;
							var height = _canvas.clientHeight;

							var x = -(mousePosition.x - startMousePosition.x)*0.08*viewer.camera.frustum.fov + _heading*180/Math.PI;
							var y = (mousePosition.y - startMousePosition.y)*0.08*viewer.camera.frustum.fov + _pitch*180/Math.PI;
							var cp = _viewer.camera.position;
							
							y = Math.max( - 89, Math.min( 89, y ) );
							
							viewer.camera.setView({
								destination: cp,
								orientation: {
									heading : Cesium.Math.toRadians(x), // east, default value is 0.0 (north)
									pitch : Cesium.Math.toRadians(y),    // default value (looking down)
									roll : viewer.camera.roll                             // default value
								}
							});
						}
					}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
					
					_handler.setInputAction(function(movement) {
						var min = 5*Math.PI/180, max = 111*Math.PI/180;	
						_funcChangeFOV(movement);
					}, Cesium.ScreenSpaceEventType.WHEEL);

					_handler.setInputAction(function(position) {
						_flags.looking = false;
						
						_heading = _viewer.scene.camera.heading;
						_pitch = _viewer.scene.camera.pitch;
					}, Cesium.ScreenSpaceEventType.LEFT_UP);
					
					_viewer.clock.onTick.removeEventListener(_funcBirdEyeTick);
					_viewer.clock.onTick.addEventListener(_funcHumanTick);
					
					thisObj.onToggled(true);
				},2000);
				
				// threeDGIS.writeInfo('Switched to walk mode.');
			}
			
			function clickPickPosition(movement) {
				var cPos = _viewer.camera.position;
				_prevPosition.destination = new Cesium.Cartesian3(cPos.x, cPos.y, cPos.z);
				_prevPosition.orientation.heading = _viewer.scene.camera.heading;
				_prevPosition.orientation.pitch = _viewer.scene.camera.pitch;
				_prevPosition.orientation.roll = 0;
				
				var cartesian = viewer.scene.pickPosition(movement.position);
				_handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
				flyToHuman(cartesian);

				$('.cesium-widget').find('canvas').css('cursor','');
			}
			
			// Click on a point to start walk mode
			$('.cesium-widget').find('canvas').css('cursor','crosshair');
			_handler.setInputAction(clickPickPosition, Cesium.ScreenSpaceEventType.LEFT_CLICK);
		}
		else	// if currently human mode, to switch to bird eye mode
		{
			this.humanFlag = false;
				
			_viewer.scene.screenSpaceCameraController.enableRotate = true;
			_viewer.scene.screenSpaceCameraController.enableTranslate = true;
			_viewer.scene.screenSpaceCameraController.enableZoom = true;
			_viewer.scene.screenSpaceCameraController.enableTilt = true;
			_viewer.scene.screenSpaceCameraController.enableLook = true;
			
			_handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
			_handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
			_handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
			_handler.removeInputAction(Cesium.ScreenSpaceEventType.WHEEL);
			
			_viewer.clock.onTick.removeEventListener(_funcHumanTick);
			_viewer.clock.onTick.addEventListener(_funcBirdEyeTick);
			
			this.onToggled(false);
			
			if(_prevPosition.destination)
				_viewer.scene.camera.flyTo(_prevPosition);
		}
	};
	
	MovementCtrl.prototype.toggleMontage = function() {
		if(!this.montageFlag)
		{
			this.montageFlag = true;
			_heading = _viewer.scene.camera.heading;
			_pitch = _viewer.scene.camera.pitch;
						
			var cPos = _viewer.scene.camera.position;
			_prevPosition.destination = new Cesium.Cartesian3(cPos.x, cPos.y, cPos.z);
			_prevPosition.orientation.heading = _viewer.scene.camera.heading;
			_prevPosition.orientation.pitch = _viewer.scene.camera.pitch;
			_prevPosition.orientation.roll = 0;
			
			var cPosCarto = Cesium.Cartographic.fromCartesian(cPos);
			
			//setTimeout(function() {
				_canvas.setAttribute('tabindex', '0'); // needed to put focus on the canvas
				_canvas.onclick = function() {
					_canvas.focus();
				};
				
				_viewer.scene.screenSpaceCameraController.enableRotate = false;
				_viewer.scene.screenSpaceCameraController.enableTranslate = false;
				_viewer.scene.screenSpaceCameraController.enableZoom = false;
				_viewer.scene.screenSpaceCameraController.enableTilt = false;
				_viewer.scene.screenSpaceCameraController.enableLook = false;
				_handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
				
				var startMousePosition;
				var mousePosition;

				_handler.setInputAction(function(movement) {
					_heading = _viewer.scene.camera.heading;
					_pitch = _viewer.scene.camera.pitch;
					
					_flags.looking = true;
					mousePosition = startMousePosition = Cesium.Cartesian3.clone(movement.position);
					
					Window.mouseStartX = mousePosition.x;
					Window.mouseStartY = mousePosition.y;
					
					// _heading = _viewer.scene.camera.heading;
					// _pitch = _viewer.scene.camera.pitch;
				}, Cesium.ScreenSpaceEventType.LEFT_DOWN);

				_handler.setInputAction(function(movement) {
					mousePosition = movement.endPosition;
					if(_flags.looking)
					{
						var width = _canvas.clientWidth;
						var height = _canvas.clientHeight;

						var x = -(mousePosition.x - startMousePosition.x)*0.08*viewer.camera.frustum.fov + _heading*180/Math.PI;
						var y = (mousePosition.y - startMousePosition.y)*0.08*viewer.camera.frustum.fov + _pitch*180/Math.PI;
						var cp = _viewer.camera.position;
						
						y = Math.max( - 89, Math.min( 89, y ) );
						
						viewer.camera.setView({
							destination: cp,
							orientation: {
								heading : Cesium.Math.toRadians(x), // east, default value is 0.0 (north)
								pitch : Cesium.Math.toRadians(y),    // default value (looking down)
								roll : viewer.camera.roll                             // default value
							}
						});
					}
				}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
				
				_handler.setInputAction(function(movement) {
					var min = 5*Math.PI/180, max = 135*Math.PI/180;	
					_funcChangeFOVinMontage(movement);
				}, Cesium.ScreenSpaceEventType.WHEEL);

				_handler.setInputAction(function(position) {
					_flags.looking = false;
					
					_heading = _viewer.scene.camera.heading;
					_pitch = _viewer.scene.camera.pitch;
				}, Cesium.ScreenSpaceEventType.LEFT_UP);
				
				_viewer.clock.onTick.removeEventListener(_funcBirdEyeTick);
				_viewer.clock.onTick.addEventListener(_funcMontageTick);
			// },2000);
		}
		else	// if currently human mode, to switch to bird eye mode
		{
			this.montageFlag = false;
				
			_viewer.scene.screenSpaceCameraController.enableRotate = true;
			_viewer.scene.screenSpaceCameraController.enableTranslate = true;
			_viewer.scene.screenSpaceCameraController.enableZoom = true;
			_viewer.scene.screenSpaceCameraController.enableTilt = true;
			_viewer.scene.screenSpaceCameraController.enableLook = true;
			
			_handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
			_handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
			_handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
			_handler.removeInputAction(Cesium.ScreenSpaceEventType.WHEEL);
			
			_viewer.clock.onTick.removeEventListener(_funcMontageTick);
			_viewer.clock.onTick.addEventListener(_funcBirdEyeTick);
		}
	}

	MovementCtrl.prototype.cancelToggle = function() {
		_handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
	};
	
	MovementCtrl.prototype.lockCamera = function() {
		isLocked = true;
	};
	
	MovementCtrl.prototype.unlockCamera = function() {
		isLocked = false;
	};
	
	MovementCtrl.prototype.deRegister = function() {
		document.removeEventListener("keydown", _funcKeyDown);
		document.removeEventListener("keyup", _funcKeyUp);
	}
	
	// Initialization after construction, try not using jQuery
	/*
	$(document).on('keydown',_funcKeyDown);
	$(document).on('keyup',_funcKeyUp);
	 */
	document.addEventListener("keydown", _funcKeyDown);
	document.addEventListener("keyup", _funcKeyUp);
	
	this.toggle();
}

export default MovementCtrl;
