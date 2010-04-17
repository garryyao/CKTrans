( function()
{
	var configs =
	{
		// Where is the directory of source versions language files, e.g. SVN?
		'remoteCopyURI' : 'http://nightly.ckeditor.com/latest/ckeditor/lang/',
		// Where is persever HTTP server running on?
		'PERSVR_URI' : 'http://localhost:8080/'
	};

	window.configOf = function( name )
	{
		return configs[ name ];
	};

} )( );
