jQuery( document ).ready( function( $ ) {
    
    $( '.slider .slider-items' ).each( function() {

        $( this ).slick();

        $( '.text-button' ).on( 'click', function() {		   
            $( '.slider-text' ).show();	
            $( '.slider-items' ).hide(); 
            $( this ).hide();
            $( '.image-button' ).show();       
        } );
    
        $( '.image-button' ).on( 'click', function() { 
            $( '.slider-text' ).hide();	
            $( '.slider-items' ).show();	
            $( this ).hide(); 
            $( '.text-button' ).show();                  
        } );
    
    } );

} );

