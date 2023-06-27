import * as GLP from 'glpower';

import { Tree } from '../Entities/Tree';

import isuFrag from './shaders/isu.fs';

export const router = ( node: GLP.BLidgeNode ) => {

	// class

	if ( node.class == "Tree" ) {

		return new Tree();

	}

	const baseEntity = new GLP.Entity();

	return baseEntity;

};
