void main(void) {
	// Fetch the colour from the corresponding pixel in the texture (texel)
	vec4 texelColour = texture2D(uTexture0, vec2(vTextureCoords.s, vTextureCoords.t));

	// This would output the image "as is"
	// gl_FragColor = texelColour;

	// Let's mix the colours a little bit
	gl_FragColor = vec4(1.0 - texelColour.rg, texelColour.b, 1.0);
}


