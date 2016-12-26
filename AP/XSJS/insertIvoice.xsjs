	var ReqBody = $.request.body.asString();
	var InvoiceId;
	ReqBody = JSON.parse(ReqBody);
	var ReqBody = nullcheck(ReqBody);
	var statement= null;
	$.trace.debug("request path: " + $.request.path);
// var strQuery = "INSERT INTO \"AP\".\"AP_INVOICE_LINE_ITEMS\" VALUES
// (AP.INVOICE_SEQUENCE.NEXTVAL,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?," +
		var j=0;															
		var strQuery = "INSERT INTO \"AP\".\"AP_INVOICE_LINE_ITEMS\" VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?," +
		"?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		var conn = $.hdb.getConnection();
		
		try{
			for (j = 0;j < ReqBody.item.length; j++)
			{
			
				
// For loop to get the item data
			conn.executeUpdate(
					strQuery,
					getInvoiceSequenceId(),
					ReqBody.item[j].HEADER_CHARGES,
					ReqBody.item[j].INVOICE_ITEM_ID,
					ReqBody.item[j].QUANTITY_PRICE_MESSAGE,
					ReqBody.item[j].AMOUNT_DIFFERENCE,
					ReqBody.item[j].UNIT_PRICE,
					ReqBody.item[j].VAT_VALUE,
					ReqBody.item[j].DATE_UPDATED,
					ReqBody.item[j].MODE,
					ReqBody.item[j].UOM,
					ReqBody.item[j].DESCRIPTION_MISMATCH,
					ReqBody.item[j].UPSC_MISMATCH,
					ReqBody.item[j].QUANTITY,
					ReqBody.item[j].DISCOUNT_VALUE,
					ReqBody.item[j].TWO_WAY_MATCHING_FLAG,
					ReqBody.item[j].VENDOR_MATERIAL,
					ReqBody.item[j].PO_UPC_CODE,
					ReqBody.item[j].PO_MATCHING_NO_ID,
					ReqBody.item[j].TWO_WAY_MATCHING_PERCENTAGE,
					ReqBody.item[j].PO_MATCHING_ITEM_NO_ID,
					ReqBody.item[j].MATERIAL_DESCRIPTION,
					ReqBody.item[j].GL_CODING,
					ReqBody.item[j].MATERIAL_LINE,
					ReqBody.item[j].REQUEST_ID,
					ReqBody.item[j].THREEWAY_MATCHING_FLAG,
					ReqBody.item[j].NET_PRICE,
					ReqBody.item[j].USER_UPDATED,
					ReqBody.item[j].MATERIAL,
					ReqBody.item[j].VENDOR_MATERIAL_ID,
					ReqBody.item[j].HAS_SOME_GR_FLAG,
					ReqBody.item[j].PARTIAL_POST,
					ReqBody.item[j].USER_CREATED,
					ReqBody.item[j].NET_WORTH,
					ReqBody.item[j].HAS_ERROR_FLAG,
					ReqBody.item[j].UPC_CODE,
					ReqBody.item[j].INVOICE_PO_NUMBER,
					ReqBody.item[j].DATE_CREATED,
					ReqBody.item[j].MATCHING_PO_NUMBER,
					ReqBody.item[j].COMMENT,
					ReqBody.item[j].UNIT_PRICE_MISMATCH,
					ReqBody.item[j].INV_HEADER_ID
			);
			}
			conn.commit();
			$.response.setBody('{"success": "true" }');
			$.response.contentType = "application/json";	
			$.response.headers.set("Access-Control-Allow-Origin", "*");
	}catch(e){
		$.response.contentType = "application/json";
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(JSON.stringify(e.message));
		conn.rollback();
	}

	
