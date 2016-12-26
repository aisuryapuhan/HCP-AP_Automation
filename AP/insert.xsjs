//	var tagsArray = $.request.parameters.get("item[]");
	var sJSONBody = $.request.body.asString();
	sJSONBody = JSON.parse(sJSONBody);
//	$.response.contentType="application/json";
//	$.response.setBody(sJSONBody);

//	var item = [];
	var i = 0;
	$.trace.debug("request path: " + $.request.path);
	var strQuery = "INSERT INTO \"AP\".\"NAME\" VALUES (?,?,?)";
	var conn = $.hdb.getConnection();

	try{
//		For loop to get the item data
		for (i = 0;i < sJSONBody.item.length; i++)
		{ 
			//item.push(sJSONBody.item[i]);
			conn.executeUpdate(strQuery,sJSONBody.item[i].id,sJSONBody.item[i].name,sJSONBody.item[i].age);
			//isupdate
			//conn.executeUpdate(strQuery,9,9,9);
		}

		conn.commit();
		$.response.setBody('{"success": "true" }');
		$.response.contentType = "application/json";	
		$.response.headers.set("Access-Control-Allow-Origin", "*");

	}

	catch(e)
	{
//		var fail = e.message.toLocaleString();
//		var fail1 = JSON.stringify(e.message);
		$.response.contentType = "application/json";
//		$.response.setBody('{"Fail": "'+fail+'"}');
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(JSON.stringify(e.message));
//		//$.response.setBody(e);

//		$.response.headers.set("Access-Control-Allow-Origin", "*");

		//$.response.contentType = "application/json";
		//$.response.setBody(e.message);
		//$.response.headers.set("Access-Control-Allow-Origin", "*");
		//$.response.

		//$.response.contentType = "text/plain";
		// $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		//$.response.setBody(JSON.stringify(e));

		conn.rollback();
	}


//insert();
//}




//For loop to get the item data
//for (i=0;i<sJSONBody.item.length;i++)
//{
//item.push(sJSONBody.item[i]);
//}


//var argsArray = [[3,"abc","23"], [4,"abc","23"]];







//$.response.contentType="application/json";
//$.response.setBody(sJSONBody);

//var tagsArray = $.request.parameters.get("item[]"); //---------> I think this is where the issue is

//var userId = $.request.parameters.get("userId");

//var conn = $.db.getConnection();

//try{

//for (var c = 0; c< tagsArray.length; c++){

////do something....

//}



//conn.commit();

////$.response.setBody('{test": "' + tagsArray + '"}');

//$.response.setBody('{"success": "true" }');

//$.response.headers.set("Access-Control-Allow-Origin", "*");

//$.response.contentType = "application/json";

//}catch(e){


////$.response.setBody('{test": "' + tagsArray + '"}');
//$.response.setBody('{"Fail": "' + objectId + '"}');

//$.response.headers.set("Access-Control-Allow-Origin", "*");

//$.response.contentType = "application/json";

//}