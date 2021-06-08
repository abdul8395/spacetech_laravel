void main(void) {
	highp vec4 texelColour = texture2D(uTexture2, vec2(vTextureCoords.s, vTextureCoords.t));

	highp float height = (
		texelColour.r * 255.0 * 256.0 * 256.0 +
		texelColour.g * 255.0 * 256.0 +
		texelColour.b * 255.0 )
	-100000.0;

	vec4 floodColour;
	if (height > 100.0) {
		floodColour = vec4(0.5, 0.5, 0.5, 0.0);
	} else if (height > 50.0) {
		floodColour = vec4(0.9, 0.9, 0.5, 0.4);
	} else if (height > 0.0) {
		floodColour = vec4(0.9, 0.5, 0.5, 0.4);
	} else {
		floodColour = vec4(0.05, 0.1, 0.9, 0.4);
	}
	texelColour = texture2D(uTexture0, vec2(vTextureCoords.s, vTextureCoords.t));
	floodColour = vec4(
		texelColour.rgb * (1.0 - floodColour.a) +
		floodColour.rgb * floodColour.a,
		1);

	texelColour = texture2D(uTexture1, vec2(vTextureCoords.s, vTextureCoords.t));
	gl_FragColor = vec4(
		floodColour.rgb * (1.0 - texelColour.a) +
		texelColour.rgb * texelColour.a,
		1);
}
