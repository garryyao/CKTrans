function updateAndCommit( path, newVal )
{
	var langCode;
	if ( ! ( langCode = Jaxer.session.langCode ) )
		return false;

	var ref = getRemote();
	
	commit( langCode, path, newVal );
	commitRef( langCode, path, query( ref, path ) );
	return true;
}
