function JSONDiff()
{
	this.add = this.remove = this.change = this.remain = this.on = function(){};
	this.rootPath = '';
	this.rootName = '';
}

JSONDiff.prototype.diff = function( a, b )
{
	// JSONPath of the under comparing values.
	var path = arguments[ 2 ] || this.rootPath;
	var name = arguments[ 3 ] || this.rootName;
	var typeA = typeof a;
	var typeB = typeof b;

	this.on( path, name, a, b );
	if ( a === undefined )
	{
		this.add( path, b );
	}
	else if ( b === undefined )
	{
		this.remove( path, a );
	}
	else if ( typeA != typeB)
	{
		this.add( path, b );
		this.remove( path, a );
	}
	else if( typeA !== "object" && a !== b )
	{
		this.change( path, a, b );
	}
	else
	{
		this.remain( path, a, b );

		if ( a !== b )
		{
			var keys = [];
			for ( var i in a ) keys.push( i );
			for ( i in b ) keys.push( i );
			keys.sort();

			for ( i = 0; i < keys.length; i++ )
			{
				if ( keys[ i ] === keys[ i - 1 ] )
					continue;

				arguments.callee.call( this, a[ keys[ i ] ], b[ keys [ i ] ], a instanceof Array ? path + '[' + keys[ i ] + ']' : [ path, keys[ i ] ].join( '.' ), keys[ i ] );
			}
		}
	}
}
