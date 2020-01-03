/**
 * WordPress dependencies
 */
const { registerBlockType } = wp.blocks;
const { G, Path, SVG, Placeholder, SelectControl } = wp.components;
const { withSelect } = wp.data;
const { RawHTML } = wp.element;
const { __ } = wp.i18n;

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
    title: __( 'Really Simple Slider', 'really-simple-slider' ),
    description: __( 'Display a slider.', 'really-simple-slider' ),
    icon: <SVG viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><Path fill="none" d="M0 0h24v24H0V0z" /><G><Path d="M20 4v12H8V4h12m0-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 9.67l1.69 2.26 2.48-3.1L19 15H9zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z" /></G></SVG>,
    category: 'common',
    keywords: [ __( 'images' ), __( 'photos' ) ],
    attributes: blockAttributes,

    edit: withSelect( ( select ) => {
        return {
            posts: select( 'core' ).getEntityRecords( 'postType', 'slider', { per_page: -1 } )
        };
    } )
    ( props => {
        const { attributes, className } = props;

        const setID = value => {
            props.setAttributes( { id: Number( value ) } );
        };

        if ( ! props.posts ) {
            return __( 'Loading...', 'really-simple-slider' );
        }

        if ( props.posts.length === 0 ) {
            return __( 'No sliders found', 'really-simple-slider' );
        }

        var options = [];
        options.push( {
            label: __( 'Select a slider...', 'really-simple-slider' ),
            value: ''
        } );

        for ( var i = 0; i < props.posts.length; i++ ) {
            options.push( {
                label: props.posts[i].title.raw,
                value: props.posts[i].id
            } );
        }

        return (
            <Placeholder
				key='really-simple-slider-block'
				icon='images-alt2'
				label={ __( 'Really Simple Slider Block', 'really-simple-slider' ) }
				className={ className }>
                    <SelectControl
                        label={ __( 'Select a slider:', 'really-simple-slider' ) }
                        value={ attributes.id }
                        options={ options }
                        onChange={ setID }
                    />
            </Placeholder>
        );

    } ),

    save( { attributes } ) {
        const { id } = attributes;
        var shortcode = '[slider id="' + id + '"]';
        return (
            <RawHTML>{ shortcode }</RawHTML>
        );
    },

};

registerBlockType( name, settings );
