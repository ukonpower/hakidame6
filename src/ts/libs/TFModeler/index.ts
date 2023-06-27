import console from 'console';
import * as GLP from 'glpower';

export class TFModeler {

	private power: GLP.Power;
	private gl: WebGL2RenderingContext;
	private tf: GLP.GLPowerTransformFeedback;

	constructor( power: GLP.Power ) {

		this.power = power;
		this.gl = this.power.gl;
		this.tf = new GLP.GLPowerTransformFeedback( this.power.gl );

	}

	public create( baseGeometry: GLP.Geometry, vertexShader: string ) {

		const resultGeo = new GLP.Geometry();

		const program = this.power.createProgram();
		const tf = new GLP.GLPowerTransformFeedback( this.gl );

		let instanceCount = 1;

		baseGeometry.attributes.forEach( attr => {

			if ( attr.opt && attr.opt.instanceDivisor ) {

				instanceCount = attr.array.length / attr.size;

			}

		} );

		const outBufferPosition = this.power.createBuffer();
		outBufferPosition.setData( new Float32Array( ( baseGeometry.attributes.get( 'position' )?.array.length || 0 ) * instanceCount ), 'vbo', this.gl.DYNAMIC_COPY );

		const outBufferNormal = this.power.createBuffer();
		outBufferPosition.setData( new Float32Array( ( baseGeometry.attributes.get( 'normal' )?.array.length || 0 ) * instanceCount ), 'vbo', this.gl.DYNAMIC_COPY );

		tf.setBuffer( "position", outBufferPosition, 0 );
		tf.setBuffer( "normal", outBufferNormal, 1 );

		tf.bind( () => {

			program.setShader( vertexShader, "void main(){ discard; }", { transformFeedbackVaryings: [ 'o_position', 'o_normal' ] } );

		} );

		const vao = program.getVAO();

		if ( vao ) {

			baseGeometry.attributes.forEach( ( attr, key ) => {

				if ( attr.buffer ) {

					vao.setAttribute( key, attr.buffer, attr.size, attr.opt );

				}

			} );

			program.use( () => {

				program.uploadUniforms();

				tf.use( () => {

					this.gl.beginTransformFeedback( this.gl.POINTS );
					this.gl.enable( this.gl.RASTERIZER_DISCARD );

					vao.use( () => {

						this.gl.drawArrays( this.gl.POINTS, 0, vao.vertCount );

					} );

					this.gl.disable( this.gl.RASTERIZER_DISCARD );
					this.gl.endTransformFeedback();

				} );

				// this.gl.bindBuffer( this.gl.ARRAY_BUFFER, outBufferPosition.buffer );
				// this.gl.getBufferSubData( this.gl.ARRAY_BUFFER, 0, this.audioBuffer.getChannelData( 0 ) );

				// this.gl.bindBuffer( this.gl.ARRAY_BUFFER, bufferR.buffer );
				// this.gl.getBufferSubData( this.gl.ARRAY_BUFFER, 0, this.audioBuffer.getChannelData( 1 ) );

				resultGeo.setAttribute( 'position', outBufferPosition.array!, 3 );
				resultGeo.setAttribute( 'position', outBufferNormal.array!, 3 );

			} );

		}

		return resultGeo;

	}


}
