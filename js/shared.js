var baseURI = configOf( 'PERSVR_URI' ) + 'Languages/',
		langBaseURI = baseURI + '1',
		refBaseURI = [ langBaseURI, 'ref' ].join( '.' );

function init( lang )
{
	var rootExist = !!eval( Jaxer.Web.get( baseURI + '.length' ) );
	if( !rootExist )
	{
		echo( 'Initialize languages document...');
		Jaxer.Web.post( baseURI, JSON.stringify( { id : 1, ref : {} } ) );
	}

	if ( eval( Jaxer.Web.get( langBaseURI + '["' + lang + '"]' + '==undefined' ) ) )
	{
		echo( 'Initialize ' + lang +' language entry...' );
		var langEntry = {};
		langEntry[ lang ] = getRemote( lang );
		Jaxer.Web.post( langBaseURI, serialize( langEntry ) );
	}

	if ( eval( Jaxer.Web.get( refBaseURI + '["' + lang + '"]' + '==undefined' ) ) )
	{
		echo( 'Initialize ' + lang +' language reference entry...' );
		var langRefEntry = {};
		langRefEntry[ lang ] = getRemote();
		Jaxer.Web.post( refBaseURI, serialize( langRefEntry ) );
	}
}

function fetchAllLangs()
{
	eval( Jaxer.Web.get( configOf( 'remoteCopyURI' ) + '_languages.js' ));
	var langCodes = jsonPath( CKEDITOR_LANGS, '$..code' ),
			langNames = jsonPath( CKEDITOR_LANGS, '$..name' );

	return {
		codes	 : langCodes,
		names : langNames
	};
}

function getRemote( lang )
{
	// Referencing 'en' language version by default.
	lang = lang || 'en';

	var CKEDITOR = { lang : {} };
	eval( Jaxer.Web.get( configOf( 'remoteCopyURI' ) + lang + '.js' ) );
	return CKEDITOR.lang[ lang ];
}

function fetchLocal( lang )
{
	return eval( unescapePersvr( Jaxer.Web.get( [ langBaseURI, lang].join( '.' ) ) ) );
}

function fetchLocalRef( lang )
{
	return eval( unescapePersvr( Jaxer.Web.get( [ refBaseURI, lang].join( '.' ) ) ) );
}

function commit( lang, path, obj )
{
	var uri = [ langBaseURI, lang ].join( '.' );
	path && ( uri += path );
	Jaxer.Web.put( uri, serialize( obj ) );
	echo( 'Local Commited: ' + uri + ' With: ' + JSON.stringify( obj ) );
}

function commitRef( lang, path, obj )
{
	var uri = [ refBaseURI, lang ].join( '.' );
	path && ( uri += path );
	Jaxer.Web.put( uri, serialize( obj ) );
	echo( 'Local Reference Commited: ' + uri + ' With: ' + JSON.stringify( obj ) );
}

function query( obj, path )
{
	return jsonPath( obj, '$' + path )[ 0 ];
}

function update( obj, path, value )
{
	var names = path.split( '.' ),
			name = names.pop(),
			rootPath = names.join( '.' );

	obj = query( obj, rootPath );

	if ( typeof value == 'undefined' )
		delete obj[ name ];
	else
		obj[ name ] = value;
}

function add( obj, path, value )
{
	update.apply( this, arguments );
	echo( 'Added Local Reference: ' + path + ': ' + JSON.stringify( value ) );
}

function remove( obj, path )
{
	update.apply( this, arguments );
	echo( 'Removed Local Reference: ' + path );
}

function encodePathPersvr( path )
{
	return path.replace( /\.id\b/g, '.cke_id' ).replace( /\.(\d+)\b/g, '.d$1');
}

function escapePersvr( str )
{
	return str.replace( /"id"/g, '"cke_id"' ).replace( /"(\d+)"/g, '"d$1"');
}

function unescapePersvr( str )
{
	return str.replace( /"id":".*?",?/g, '' )
			.replace( /"d(\d+)"/g, '"$1"' )
			.replace( /\bcke_id\b/g, 'id' );
}

function serialize( obj )
{
	return escapePersvr( JSON.stringify( obj ) );
}

function preferedLanguage( langRange )
{
    var candidates = [];
    langRange.replace( /([a-z]{1,8}(?:-[a-z]{1,8})?)\s*(?:;\s*q\s*=\s*(1|0\.[0-9]+))?/gi, function( match, langCode, quality )
	{
        candidates.push( { code : langCode, quality : quality || 1 });
    });

    candidates.sort( function( item1, item2 ){ return item2.quality - item1.quality; } );
    return candidates[ 0 ].code.toLowerCase();
}

function echo( line )
{
	alert( line + '\n' );
}
