import * as GLP from 'glpower';

import { Tree } from '../Entities/Tree';

import { Cave } from '../Entities/Cave';
import { Sky } from '../Entities/Sky';
import { Floor } from '../Entities/Floor';

export const router = ( node: GLP.BLidgeNode ) => {

	// class

	if ( node.class == "Tree" ) {

		return new Tree();

	} else if ( node.class == "Cave" ) {

		return new Cave();

	} else if ( node.class == "Sky" ) {

		return new Sky();

	} else if ( node.class == "Floor" ) {

		return new Floor();

	}

	const baseEntity = new GLP.Entity();

	return baseEntity;

};
