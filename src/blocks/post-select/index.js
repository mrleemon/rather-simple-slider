/**
 * External dependencies
 */
//const { filter, every, map, some } = lodash;

/**
 * WordPress dependencies
 */
const { createBlock, registerBlockType } = wp.blocks;
const { G, Path, SVG, SelectControl } = wp.components;
const { withSelect } = wp.data;
const { RawHTML } = wp.element;
const { __, setLocaleData } = wp.i18n;

/**
 * Internal dependencies
 */

const blockAttributes = {
    id: {
		type: 'integer',
		default: 0,
	},
};

export const name = 'occ/really-simple-slider';

export const settings = {
    title: __( 'Slider', 'really-simple-slider' ),
    description: __( 'Display a slider.', 'really-simple-slider' ),
    icon: <SVG viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><Path fill="none" d="M0 0h24v24H0V0z" /><G><Path d="M20 4v12H8V4h12m0-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 9.67l1.69 2.26 2.48-3.1L19 15H9zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z" /></G></SVG>,
    category: 'common',
    keywords: [ __( 'images' ), __( 'photos' ) ],
    attributes: blockAttributes,

    edit: withSelect( ( select ) => {
        var sliders = select( 'core' ).getEntityRecords( 'postType', 'slider', { per_page: -1 } );
        return {
            posts: sliders
        };
    } )
    ( props => {
        const attributes = props.attributes;

        const setID = value => {
            props.setAttributes( { id: value } );
        };

        if ( ! props.posts ) {
            return __( 'Loading...' );
        }

        if ( props.posts.length === 0 ) {
            return __( 'No sliders found' );
        }

        var options = [];
        options.push( {
            label: __( 'Choose' ),
            value: ''
        } );

        for ( var i = 0; i < props.posts.length; i++ ) {
            options.push( {
                label: props.posts[i].title.raw,
                value: props.posts[i].id
            } );
        }

        return (
            <div>
                <SelectControl
                    label={ __( 'Select a slider:', 'really-simple-slider' ) }
                    value={ attributes.id }
                    options={ options }
                    onChange={ setID }
                />
            </div>
        );

    } ),

    save( { attributes } ) {
        //const { images } = attributes;
        var myShortcode = '[custom-shortcode param_1="value_1" param_2="value_2" /]';
        return (
            <div>
                <RawHTML>{ myShortcode }</RawHTML>
            </div>
        );
    },

};

registerBlockType( name, settings );
