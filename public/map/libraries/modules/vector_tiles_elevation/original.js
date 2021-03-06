

		// Set up the code editors
		var tileServersMirror = CodeMirror.fromTextArea(document.getElementById('tileServers'), {
			lineNumbers: true,
			lineWrapping: true,
			firstLineNumber: 0
		});

		tileServersMirror.setSize('100%', '8rem');

		var fragmentHeaderMirror = CodeMirror.fromTextArea(document.getElementById('fragmentShaderHeader'), {
// 			mode: "glsl",
			mode: "javascript",
			lineNumbers: true,
			lineWrapping: true,
			firstLineNumber: 1,
			readOnly: true
		});

		fragmentHeaderMirror.getWrapperElement().className += ' readonly-code-mirror';
		fragmentHeaderMirror.setSize('100%', '4rem');

		var fragmentCodeMirror = CodeMirror.fromTextArea(document.getElementById('fragmentShaderCode'), {
// 			mode: "glsl",
			mode: "javascript",
			lineNumbers: true,
			lineWrapping: true,
			firstLineNumber: 5
		});

		// Preset demos
		var mapboxAccessToken = 'pk.eyJ1IjoibWF0dCIsImEiOiJTUHZkajU0In0.oB-OGTMFtpkga8vC48HjIg';
		var sentinelhubKey = '0f03c55a-804e-33bd-8589-da814f6575ae';
		
		var demos = {

			"Empty": {
				tiles: [],
				shader: ""
			},

			"Basic colour channel inversion": {
				tiles: ['http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png'],
				shader:
					"void main(void) {                                                                    \n" +
					"	vec4 texelColour = texture2D(uTexture0, vec2(vTextureCoords.s, vTextureCoords.t));\n" +
					"                                                                                     \n" +
					"	// This would output the image \"as is\"                                          \n" +
					"	// gl_FragColor = texelColour;                                                    \n" +
					"                                                                                     \n" +
					"	// Let's mix the colours a little bit                                             \n" +
					"	gl_FragColor = vec4(1.0 - texelColour.rg, texelColour.b, 1.0);                    \n" +
					"}                                                                                    \n"
			},

			"Conditional colouring": {
				tiles: ['http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png'],
				shader:
					"void main(void) {                                                                            \n" +
					"	vec4 texelColour = texture2D(uTexture0, vec2(vTextureCoords.s, vTextureCoords.t));        \n" +
					"	vec4 stop;                                                                                \n" +
					"                                                                                             \n" +
					"	// Color stops. The alpha value represents the latitude minimum for that RGB colour stop. \n" +
					"	// Latitudes are expressed in EPSG:3875 units, not in degrees of latitude.                \n" +
					"	vec4 stops[5];                                                                            \n" +
					"	stops[0] = vec4(0.444, 0.691, 1.0,   -20037508);	// Blue-ish north of -90              \n" +
					"	stops[1] = vec4(0.333, 0.666, 0.333, -10015051);	// Green-ish north of -66.5           \n" +
					"	stops[2] = vec4(0.9, 0.75, 0.35,      -2571663);	// Orange-ish north of -22.5          \n" +
					"	stops[3] = vec4(0.333, 0.666, 0.333,   2571663);	// Green-ish north of 22.5            \n" +
					"	stops[4] = vec4(0.444, 0.691, 1.0,    10015051);	// Blue-ish north of 66.5             \n" +
					"                                                                                             \n" +
					"	// Find which colour stop we want to use                                                  \n" +
					"	for (int i=0; i < 5; i++) {                                                               \n" +
					"		if (vCRSCoords.y > stops[i].a) {                                                      \n" +
					"			stop = stops[i];                                                                  \n" +
					"		}                                                                                     \n" +
					"	}                                                                                         \n" +
					"                                                                                             \n" +
					"	// Multiply the black in the texel by the stop colour                                     \n" +
					"	gl_FragColor = vec4(                                                                      \n" +
					"		vec3(1.0) - (texelColour.rgb) * (vec3(1.0) - stop.rgb)                                \n" +
					"	, 1.0);                                                                                   \n" +
					"}                                                                                            \n"
			},

			"Hue rotation": {
				tiles: ['http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png'],
				shader:
					"vec3 rgb2hsv(vec3 c) {                                                                  \n" +
					"    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);                                    \n" +
					"    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));                   \n" +
					"    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));                   \n" +
					"                                                                                        \n" +
					"    float d = q.x - min(q.w, q.y);                                                      \n" +
					"    float e = 1.0e-10;                                                                  \n" +
					"    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);            \n" +
					"}                                                                                       \n" +
					"                                                                                        \n" +
					"vec3 hsv2rgb(vec3 c) {                                                                  \n" +
					"    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);                                      \n" +
					"    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);                                   \n" +
					"    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);                           \n" +
					"}                                                                                       \n" +
					"                                                                                        \n" +
					"void main(void) {                                                                       \n" +
					"    vec4 texelColour = texture2D(uTexture0, vec2(vTextureCoords.s, vTextureCoords.t));  \n" +
					"    vec3 hsv = rgb2hsv(texelColour.rgb);                                                \n" +
					"                                                                                        \n" +
					"    hsv.x += 0.3;	// Change this number to vary the amount of hue rotation             \n" +
					"    // hsv.y *= 0.3;   // Try changing the colour saturation!                           \n" +
					"                                                                                        \n" +
					"    gl_FragColor = vec4(hsv2rgb(hsv), texelColour.a);                                   \n" +
					"}                                                                                       \n"
			},

			"Flood & height": {
				tiles: [
					'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
					'http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png',
					'https://{s}.tiles.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=' + mapboxAccessToken
					],
				shader:
					"void main(void) {                                                                          \n" +
					"	// Fetch color from texture 2, which is the terrain-rgb tile                            \n" +
					"	highp vec4 texelColour = texture2D(uTexture2, vec2(vTextureCoords.s, vTextureCoords.t));\n" +
					"                                                                                           \n" +
					"	// Height is represented in TENTHS of a meter                                           \n" +
					"	highp float height = (                                                                  \n" +
					"		texelColour.r * 255.0 * 256.0 * 256.0 +                                             \n" +
					"		texelColour.g * 255.0 * 256.0 +                                                     \n" +
					"		texelColour.b * 255.0 )                                                             \n" +
					"	-100000.0;                                                                              \n" +
					"                                                                                           \n" +
					"	vec4 floodColour;                                                                       \n" +
					"	if (height > 100.0) {                                                                   \n" +
					"		// High (>10m) over ground, transparent                                             \n" +
					"		floodColour = vec4(0.5, 0.5, 0.5, 0.0);                                             \n" +
					"	} else if (height > 50.0) {                                                             \n" +
					"		// Over ground but somewhat close to sea level, yellow                              \n" +
					"		floodColour = vec4(0.9, 0.9, 0.5, 0.4);                                             \n" +
					"	} else if (height > 0.0) {                                                              \n" +
					"		// Over ground but very close to sea level, red                                     \n" +
					"		floodColour = vec4(0.9, 0.5, 0.5, 0.4);                                             \n" +
					"	} else {                                                                                \n" +
					"		// Water, some semiopaque blue                                                      \n" +
					"		floodColour = vec4(0.05, 0.1, 0.9, 0.4);                                            \n" +
					"	}                                                                                       \n" +
					"                                                                                           \n" +
					"	// Now fetch color from texture 0, which is the basemap                                 \n" +
					"	texelColour = texture2D(uTexture0, vec2(vTextureCoords.s, vTextureCoords.t));           \n" +
					"                                                                                           \n" +
					"	// And compose them                                                                     \n" +
					"	floodColour = vec4(                                                                     \n" +
					"		texelColour.rgb * (1.0 - floodColour.a) +                                           \n" +
					"		floodColour.rgb * floodColour.a,                                                    \n" +
					"		1);                                                                                 \n" +
					"	                                                                                        \n" +
					"	// Last, fetch color from texture 1, which is the labels                                \n" +
					"	texelColour = texture2D(uTexture1, vec2(vTextureCoords.s, vTextureCoords.t));           \n" +
					"                                                                                           \n" +
					"	// And compose the labels on top of everything                                          \n" +
					"	gl_FragColor = vec4(                                                                    \n" +
					"		floodColour.rgb * (1.0 - texelColour.a) +                                           \n" +
					"		texelColour.rgb * texelColour.a,                                                    \n" +
					"		1);                                                                                 \n" +
					"}                                                                                          \n"
			},

			"Hypsometric tint": {
				tiles: ['https://{s}.tiles.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=' + mapboxAccessToken],
				shader:
					"void main(void) {                                                                          \n" +
					"	highp vec4 texelColour = texture2D(uTexture0, vec2(vTextureCoords.s, vTextureCoords.t));\n" +
					"                                                                                           \n" +
					"	// Color ramp. The alpha value represents the elevation for that RGB colour stop.       \n" +
					"	vec4 colours[5];                                                                        \n" +
					"	colours[0] = vec4(.1, .1, .5, 0.);                                                      \n" +
					"	colours[1] = vec4(.4, .55, .3, 1.);                                                     \n" +
					"	colours[2] = vec4(.9, .9, .6, 5000.);                                                   \n" +
					"	colours[3] = vec4(.6, .4, .3, 20000.);                                                  \n" +
					"	colours[4] = vec4(1., 1., 1., 40000.);                                                  \n" +
					"                                                                                           \n" +
					"	// Height is represented in TENTHS of a meter                                           \n" +
					"	highp float height = (                                                                  \n" +
					"		texelColour.r * 255.0 * 256.0 * 256.0 +                                             \n" +
					"		texelColour.g * 255.0 * 256.0 +                                                     \n" +
					"		texelColour.b * 255.0 )                                                             \n" +
					"	-100000.0;                                                                              \n" +
					"                                                                                           \n" +
					"	gl_FragColor.rgb = colours[0].rgb;                                                      \n" +
					"                                                                                           \n" +
					"	for (int i=0; i < 4; i++) {                                                             \n" +
					"		// Do a smoothstep of the heights between steps. If the result is > 0               \n" +
					"		// (meaning \"the height is higher than the lower bound of this step\"),            \n" +
					"		// then replace the colour with a linear blend of the step.                         \n" +
					"		// If the result is 1, this means that the real colour will be applied              \n" +
					"		// in a later loop.                                                                 \n" +
					"                                                                                           \n" +
					"		gl_FragColor.rgb = mix(                                                             \n" +
					"			gl_FragColor.rgb,                                                               \n" +
					"			colours[i+1].rgb,                                                               \n" +
					"			smoothstep( colours[i].a, colours[i+1].a, height )                              \n" +
					"		);                                                                                  \n" +
					"	}                                                                                       \n" +
					"                                                                                           \n" +
					"	gl_FragColor.a = 1.;                                                                    \n" +
					"}                                                                                          \n"
			},

			"Edge detection": {
				tiles: ['https://{s}.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken],
				shader:
					"const float distanceToNeighbourPixel = 1.0 / 256.0;                                      \n" +
					"const mat3 kernel = mat3(-1, -1, -1,    -1,  8, -1,     -1, -1, -1);                     \n" +
					"                                                                                         \n" +
					"// Try some other kernels by commenting/uncommenting lines:                              \n" +
					"// Emboss                                                                                \n" +
					"//const mat3 kernel = mat3(-2, -1,  0,       -1,  1,  1,    0,  1,  2);                  \n" +
					"                                                                                         \n" +
					"// Gaussian blur                                                                         \n" +
					"//const mat3 kernel = mat3( 0.045, 0.122, 0.045, 0.122, 0.332, 0.122, 0.045, 0.122, 0.045);  \n" +
					"                                                                                         \n" +
					"                                                                                         \n" +
					"void main(void) {                                                                        \n" +
					"	mat3 I;                                                                               \n" +
					"	float cnv[9];                                                                         \n" +
					"	vec4 sample;                                                                          \n" +
					"    vec3 acc = vec3(0,0,0);                                                              \n" +
					"	int i, j, c, p;                                                                       \n" +
					"                                                                                         \n" +
					"    // For each pixel in a 3x3 envelope around our core pixel                            \n" +
					"    for (int x=0; x<3; x++) {                                                            \n" +
					"      for (int y=0; y<3; y++) {                                                          \n" +
					"        sample = texture2D(uTexture0, vTextureCoords.st + vec2(x,y) * distanceToNeighbourPixel );  \n" +
					"                                                                                         \n" +
					"		acc += sample.rgb * kernel[x][y];                                                 \n" +
					"      }                                                                                  \n" +
					"    }                                                                                    \n" +
					"                                                                                         \n" +
					"	gl_FragColor = vec4(abs(acc), sample.a);                                              \n" +
					"                                                                                         \n" +
					"                                                                                         \n" +
					"    //gl_FragColor = vec4( (gl_FragColor.rgb * 0.5) + sample.rgb * 0.5, sample.a);       \n" +
					"}"
			},

			"Sentinel: extract infrared": {
                bbox: L.latLngBounds([[40.3,-3.87],[40.54, -3.54]]),
				tiles: ['http://services.sentinel-hub.com/v1/wmts/' + sentinelhubKey + '?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&Layer=COLOR_INFRARED&TileMatrixSet=PopularWebMercator256&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image/jpg&showLogo=false'],
				shader:
                    "// Processed images from the ESA Sentinel satellites contain several sensor \n" +
                    "// bands. This example isolates the infrared sensor data from a false colour \n" +
                    "// \n" +
                    "// Images come from a sentinel-hub.com demo account. \n" +
                    "\n" +
					"void main(void) {                                                                        \n" +
					"	vec4 texelColour = texture2D(uTexture0, vec2(vTextureCoords.s, vTextureCoords.t));    \n" +
					"                                                                                         \n" +
					"	float infrared = texelColour.r;     // SENTINEL band 8                                \n" +
					"	float visibleRed = texelColour.g;   // SENTINEL band 4                                \n" +
					"	float visibleGreen = texelColour.b; // SENTINEL band 3                                \n" +
					"                                                                                         \n" +
					"	gl_FragColor = vec4(infrared, infrared, infrared, 1.0);                               \n" +
					"                                                                                         \n" +
					"}"
			},

			"Sentinel: on-the-fly NDWI": {
                bbox: L.latLngBounds([[40.3,-3.87],[40.54, -3.54]]),
				tiles: ['http://services.sentinel-hub.com/v1/wmts/' + sentinelhubKey + '?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&Layer=COLOR_INFRARED&TileMatrixSet=PopularWebMercator256&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image/jpg&showLogo=false'],
				shader:
                    "// Processed images from the ESA Sentinel satellites contain several sensor             \n" +
					"// bands. This example calculates NDWI (Normalized Differential Water Index)            \n" +
					"// from a false-color image with a near-infrared channel.                               \n" +
					"//                                                                                      \n" +
					"// Images come from a sentinel-hub.com demo account.                                    \n" +
					"                                                                                        \n" +
					"void main(void) {                                                                       \n" +
					"	vec4 texelColour = texture2D(uTexture0, vec2(vTextureCoords.s, vTextureCoords.t));   \n" +
					"                                                                                        \n" +
					"	float infrared = texelColour.r;     // SENTINEL band 8                               \n" +
					"	float visibleRed = texelColour.g;   // SENTINEL band 4                               \n" +
					"	float visibleGreen = texelColour.b; // SENTINEL band 3                               \n" +
					"                                                                                        \n" +
					"	// Calcualte NDWI here                                                               \n" +
					"	float ndwi = (visibleGreen - infrared) / (visibleGreen + infrared);                  \n" +
					"                                                                                        \n" +
					"	if (ndwi >= 0.95) {                                                                  \n" +
					"		// If the NDWI is > 0.95, assume the pixel is water.                             \n" +
					"		gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);                                         \n" +
					"	} else {                                                                            \n" +
					"		// If the pixel is not water, diaplay a shade of green                           \n" +
					"		// Greener = more vegetation cover                                              \n" +
					"		gl_FragColor = vec4(0., 0.5-ndwi*2., 0.0, 1.0);                                  \n" +
					"    }                                                                                   \n" +
					"}"
			},

			"Sentinel: half-true half-false color": {
                bbox: L.latLngBounds([[40.3,-3.87],[40.54, -3.54]]),
				tiles: ['http://services.sentinel-hub.com/v1/wmts/' + sentinelhubKey + '?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&Layer=COLOR_INFRARED&TileMatrixSet=PopularWebMercator256&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image/jpg&showLogo=false',
				'http://services.sentinel-hub.com/v1/wmts/' + sentinelhubKey + '?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&Layer=TRUE_COLOR&TileMatrixSet=PopularWebMercator256&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image/jpg&showLogo=false'
				],
				shader:
                    "// Processed images from the SENTINEL satellites contain several sensor                 \n" +
					"// bands. This example takes a true color and an infrared false color image             \n" +
					"// and shows an image in-between those two.                                             \n" +
					"//                                                                                      \n" +
					"// Experiment changing the value of percentTrueColor!                                   \n" +
					"//                                                                                      \n" +
					"// Images come from a sentinel-hub.com demo account.                                    \n" +
					"                                                                                        \n" +
					"void main(void) {                                                                       \n" +
					"	vec4 texelColourA = texture2D(uTexture0, vec2(vTextureCoords.s, vTextureCoords.t));  \n" +
					"	vec4 texelColourB = texture2D(uTexture1, vec2(vTextureCoords.s, vTextureCoords.t));  \n" +
					"                                                                                        \n" +
					"	float infrared     = texelColourA.r; // SENTINEL band 8                              \n" +
					"	float visibleRed   = texelColourB.r; // SENTINEL band 4                              \n" +
					"	float visibleGreen = texelColourB.g; // SENTINEL band 3                              \n" +
					"	float visibleBlue  = texelColourB.b; // SENTINEL band 2                              \n" +
					"                                                                                        \n" +
					"	vec3 trueColor = vec3(visibleRed, visibleGreen, visibleBlue);                        \n" +
					"    vec3 falseColor = vec3(infrared, visibleRed, visibleGreen);                         \n" +
					"                                                                                        \n" +
					"	float percentTrueColor = 0.5;                                                        \n" +
					"                                                                                        \n" +
					"	vec3 color = trueColor * percentTrueColor + falseColor * (1.-percentTrueColor);      \n" +
					"                                                                                        \n" +
					"	gl_FragColor = vec4(color, 1.0);                                                     \n" +
					"}"
			}
		};

		// Fill up the demo selector

		var selector = document.getElementById('demo-selector');

		for (var i in demos) {
			var option = document.createElement('option');
			option.innerHTML = option.value = i;

			if (i === "Basic colour channel inversion") {
				option.selected = true;
			}

			selector.appendChild(option);
		}

		selector.addEventListener('change', function(ev){
			tileServersMirror.setValue(  demos[ selector.value ].tiles.join('\n') );

			var code = demos[ selector.value ].shader;
			var lines = code.split('\n');
			lines = lines.map(function(str) { return str.trimRight(); });
			fragmentCodeMirror.setValue( lines.join('\n') );
			
			var bbox = demos[ selector.value ].bbox;
			if (bbox) {
// 				map.flyToBounds(bbox);
				map.fitBounds(bbox);
			} else {
// 				map.flyToBounds(L.latLngBounds( [[-90, -180], [90, 180]] ));
				map.fitBounds(L.latLngBounds( [[-90, -180], [90, 180]] ));
			}
		});


		var map = L.map('map').fitWorld();
		var tileGlLayer;

		// Function that will (re-)trigger the TileLayer.GL creation whenever the shader or the tile list is modified
		function redo() {
			document.getElementById('error-modal').style.display = 'none';

			var tileUrls = tileServersMirror.getValue().split('\n').filter(function(i){ return i.trim().length; });
			var tileUrlsLength = tileUrls.length;

			// Copy-pasted from _loadGLProgram, plus comments
			var fragmentShaderHeader =
				"precision highp float;       // Use 24-bit floating point numbers for everything\n" +
				"varying vec2 vTextureCoords; // Pixel coordinates of this fragment, to fetch texture color\n" +
				"varying vec2 vCRSCoords;     // CRS coordinates of this fragment\n" +
				"varying vec2 vLatLngCoords;  // Lat-Lng coordinates of this fragment (linearly interpolated)";

			var length = 1;

			for (var i=0; i<tileUrlsLength && i<8; i++) {
				fragmentShaderHeader += "\nuniform sampler2D uTexture" + i + ";";
			}

			fragmentHeaderMirror.setValue( fragmentShaderHeader );
			fragmentHeaderMirror.setSize('100%', (4 + tileUrlsLength) + 'rem');
			fragmentCodeMirror.setOption('firstLineNumber', 5 + tileUrlsLength);

			if (tileGlLayer) {
				tileGlLayer.remove();
			}

			tileGlLayer = L.tileLayer.gl({
				fragmentShader: fragmentCodeMirror.getValue(),
				tileUrls: tileUrls
			});

			var glError = tileGlLayer.getGlError();
			if (glError) {
				document.getElementById('error-modal').innerHTML = glError;
				document.getElementById('error-modal').style.display = 'block';
			} else {
				tileGlLayer.addTo(map);
			}

			onResize();
		}

		redo();
		fragmentCodeMirror.on('change', redo);
		tileServersMirror.on('change', redo);


		// Whenever the browser window resizes (and the content reflows),
		// or when the tile servers list changes (and the static fragment code
		// potentially changes length), calculate the size of the fragment code
		// editor to use up all available space
		function onResize() {
			var top = fragmentCodeMirror.getWrapperElement().offsetTop;
			var bottom = window.innerHeight;
			fragmentCodeMirror.setSize('100%', bottom - top);
		}

		window.addEventListener('resize', onResize);

