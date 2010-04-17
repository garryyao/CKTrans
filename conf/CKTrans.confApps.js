(function() {

	Config.apps.unshift( {
		urlTest : /CKTrans.*/,
		name : "CKTrans",
		appKey : function( parsedUrl ) {
			return "CKTrans";
		},
		pageKey : function( parsedUrl ) {
			return parsedUrl.hostAndPort + parsedUrl.pathAndFile;
		},
		path : function( resolvedName ) {
			return Dir.combine( Config.DEFAULT_PATH_BASE, resolvedName );
		}
	} );

})( );
