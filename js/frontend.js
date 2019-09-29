jQuery( document ).ready( function( $ ) {
    
    $( '.slider .slider-items' ).slick();

    $( '.text_button' ).on( 'click', function() {		   
        $( '.slider-text' ).show();	
        $( '.slider-items' ).hide(); 
        $( this ).hide();
        $( '.image_button' ).show();       
    } );

    $( '.image_button' ).on( 'click', function() { 
        $( '.slider-text' ).hide();	
        $( '.slider-items' ).show();	
        $( this ).hide(); 
        $( '.text_button' ).show();                  
    } );

} );

