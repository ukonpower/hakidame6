import * as GLP from 'glpower';

import { Tree } from '../Entities/Tree';

import { Cave } from '../Entities/Cave';

export const router = ( node: GLP.BLidgeNode ) => {

	// class

	if ( node.class == "Tree" ) {

		return new Tree();

	} else if ( node.class == "Cave" ) {

		return new Cave();

	}

	const baseEntity = new GLP.Entity();

	return baseEntity;

};
