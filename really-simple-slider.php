<?php
/*
Plugin Name: Really Simple Slider
Version: v1.0
Plugin URI:
Author: Oscar Ciutat
Author URI: http://oscarciutat.com/code/
Description: A simple slider
*/

class Really_Simple_Slider {
    
    /**
     * Plugin instance.
     *
     * @since 1.0
     *
     */
    protected static $instance = null;


    /**
     * Access this plugin’s working instance
     *
     * @since 1.0
     *
     */
    public static function get_instance() {
        
        if ( !self::$instance ) {
            self::$instance = new self;
        }

        return self::$instance;

    }

    
    /**
     * Used for regular plugin work.
     *
     * @since 1.0
     *
     */
    public function plugin_setup() {

          $this->includes();

        add_action( 'init', array( $this, 'load_language' ) );
        add_action( 'init', array( $this, 'register_post_type' ) );

        add_action( 'init', array( $this, 'init' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
        add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );
        add_action( 'save_post_slider', array( $this, 'save_slider' ) );
        add_action( 'media_buttons', array( $this, 'display_button' ) );
        
        add_action( 'show_slider', array($this, 'show_slider' ) );
        
        // Columns
        add_filter( 'manage_slider_posts_columns', array( $this, 'slider_columns' ) );
        add_action( 'manage_slider_posts_custom_column',  array( $this, 'slider_custom_column' ), 5, 2 );

        // Enqueue the thickbox (required for button to work)
        add_action( 'admin_footer', array( $this, 'print_thickbox' ) );
        
        add_shortcode( 'slider', array( $this, 'shortcode_slider' ) );
    
    }

    
    /**
     * Constructor. Intentionally left empty and public.
     *
     * @since 1.0
     *
     */
    public function __construct() {}
    
    
     /**
     * Includes required core files used in admin and on the frontend.
     *
     * @since 1.0
     *
     */
    protected function includes() {}


    /**
     * load_language
     */
    public function load_language() {
        load_plugin_textdomain( 'really-simple-slider', '', dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
    }

    
    /**
     * enqueue_scripts
     */
    function enqueue_scripts() {
        // enqueue styles
        wp_enqueue_style( 'really-simple-slider-css', plugins_url( '/style.css', __FILE__ ), array( 'dashicons' ) );
        // enqueue scripts
        wp_enqueue_script( 'cycle2', plugins_url( '/js/jquery.cycle2.min.js', __FILE__ ), array( 'jquery' ), '1.0' );
        wp_enqueue_script( 'really-simple-slider-frontend', plugins_url( '/js/frontend.js', __FILE__ ), array( 'jquery' ), '1.0' );
    }


    /**
     * admin_enqueue_scripts
     */
    function admin_enqueue_scripts() {
        wp_enqueue_media();
        wp_enqueue_style( 'gallery-css', plugins_url( '/css/slider-gallery.css', __FILE__ ) );
        wp_enqueue_script( 'gallery-script', plugins_url( '/js/slider-gallery.js', __FILE__ ), array( 'jquery' ), '1.0', true );
    }

    
    
    /*
     * register_post_type
     *
     * @since 1.0
     */
    function register_post_type() {
        
        $labels = array(
            'name' => __( 'Sliders', 'really-simple-slider' ),
            'singular_name' => __( 'Slider', 'really-simple-slider' ),
            'add_new' => __( 'Add New Slider', 'really-simple-slider' ),
            'add_new_item' => __( 'Add New Slider', 'really-simple-slider' ),
            'edit_item' => __( 'Edit Slider', 'really-simple-slider' ),
            'new_item' => __( 'New Slider', 'really-simple-slider' ),
            'view_item' => __( 'View Slider', 'really-simple-slider' ),
            'search_items' => __( 'Search Sliders', 'really-simple-slider' ),
            'not_found' => __( 'No Sliders found', 'really-simple-slider' ),
            'not_found_in_trash' => __( 'No Sliders found in Trash', 'really-simple-slider' )
        );
      
        $args = array(
            'query_var' => false,
            'rewrite' => false,
            'public' => true,
            'exclude_from_search' => true,
            'publicly_queryable' => false,
            'show_in_nav_menus' => false,
            'show_ui' => true,
            'menu_position' => 5,
            'menu_icon' => 'dashicons-images-alt2',
            'supports' => array( 'title' ), 
            'labels' => $labels,
            'register_meta_box_cb' => array( $this , 'add_slider_meta_boxes' )
        );

        register_post_type( 'slider', $args );
        
    }


    /*
    * add_slider_meta_boxes
    */

    function add_slider_meta_boxes() {
        add_meta_box( 'slider-shortcode', __( 'Shortcode', 'really-simple-slider' ), array( $this , 'slider_shortcode_meta_box' ), 'slider', 'side', 'default' );
        add_meta_box( 'slider-options', __( 'Options', 'really-simple-slider' ), array( $this , 'slider_options_meta_box' ), 'slider', 'side', 'default' );
        add_meta_box( 'slider-items', __( 'Slider items', 'really-simple-slider' ), array( $this , 'slider_items_meta_box' ), 'slider', 'normal', 'default' );
    }


    /*
    * slider_shortcode_meta_box
    */
  
    function slider_shortcode_meta_box() {
        global $post;
        $shortcode = '[slider id="' . $post->ID . '"]';
    ?>
        <div class="form-wrap">
        <div class="form-field">
        <label for="slider_get_shortcode"><?php _e( 'Your Shortcode:', 'really-simple-slider' ); ?></label>
        <input readonly="true" id="slider_get_shortcode" type="text" class="widefat" name="" value="<?php echo esc_attr( $shortcode ); ?>" />
        <p><?php _e( 'Copy and paste this shortcode into your Post, Page or Custom Post editor.', 'really-simple-slider' ); ?></p>
        </div>
        </div>
    <?php
    }

    
    /*
    * slider_options_meta_box
    */
  
    function slider_options_meta_box() {
        global $post;
        $slider_fx = ( get_post_meta( $post->ID, '_rss_slider_fx', true ) ) ? get_post_meta( $post->ID, '_rss_slider_fx', true ) : 'fade';
        $slider_auto = ( get_post_meta( $post->ID, '_rss_slider_auto', true ) ) ? get_post_meta( $post->ID, '_rss_slider_auto', true ) : '';
    ?>
        <div class="form-wrap">
        <div class="form-field">
        <label for="slider_fx"><?php _e( 'Effect:', 'really-simple-slider' ); ?></label>
        <select id="slider_fx" name="slider_fx">
        <option value="fade" <?php echo ( ( $slider_fx == 'fade' ) || ( empty( $archive_display ) ) ) ? 'selected="selected"' : '' ?>><?php _e( 'Fade', 'really-simple-slider' ); ?></option>
        <option value="scrollHorz" <?php echo ( $slider_fx == 'scrollHorz' ) ? 'selected="selected"' : '' ?>><?php _e( 'Slide', 'really-simple-slider' ); ?></option>
        </select>
        </div>
        <div class="form-field">
        <label for="slider_auto"><?php _e( 'Automatic Playback:', 'really-simple-slider' ); ?>
        <input type="checkbox" id="slider_auto" name="slider_auto" value="true" <?php checked( $slider_auto, 'true' ); ?> />
        </label>
        </div>
        </div>
    <?php
    }

    
    /*
    * slider_items_meta_box
    */
  
    function slider_items_meta_box() {
        global $post;
        
    ?>

            <div id="slider_images_container">
            <ul class="slider_images">
                <?php
                    if ( metadata_exists( 'post', $post->ID, '_rss_slider_items' ) ) {
                        $slider_items = get_post_meta( $post->ID, '_rss_slider_items', true );
                    } else {
                        $args = array(
                            'post_parent'    => $post->ID,
                            'post_type'      => 'attachment',
                            'numberposts'    => -1,
                            'orderby'        => 'menu_order',
                            'order'          => 'ASC',
                            'fields'         => 'ids'
                        );
                        $attachment_ids = get_posts( $args );
                        $slider_items = implode( ',', $attachment_ids );
                    }
                    
                    $attachments         = array_filter( explode( ',', $slider_items ) );
                    $update_meta         = false;
                    $updated_gallery_ids = array();

                    if ( ! empty( $attachments ) ) {
                        foreach ( $attachments as $attachment_id ) {
                            if ( wp_attachment_is_image( $attachment_id ) ) {
                                $attachment = wp_get_attachment_image( $attachment_id, 'thumbnail' );
                                echo '<li class="image" data-attachment_id="' . esc_attr( $attachment_id ) . '">
                                    ' . $attachment . '
                                    <ul class="actions">
                                        <li><a href="#" class="delete tips" data-tip="' . esc_attr__( 'Delete item', 'really-simple-slider' ) . '">' . __( 'Delete', 'really-simple-slider' ) . '</a></li>
                                    </ul>
                                </li>';
                                // rebuild ids to be saved
                                $updated_gallery_ids[] = $attachment_id;
                            }
                        }

                        // need to update slider meta to set new gallery ids
                        if ( $update_meta ) {
                            update_post_meta( $post->ID, '_rss_slider_items', implode( ',', $updated_gallery_ids ) );
                        }
                    }
                ?>
            </ul>

            <input type="hidden" id="slider_items" name="slider_items" value="<?php echo esc_attr( $slider_items ); ?>" />

        </div>
        <p class="add_slider_images hide-if-no-js">
            <a href="#" data-choose="<?php esc_attr_e( 'Add items to slider', 'really-simple-slider' ); ?>"><?php _e( 'Add slider items', 'really-simple-slider' ); ?></a>
        </p>
        <?php
    }


    /*
    * save_slider
    */
 
    function save_slider( $post_id ) {
        // verify nonce
        if ( isset( $_POST['metabox_nonce'] ) && !wp_verify_nonce( $_POST['metabox_nonce'], basename( __FILE__ ) ) ) {
            return $post_id;
        }
    
        // is autosave?
        if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
            return $post_id;
        }

        // check permissions
        if ( isset( $_POST['post_type'] ) ) {
            if ( 'page' == $_POST['post_type'] ) {
                if ( !current_user_can( 'edit_page', $post_id ) ) {
                    return $post_id;
                }
            } elseif ( !current_user_can( 'edit_post', $post_id ) ) {
                return $post_id;
            }
        }

        if ( isset( $_POST['post_type'] ) && ( 'slider' == $_POST['post_type'] ) ) {
            
            $slider_fx = isset( $_POST['slider_fx'] ) ? sanitize_text_field( $_POST['slider_fx'] ) : 'fade';
            update_post_meta( $post_id, '_rss_slider_fx', $slider_fx );

            $slider_auto = isset( $_POST['slider_auto'] ) ? $_POST['slider_auto'] : '';
            update_post_meta( $post_id, '_rss_slider_auto', $slider_auto );

            $attachment_ids = isset( $_POST['slider_items'] ) ? array_filter( explode( ',', sanitize_text_field( $_POST['slider_items'] ) ) ) : array();
            update_post_meta( $post_id, '_rss_slider_items', implode( ',', $attachment_ids ) );

        }
        
    }

    
    /**
     * shortcode_slider
     */
    function shortcode_slider( $attr ) {
        $html = $this->shortcode_atts( $attr );
        return $html;
    }

    
    /**
     * shortcode_atts
     */
    function shortcode_atts( $attr ) {
        $atts = shortcode_atts( array(
            'id' => ''
        ), $attr, 'slider' );
        $id = $atts['id'];
        $html = '';
        if ( 'slider' === get_post_type( $id ) ) {
            $html = $this->slider_markup( $id );
        }
        return $html;
    }

    
    /**
     * show_slider
     */
    function show_slider( $id ) {
        $html = '';
        if ( 'slider' === get_post_type( $id ) ) {
            $html = $this->slider_markup( $id );
        }
        echo $html;
    }
    
    
    /**
     * slider_markup
     */
    function slider_markup( $id ) {
        $slider_fx = ( get_post_meta( $id, '_rss_slider_fx', true ) ) ? get_post_meta( $id, '_rss_slider_fx', true ) : 'fade';
        $slider_auto = ( get_post_meta( $id, '_rss_slider_auto', true ) ) ? '8000' : '0';
        $slider_items = get_post_meta( $id, '_rss_slider_items', true );
        $attachments = array_filter( explode( ',', $slider_items ) );
        $html = '';
        if ( ! empty( $attachments ) ) {
        
            $html = '<!-- Begin slider markup -->
            
                    <script type="text/javascript">
                        jQuery( function( $ ) {
                            $("#slider-' . esc_js( $id ) . '").cycle({
                                fx: "' . esc_js( $slider_fx ) . '",
                                speed: 500,
                                timeout: ' . esc_js( $slider_auto ) . ',
                                slides: ".slide",
                                autoHeight: "calc",
                                loader: "wait"
                            });
                        });
                    </script>
                    
                     <div id="slider-' . $id . '" class="slider featured">';
            foreach ( $attachments as $attachment_id ) {
                if ( wp_attachment_is_image( $attachment_id ) ) {
                    $image_attributes = wp_get_attachment_image_src( $attachment_id, 'full' );
                    if ( isset( $_wp_additional_image_sizes ) && count( $_wp_additional_image_sizes ) && in_array( $size, array_keys( $_wp_additional_image_sizes ) ) ) {
                        $width = $_wp_additional_image_sizes[$size]['width'];
                        $height = $_wp_additional_image_sizes[$size]['height'];
                    } else {
                        $width = get_option( $size . '_size_w' ) ? get_option( $size . '_size_w' ) : $image_attributes[1];
                        $height = get_option( $size . '_size_h' ) ? get_option( $size . '_size_h' ) : $image_attributes[2];
                    } 
                    $html .= '<div class="slide">';
                    $html .= '<img src="' . $image_attributes[0] . '" width="' . $width . 
                            '" height="' . $height . '" alt="" />';
                    $html .= '</div>';
                }
            }
            $html .= '</div>
            
                      <!-- End slider markup -->';
    
        }
        return $html;
    }

    
    /**
     * Displays the media button
     *
     * @return void
     */
     public function display_button() {
        // Print the button's HTML and CSS
        ?>
            <style type="text/css">
                .wp-media-buttons .insert-slider span.wp-media-buttons-icon {
                    margin-top: -2px;
                }
                .wp-media-buttons .insert-slider span.wp-media-buttons-icon:before {
                    content: "\f233";
                    font: 400 18px/1 dashicons;
                    speak: none;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
            </style>
            
            <a href="#TB_inline?width=480&amp;inlineId=select-slider" class="button thickbox insert-slider" data-editor="<?php echo esc_attr( $editor_id ); ?>" title="<?php _e( 'Add a Slider', 'really-simple-slider' ); ?>">
                <span class="wp-media-buttons-icon dashicons dashicons-format-image"></span><?php _e( 'Add Slider', 'really-simple-slider' ); ?>
            </a>
        <?php

    }

    
    /**
     * Prints the thickbox for our media button
     *
     * @return void
     */
    public function print_thickbox() {
        ?>
            <style type="text/css">
                #TB_window .section {
                    padding: 15px 15px 0 15px;
                }
            </style>

            <script type="text/javascript">
                /**
                 * Sends a shortcode to the post/page editor
                 */
                function insertSlider() {

                    // Get the slider ID
                    var id = jQuery( '#slider' ).val();

                    // Display alert and bail if no slideshow was selected
                    if ( '-1' === id ) {
                        return alert( "<?php _e( 'Please select a Slider', 'really-simple-slider' ); ?>" );
                    }

                    // Send shortcode to editor
                    send_to_editor( '[<?php echo esc_attr( 'slider' ); ?> id=\"'+ id +'\"]' );

                    // Close thickbox
                    tb_remove();

                }
            </script>

            <div id="select-slider" style="display: none;">
                <div class="section">
                    <h2><?php _e( 'Add a slider', 'really-simple-slider' ); ?></h2>
                    <span><?php _e( 'Select a slider to insert from the dropdown below:', 'really-simple-slider' ); ?></span>
                </div>

                <div class="section">
                    <select name="slider" id="slider">
                        <option value="-1"><?php _e( 'Select a slider', 'really-simple-slider' ); ?></option>
                        <?php
                            $args = array(
                                'post_type'   => 'slider',
                                'numberposts' => -1,
                                'orderby'     => 'ID',
                                'order'          => 'DESC'
                            );
                            $sliders = get_posts( $args );
                        ?>
                        <?php foreach ( $sliders as $slider ) : ?>
                            <option value="<?php echo esc_attr( $slider->ID ); ?>"><?php echo esc_html( sprintf( "%s ( ID #%d )", $slider->post_title, $slider->ID)); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="section">
                    <button id="insert-slider" class="button-primary" onClick="insertSlider();"><?php _e( 'Insert Slider', 'really-simple-slider' ); ?></button>
                    <button id="close-slider-thickbox" class="button-secondary" style="margin-left: 5px;" onClick="tb_remove();"><?php _e( 'Close', 'really-simple-slider' ); ?></a>
                </div>
            </div>
        <?php
    }

    
    /*
    * slider_columns
    */

    function slider_columns( $columns ) {
        $new = array();
        foreach( $columns as $key => $value ) {
            if ( $key == 'date' ) {
                // Put the Shortcode column before the Date column
                $new['shortcode'] = __( 'Shortcode', 'really-simple-slider' );
            }
            $new[$key] = $value;
        }
        return $new;
    }


    /*
    * slider_custom_column
    */

    function slider_custom_column( $column, $post_id ) {
        switch ( $column ) {
            case 'shortcode':
                $shortcode = sprintf( esc_html( "[slider id=\"%d\"]" ), $post_id );
                echo $shortcode;
                break;
        }
    }

}

add_action( 'plugins_loaded', array ( Really_Simple_Slider::get_instance(), 'plugin_setup' ) );