// ====================================================================
// ========================Function
// Declaration==============================
// ====================================================================

	// Format JSON Body & Null check
	function nullcheck(JsonBody)
	{				
		var i=0;
		for ( i = 0;i < JsonBody.item.length; i++)
		{ 
			
			if (JsonBody.item[i].HEADER_CHARGES	== "") {JsonBody.item[i].HEADER_CHARGES	= 0;}
			if (JsonBody.item[i].INVOICE_ITEM_ID== "") {JsonBody.item[i].INVOICE_ITEM_ID= 0;}
			if (JsonBody.item[i].QUANTITY_PRICE_MESSAGE	== "") {JsonBody.item[i].QUANTITY_PRICE_MESSAGE	= 0;}
			if (JsonBody.item[i].AMOUNT_DIFFERENCE	== "") {JsonBody.item[i].AMOUNT_DIFFERENCE	= 0;}
			if (JsonBody.item[i].UNIT_PRICE	== "") {JsonBody.item[i].UNIT_PRICE	= 0;}
			if (JsonBody.item[i].VAT_VALUE	== "") {JsonBody.item[i].VAT_VALUE	= 0;}
			if (JsonBody.item[i].DATE_UPDATED	== "") {JsonBody.item[i].DATE_UPDATED	= date();}
			if (JsonBody.item[i].MODE	== "") {JsonBody.item[i].MODE	= 0;}
			if (JsonBody.item[i].UOM	== "") {JsonBody.item[i].UOM	= 0;}
			if (JsonBody.item[i].DESCRIPTION_MISMATCH	== "") {JsonBody.item[i].DESCRIPTION_MISMATCH	= 0;}
			if (JsonBody.item[i].UPSC_MISMATCH	== "") {JsonBody.item[i].UPSC_MISMATCH	= 0;}
			if (JsonBody.item[i].QUANTITY	== "") {JsonBody.item[i].QUANTITY	= 0;}
			if (JsonBody.item[i].DISCOUNT_VALUE	== "") {JsonBody.item[i].DISCOUNT_VALUE	= 0;}
			if (JsonBody.item[i].TWO_WAY_MATCHING_FLAG	== "") {JsonBody.item[i].TWO_WAY_MATCHING_FLAG	= 0;}
			if (JsonBody.item[i].VENDOR_MATERIAL	== "") {JsonBody.item[i].VENDOR_MATERIAL	= 0;}
			if (JsonBody.item[i].PO_UPC_CODE	== "") {JsonBody.item[i].PO_UPC_CODE	= 0;}
			if (JsonBody.item[i].PO_MATCHING_NO_ID	== "") {JsonBody.item[i].PO_MATCHING_NO_ID	= 0;}
			if (JsonBody.item[i].TWO_WAY_MATCHING_PERCENTAGE	== "") {JsonBody.item[i].TWO_WAY_MATCHING_PERCENTAGE	= 0;}
			if (JsonBody.item[i].PO_MATCHING_ITEM_NO_ID	== "") {JsonBody.item[i].PO_MATCHING_ITEM_NO_ID	= 0;}
			if (JsonBody.item[i].MATERIAL_DESCRIPTION	== "") {JsonBody.item[i].MATERIAL_DESCRIPTION	= 0;}
			if (JsonBody.item[i].GL_CODING	== "") {JsonBody.item[i].GL_CODING	= 0;}
			if (JsonBody.item[i].MATERIAL_LINE	== "") {JsonBody.item[i].MATERIAL_LINE	= 0;}
			if (JsonBody.item[i].REQUEST_ID	== "") {JsonBody.item[i].REQUEST_ID	= 0;}
			if (JsonBody.item[i].THREEWAY_MATCHING_FLAG	== "") {JsonBody.item[i].THREEWAY_MATCHING_FLAG	= 0;}
			if (JsonBody.item[i].NET_PRICE	== "") {JsonBody.item[i].NET_PRICE	= 0;}
			if (JsonBody.item[i].USER_UPDATED	== "") {JsonBody.item[i].USER_UPDATED	= 0;}
			if (JsonBody.item[i].MATERIAL	== "") {JsonBody.item[i].MATERIAL	= 0;}
			if (JsonBody.item[i].VENDOR_MATERIAL_ID	== "") {JsonBody.item[i].VENDOR_MATERIAL_ID	= 0;}
			if (JsonBody.item[i].HAS_SOME_GR_FLAG	== "") {JsonBody.item[i].HAS_SOME_GR_FLAG	= 0;}
			if (JsonBody.item[i].PARTIAL_POST	== "") {JsonBody.item[i].PARTIAL_POST	= 0;}
			if (JsonBody.item[i].USER_CREATED	== "") {JsonBody.item[i].USER_CREATED	= 0;}
			if (JsonBody.item[i].NET_WORTH	== "") {JsonBody.item[i].NET_WORTH	= 0;}
			if (JsonBody.item[i].HAS_ERROR_FLAG	== "") {JsonBody.item[i].HAS_ERROR_FLAG	= 0;}
			if (JsonBody.item[i].UPC_CODE	== "") {JsonBody.item[i].UPC_CODE	= 0;}
			if (JsonBody.item[i].INVOICE_PO_NUMBER	== "") {JsonBody.item[i].INVOICE_PO_NUMBER	= 0;}
			if (JsonBody.item[i].DATE_CREATED	== "") {
				JsonBody.item[i].DATE_CREATED	= date();
				}
			if (JsonBody.item[i].MATCHING_PO_NUMBER	== "") {JsonBody.item[i].MATCHING_PO_NUMBER	= 0;}
			if (JsonBody.item[i].COMMENT	== "") {JsonBody.item[i].COMMENT	= 0;}
			if (JsonBody.item[i].UNIT_PRICE_MISMATCH	== "") {JsonBody.item[i].UNIT_PRICE_MISMATCH	= 0;}
			if (JsonBody.item[i].INV_HEADER_ID	== "") {JsonBody.item[i].INV_HEADER_ID	= 0;}
			
			
		}
	
	
		
		return JsonBody;
	}
	
	var output;
	function date()// YYYY-MM-DDThh:mm:ss
	{
		var d = new Date();
				
		output = d.getFullYear() + '-' +
		('0' + (d.getMonth()+1)).slice(-2) + '-' +
		('0' +  d.getDate()).slice(-2) + 'T' +
		('0' +  d.getHours()).slice(-2) + ':' +
		('0' +  d.getMinutes()).slice(-2) + ':' +
		('0' +  d.getSeconds()).slice(-2);
		return output;
	}


function getInvoiceSequenceId1()
{
	if (InvoiceId == null)
	{
		var oConnection = $.db.getConnection();
		var oStatement = oConnection
				.prepareStatement("select AP.INVOICE_SEQUENCE.NEXTVAL FROM DUMMY");
		var rs = oStatement.executeQuery();
		while (rs.next()) {
			InvoiceId = rs.getString(1);
		}
		return InvoiceId;
	}

}


function getInvoiceSequenceId()
{
		var oConnection = $.db.getConnection();
		var oStatement = oConnection
				.prepareStatement("select AP.INVOICE_SEQUENCE.NEXTVAL FROM DUMMY");
		var rs = oStatement.executeQuery();
		while (rs.next()) {
			InvoiceId = rs.getString(1);
		}
		return InvoiceId;

}



// insert into "AP"."AP_INVOICE_DETAIL"
// values('23',2,3,4,5,'','','','','',11,12,13,14,15,
// '',17,18,'','',21,'',22,'','',25,'',27,'',29,'',31,'',33,'','',37)
// insert into "AP"."AP_INVOICE_DETAIL"
// values('25',0,0,0,0,'','19.12.2016','','','',0,0,
// 0,0,0,'',0,0,'','',0,'',0,'','',0,'',0,'',0,'',0,'',0,'','',0)
