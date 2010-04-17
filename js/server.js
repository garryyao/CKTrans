( function()
{
	window.onserverload = function()
	{
		var langCode = Jaxer.request.parsedUrl.queryParts [ 'lang' ] || preferedLanguage( Jaxer.request.headers[ 'Accept-Language' ] );

		// List of available language names for editing, note 'en' should be excluded from the list.
		var langs = fetchAllLangs();
		$.each( langs.names, function( index, name )
		{
			var value = langs.codes[ index ];
			$( '#languages-select' ).append( '<option ' + ( langCode == value ? 'selected' : '' ) + ' value="' + value +'">' + name + '</option>' );
		});

		if ( langCode == 'en' || langs.codes.indexOf( langCode ) == -1 )
		{
			$( '#results' ).append( '<h3>' + ( langCode == 'en' ?
					'You\'ll have to select a non-english language first.'
					: ' Language code : ' + langCode + ' is not yet supported.' ) + '</h3>' );
			return;
		}

		Jaxer.session.langCode = langCode;

		function merge()
		{
			var localCopy = fetchLocal( langCode ),
					localCopyRef = fetchLocalRef( langCode );

			var mergeSource = new JSONDiff();
			mergeSource.add = function( path, newValue )
			{
				add( localCopy, path, newValue );
				add( localCopyRef, path, query( remoteRef, path ) );
			};

			mergeSource.remove = function( path, oldValue )
			{
				remove( localCopy, path );
				remove( localCopyRef, path );
			};

			var remoteRef = getRemote();
			mergeSource.diff( localCopy, remoteRef );

			// Commit merged result and reference.
			commit( langCode, null, localCopy );
			commitRef( langCode, null, localCopyRef );

			// Construct tree output.
			var view = new JSONDiff();
			var root, currentNode, lastPath;

			view.on = function( path, name, oldVal, newVal )
			{
				var pathNames = path.split( '.' );
				if ( !lastPath || pathNames.length > lastPath.length )
				{
					root = $( "<ul>" );
					if ( currentNode )
					{
						currentNode.append( root );
						currentNode.attr( 'class', 'object' );
					}
				}
				else if ( lastPath && pathNames.length < lastPath.length )
				{
					var diff = lastPath.length - pathNames.length;
					while ( diff-- )
						root = root.parent().parent();
				}

				var nameNode = $( '<span class="name">' + name + ' : <span>' );
				currentNode = $( '<li>' ).append( nameNode );

				if ( typeof oldVal != 'object' )
				{
					currentNode.append( '<span class="editable" path ="' + pathNames.join( '.' ) + '"' + '>' + oldVal + '</span>' );

					var refVal = query( localCopyRef, path ),
							newRefVal = query( remoteRef, path );

					refVal != newRefVal && $ ( currentNode ).attr( "class", "outdated" );
					$( '<span class="reference">' + newRefVal + '</span>' ).insertAfter( nameNode );
				}

				root.append( currentNode );
				lastPath = pathNames;
			};

			view.add = view.remove = function( path, newValue )
			{
				throw 'There should have no added and removed.';
			};

			view.remain = function( path, oldVal, newVal )
			{
				if ( typeof newVal != 'object' )
					$( currentNode ).attr( "class", "missing" );
			};

			view.diff( localCopy, remoteRef );
			$( '#results').append( root );
		}

		init( langCode );
		merge();
	};

} )();
