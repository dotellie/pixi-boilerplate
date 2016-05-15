import * as PIXI from "pixi.js";

document.addEventListener("DOMContentLoaded", () => {
	// Create a game class and start its animation
	let game = new Game();
	game.animate();

	// Expose the game instance to global scope (optional)
	window.game = game;
});

class Game {
	constructor() {
		// Change this to `this.renderer = new PIXI.WebGLRenderer(width, height)`
		// if you want to force WebGL
		this.renderer = PIXI.autoDetectRenderer(
			window.innerWidth,
			window.innerHeight
		);
		// Set an ID for some simple css styling
		this.renderer.view.id = "pixi";
		document.body.appendChild(this.renderer.view);

		// Pixelated scaling (optional)
		PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

		// Base container
		this.container = new PIXI.Container();

		// Standard 16x16 image provided with this repo
		let texture = PIXI.Texture.fromImage("/images/pixi.png");
		this.pixi = new PIXI.Sprite(texture);

		// Set anchor to the middle
		this.pixi.anchor.x = this.pixi.anchor.y = 0.5;

		// Set position to middle of the screen
		this.pixi.position.x = window.innerWidth / 2;
		this.pixi.position.y = window.innerHeight / 2;

		// Scale the sprite a little
		this.pixi.scale.x = this.pixi.scale.y = 5;

		// Add the sprite to the scene
		this.container.addChild(this.pixi);
	}

	animate() {
		// Rotate it a little each frame
		this.pixi.rotation += 0.1;

		// Render the scene
		this.renderer.render(this.container);

		// Request to render at next browser redraw
		requestAnimationFrame(this.animate.bind(this));
	}
}
