var fragmentShaderHeader =
				"precision highp float;       // Use 24-bit floating point numbers for everything\n" +
				"varying vec2 vTextureCoords; // Pixel coordinates of this fragment, to fetch texture color\n" +
				"varying vec2 vCRSCoords;     // CRS coordinates of this fragment\n" +
				"varying vec2 vLatLngCoords;  // Lat-Lng coordinates of this fragment (linearly interpolated)";
// var shaderValue = fragmentCodeMirror.getValue();				
function addGlLayer(){
	tileGlLayer = L.tileLayer.gl({
				fragmentShader: "void main(void) {"+
						"vec4 texelColour = texture2D(uTexture0, vec2(vTextureCoords.s, vTextureCoords.t));"+
						"gl_FragColor = vec4(texelColour.r , texelColour.g , texelColour.b  , ((texelColour.r * 256.0) + texelColour.g + (texelColour.b / 256.0) - 32768.0 ,1,1,1));"+
						// "gl_FragColor = vec4(texelColour.r , texelColour.g , texelColour.b , 1);"+
					"}",
				tileUrls: ["http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png"]
			});

	var glError = tileGlLayer.getGlError();
	if (glError) {
		alert(glError);
	} else {
		tileGlLayer.addTo(map);
		addLayerToToc("elevation_layer" , tileGlLayer);
	}
}