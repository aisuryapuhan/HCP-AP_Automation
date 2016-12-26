function create_test(param) {  
  $.trace.debug("Entered create test function...");  
  let after = param.afterTableName;  
  let pStmt = param.connection.prepareStatement('update "' + after + '" set TESTID = "AP"."workshop.aisurya.AP2::ZTESTID".NEXTVAL'); 
  pStmt.executeUpdate();  
  pStmt.close();  
}

function insertvalues(param){
	var sJSONBody = $.request.body.asString();
	sJSONBody = JSON.parse(sJSONBody);
//	var item = [];
	var i = 0;
	$.trace.debug("request path: " + $.request.path);
	var strQuery = "INSERT INTO \"AP\".\"NAME\" VALUES (?,?,?)";
	var conn = $.hdb.getConnection();

	try{
//		For loop to get the item data
		for (i = 0;i < sJSONBody.item.length; i++)
		{ 
			conn.executeUpdate(strQuery,sJSONBody.item[i].id,sJSONBody.item[i].name,sJSONBody.item[i].age);

		}

		conn.commit();
		$.response.setBody('{"success": "true" }');
		$.response.contentType = "application/json";	
		$.response.headers.set("Access-Control-Allow-Origin", "*");

	}

	catch(e)
	{
		$.response.contentType = "application/json";
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(JSON.stringify(e.message));
		conn.rollback();
	}

	
}