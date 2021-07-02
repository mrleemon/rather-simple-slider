/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import {
    G,
    Path,
    SVG,
    Disabled,
    PanelBody,
    SelectControl,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import ServerSideRender from '@wordpress/server-side-render';

/**
 * Internal dependencies
 */

const blockAttributes = {
    id: {
        type: 'integer',
        default: 0,
    },
};

export const name = 'occ/rather-simple-slider';

export const settings = {
    title: __( 'Rather Simple Slider', 'rather-simple-slider' ),
    description: __( 'Display a slider.', 'rather-simple-slider' ),
    icon: <SVG viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><Path fill="none" d="M0 0h24v24H0V0z" /><G><Path d="M20 4v12H8V4h12m0-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 9.67l1.69 2.26 2.48-3.1L19 15H9zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z" /></G></SVG>,
    category: 'common',
    keywords: [ __( 'images', 'rather-simple-slider' ), __( 'photos', 'rather-simple-slider' ) ],
    attributes: blockAttributes,

    edit: ( props => {
        const { attributes, className } = props;

        const sliders = useSelect(
            ( select ) => select( 'core' ).getEntityRecords( 'postType', 'slider', { per_page: -1, orderby: 'title', order: 'asc', _fields: 'id,title' } ),
            []
        );

        const setID = value => {
            props.setAttributes( { id: Number( value ) } );
        };

        if ( ! sliders ) {
            return __( 'Loading...', 'rather-simple-slider' );
        }

        if ( sliders.length === 0 ) {
            return __( 'No sliders found', 'rather-simple-slider' );
        }

        var options = [];
        options.push( {
            label: __( 'Select a slider...', 'rather-simple-slider' ),
            value: ''
        } );

        for ( var i = 0; i < sliders.length; i++ ) {
            options.push( {
                label: sliders[i].title.raw,
                value: sliders[i].id
            } );
        }

        return (
            <Fragment>
				<InspectorControls>
					<PanelBody
						title={ __( 'Settings', 'rather-simple-slider' ) }
					>
                        <SelectControl
                            label={ __( 'Select a slider:', 'rather-simple-slider' ) }
                            value={ attributes.id }
                            options={ options }
                            onChange={ setID }
                        />
                    </PanelBody>
                </InspectorControls>
				<Disabled>
					<ServerSideRender
						block="occ/rather-simple-slider"
						attributes={ attributes }
						className={ className }
					/>
				</Disabled>
            </Fragment>
        );

    } ),

    save: () => {
		return null;
	},

};

registerBlockType( name, settings );
