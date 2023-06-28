import * as GLP from 'glpower';

import { globalUniforms, power } from '~/ts/Globals';

import treeModelVert from './shaders/treeModel.vs';
import treeVert from './shaders/tree.vs';
import treeFrag from './shaders/tree.fs';

import { hotGet, hotUpdate } from '~/ts/libs/glpower_local/Framework/Utils/Hot';
import { TFModeler } from '~/ts/libs/TFModeler';
import { shaderParse } from '../../Renderer/ShaderParser';

export class Tree extends GLP.Entity {

	constructor() {

		super();

		// geometry

		const positionArray: number[] = [];
		const quaternionArray: number[] = [];
		const scaleArray: number[] = [];
		const idArray: number [] = [];

		const _ = ( posStart: GLP.Vector, rot: GLP.Quaternion, scale: number ) => {

			if ( scale < 0.1 ) return;

			positionArray.push( posStart.x, posStart.y, posStart.z );
			scaleArray.push( scale, scale, scale );
			quaternionArray.push( rot.x, rot.y, rot.z, rot.w );

			const posFinish = posStart.add( new GLP.Vector( 0, scale, 0 ).applyMatrix4( new GLP.Matrix().applyQuaternion( rot ) ) );

			for ( let i = 0; i < 3; i ++ ) {

				_( posFinish.clone(), rot.clone().multiply( new GLP.Quaternion().setFromEuler( new GLP.Euler( Math.random(), Math.random() * Math.PI * 2.0, 0 ) ) ), scale * ( 0.53 + Math.random() * 0.40 ) );

			}

			idArray.push( Math.random(), Math.random(), Math.random() );

		};

		_( new GLP.Vector(), new GLP.Quaternion(), 1.0 );

		const geo = new GLP.CubeGeometry( 0.2, 1.0, 0.2 );
		geo.setAttribute( "instancePosition", new Float32Array( positionArray ), 3, { instanceDivisor: 1 } );
		geo.setAttribute( "instanceQuaternion", new Float32Array( quaternionArray ), 4, { instanceDivisor: 1 } );
		geo.setAttribute( "instanceScale", new Float32Array( scaleArray ), 3, { instanceDivisor: 1 } );
		geo.setAttribute( "id", new Float32Array( idArray ), 3, { instanceDivisor: 1 } );

		const modeler = new TFModeler( power );

		const staticGeo = modeler.create( geo, shaderParse( treeModelVert, {} ) );

		console.log( staticGeo );

		this.addComponent( "geometry", staticGeo );

		// material

		const mat = this.addComponent( "material", new GLP.Material( {
			name: "tree",
			type: [ "deferred", "shadowMap" ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time, globalUniforms.resolution, {
			} ),
			vert: hotGet( 'treeVert', treeVert ),
			frag: hotGet( 'treeFrag', treeFrag ),
		} ) );

		if ( import.meta.hot ) {

			import.meta.hot.accept( [ "./shaders/tree.vs", "./shaders/tree.fs" ], ( module ) => {

				if ( module[ 0 ] ) {

					mat.vert = hotUpdate( 'treeVert', module[ 0 ].default );

				}

				if ( module[ 1 ] ) {

					mat.frag = hotUpdate( 'treeFrag', module[ 1 ].default );

				}

				mat.requestUpdate();

			} );

		}

	}

}
