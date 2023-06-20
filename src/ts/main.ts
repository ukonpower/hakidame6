import * as GLP from 'glpower';
import { canvas } from './Globals';
import { Scene } from "./Scene";
import config from '../../config.json';
import { constructor } from 'assert';

class App {

	private scene: Scene;
	private canvas: HTMLCanvasElement;
	private canvasWrap: HTMLElement;

	private binaryStringToArrayBuffer( binaryString: string ) {

		const bytes = new Uint8Array( binaryString.length );

		for ( let i = 0; i < binaryString.length; i ++ ) {

			const code = binaryString.charCodeAt( i );
			bytes[ i ] = code;

		}

		return bytes.buffer;

	}

	private arrayBufferToBinaryString( arrayBuffer: ArrayBuffer ) {

		let binaryString = "";
		const bytes = new Uint8Array( arrayBuffer );
		const len = bytes.byteLength;

		for ( let i = 0; i < len; i ++ ) {

			binaryString += String.fromCharCode( bytes[ i ] );

		}

		return binaryString;

	}


	constructor() {

		const srcArray = new Float32Array( [ 1.23, 4.56, 7.89 ] );
		const binaryString = this.arrayBufferToBinaryString( srcArray.buffer );
		const base64Data = btoa( binaryString );
		const base64 = "zcz2QgCAakPNzKxDmlnkQw==";
		const binaryStringOut = atob( base64 );
		const arrayBuffer = this.binaryStringToArrayBuffer( binaryStringOut );


		console.log( srcArray );
		console.log( binaryString );
		console.log( base64Data );

		console.log( new Float32Array( arrayBuffer ) );


		// return;

		const elm = document.createElement( "div" );
		document.body.appendChild( elm );
		elm.innerHTML = `
			<div class="cw"></div>
			<h1>HAKIDAME</h1>
			<div class="text">
				NO.${config.no}<br/>
				TITLE:${config.title || 'None'}<br/>
				DATE:${config.date}<br/>
				<a href="../">../</a>
			</div>
		`;
		elm.innerHTML = `
			<div class="cw"></div>
		`;

		document.title = `${config.no} | HAKIDAME`;

		this.canvasWrap = document.querySelector( '.cw' )!;

		this.canvas = canvas;
		this.canvasWrap.appendChild( this.canvas );

		// scene

		this.scene = new Scene();

		// event

		window.addEventListener( 'resize', this.resize.bind( this ) );

		this.resize();

		// animate

		this.animate();

	}

	private animate() {

		this.scene.update();

		window.requestAnimationFrame( this.animate.bind( this ) );

	}

	private resize() {

		const canvasAspect = window.innerWidth / window.innerHeight;

		const scale = canvasAspect < 1.0 ? Math.min( 1.5, window.devicePixelRatio ) : 1.0;

		const blkRatioX = canvasAspect < 1.0 ? 0.75 : 1.0;
		const blkRatioY = canvasAspect < 1.0 ? 0.7 : 0.5;

		const width = window.innerWidth * scale * blkRatioX;
		const height = window.innerHeight * scale * blkRatioY;

		this.canvas.width = width;
		this.canvas.height = height;
		this.canvas.style.width = width / scale + "";
		this.canvas.style.height = height / scale + "";

		this.scene.resize( new GLP.Vector( this.canvas.width, this.canvas.height ) );

	}

}

new App();
