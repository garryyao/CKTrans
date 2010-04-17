$( function ()
{
	$( '#results' ).bind( 'click', function ( e )
	{
		var target = $( e.target );
		target.is( '.object' ) && target.attr( "closed", target.attr( "closed" ) === "yes"? "no" : "yes" );
	});

	var editables = $( '.editable' );
	editables.editInPlace( {
		callback: function( enteredText, oldText )
		{
			if ( updateAndCommit( this.attr( 'path' ), enteredText ) )
			{
				this.parent().removeClass( 'missing outdated' );
				return enteredText;
			}
			return;
		},
		bg_over: "#cff",
		field_type: "textarea",
		show_buttons: true,
		textarea_rows: "3",
		textarea_cols: "120",
		saving_image: "css/loading.gif",
		value_required : true
	});

	$( '#languages-select' ).bind( 'change', function()
	{
		location.search="?lang=" + $( this).val();
	});
	
});
