jQuery( document ).ready( function( $ ) {
    
    $( '.slider' ).each( function() {

        var slider = $( this );

        $( '.slider-items', slider ).slick();

        $( '.text-button', slider ).on( 'click', function() {		   
            $( '.slider-text', slider ).show();	
            $( '.slider-items', slider ).hide(); 
            $( this, slider ).hide();
            $( '.image-button', slider ).show();       
        } );
    
        $( '.image-button', slider ).on( 'click', function() { 
            $( '.slider-text', slider ).hide();	
            $( '.slider-items', slider ).show();	
            $( this, slider ).hide(); 
            $( '.text-button', slider ).show();                  
        } );
    
    } );

} );

