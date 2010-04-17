/**
 * @fileOverview
 * Ant scripts for deploy server scripts to Jaxer and Perservere
 */
importClass( java.io.File );
importClass( org.apache.tools.ant.util.FileUtils );

( function()
{
	function task( taskName )
	{
		return 	project.createTask( taskName );
	}
	
	function echo( msg, file )
	{
		var echo = task( "echo" );
		echo.setEncoding( 'utf-8' );
		echo.setMessage( msg );
		file && echo.setFile( file );
		echo.perform();
	}

	function file( filePath )
	{
		return new File( filePath );
	}

	function type( typeName )
	{
		return project.createDataType( typeName );
	}

	function copy( toDir, from, includes, excludes )
	{
		var mkdir = task( 'mkdir' );
		mkdir.setDir( file( toDir ) );
		mkdir.perform();

		var copy = task( 'copy' );
		copy.setTodir( file( toDir ) );

		var fs = type( 'fileset' );
		from = file( from );
		from.isDirectory() ? fs.setDir( from ) : fs.setFile( from );
		includes && fs.setIncludes( includes );
		excludes && fs.setExcludes( excludes );
		copy.addFileset( fs );

		copy.perform();
	}

	function exec( dir, name )
	{
		var exec = task( 'exec' );
		var args = Array.prototype.slice.call( arguments, 2 );
		for ( var i = 0; i < args.length; i++ )
		{
			var arg = exec.createArg();
			arg.setValue( args[ i ] );
		}
		exec.setExecutable( name );
		exec.setDir( file( dir ) );
		exec.perform();
	}

	var JAXER = 'd:/Jaxer/'
			JAXER_CONF = JAXER + 'local_jaxer/conf/',
			DEST = JAXER + 'public/CKTrans/',
			SRC = '../',
			SRC_EXCLUDES = '/build/,/conf/';

		copy( DEST, SRC, '', SRC_EXCLUDES );
		copy( JAXER_CONF, SRC + 'conf/CKTrans.confApps.js' );
		exec( DEST, 'persvr.bat', '--gen-server', 'db' );
		copy( DEST + 'db/WEB-INF/jslib/', SRC + 'conf/persvr.js' );
} )();






