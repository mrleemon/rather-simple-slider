jQuery( document ).ready( function( $ ) {
    
    $( '.slider' ).each( function() {

        var slider = $( this );

        $( '.slider-items', slider ).slick();

        $( '.toggle-text', slider ).on( 'click', function() {
            $( '.slider-text', slider ).show();
            $( '.slider-navigation', slider ).hide();
            $( '.slider-items', slider ).hide();
            $( this, slider ).hide();
            $( '.toggle-media', slider ).show();
        } );
    
        $( '.toggle-media', slider ).on( 'click', function() {
            $( '.slider-text', slider ).hide();
            $( '.slider-navigation', slider ).show();
            $( '.slider-items', slider ).show();
            $( this, slider ).hide();
            $( '.toggle-text', slider ).show();
        } );
    
    } );

} );
