( function()
{
	var langCode = Jaxer.request.parsedUrl.queryParts [ 'lang' ];
	if( !langCode || langCode == 'en' )
		Jaxer.response.exit( 404 );

	init( langCode );
	Jaxer.response.setContents( 'CKEDITOR.lang["' + langCode + '"]=' + JSON.stringify( fetchLocal( langCode ) ) + ';' );
	Jaxer.response.headers["Content-Type"] = "application/json";
	Jaxer.response.headers[ "Content-Disposition" ] = 'attachment;filename=' + langCode + '.js';

} )( );
