var ReqBody = $.request.body.asString();
var InvoiceId;
var InvoiceItemId;
var RequestId = "";
ReqBody = JSON.parse(ReqBody);
ReqBody = nullcheckForHeader(ReqBody);
ReqBody = nullCheckForLineItem(ReqBody);
$.trace.debug("request path: " + $.request.path);
//var strQuery = "INSERT INTO \"AP\".\"AP_INVOICE_DETAIL\" VALUES
//(AP.INVOICE_SEQUENCE.NEXTVAL,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?," +
//"?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

var invoiceHeaderQuery = "INSERT INTO \"AP\".\"AP_INVOICE_DETAIL\" VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?," +
"?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
var conn = $.hdb.getConnection();



try{
//	Inserting For Header
	conn.executeUpdate(
			invoiceHeaderQuery,
			getInvoiceSequenceId(),
			ReqBody.TOTAL,
			ReqBody.DISCREPENCY_FLAG,
			ReqBody.INVOICE_HEADER_CHARGES,
			ReqBody.FREIGHT_PERCENTAGE,
			ReqBody.TAX_INDICATOR,
			ReqBody.INVOICE_DATE,
			ReqBody.PAYMENT_BLOCK,
			ReqBody.BASE_LINE_DATE,
			ReqBody.CURRENCY,
			ReqBody.PO_STORAGE,
			ReqBody.PO_FREIGHT,
			ReqBody.PLANNED_COST,
			ReqBody.SUBTOTAL,
			ReqBody.FEE_PERCENTAGE,
			ReqBody.DELIVARY_DATE,
			ReqBody.HAS_UNPLANNED_COST,
			ReqBody.PO_SURCHARGE,
			ReqBody.HEADER_PATTERN_MATCHING_FLAG,
			ReqBody.POSTING_DATE,
			ReqBody.TOTOAL_DISCOUNT,
			ReqBody.VENDOR_NAME,
			ReqBody.TOTAL_INVOICE_AMOUNT,
			getRequestId(),//ReqBody.REQUEST_ID,
			ReqBody.INVOICE_NUMBER,
			ReqBody.SURCHARGE,
			ReqBody.VENDOR_ID,
			ReqBody.NET_DIFFERENCE_HEADER_CHARGES,
			ReqBody.COMPANY_CODE,
			ReqBody.PO_IMPORT_FEE,
			ReqBody.PURCHASE_ORDER_REFERENCE,
			ReqBody.IMPORT_FEES,
			ReqBody.ROUTE,
			ReqBody.FREIGHT,
			ReqBody.PAYMENT_TERM,
			ReqBody.PAYMENT_METHOD,
			ReqBody.STORAGE
	);

//	Insert for Line Item

	var invoiceLineItemQuery = "INSERT INTO \"AP\".\"AP_INVOICE_LINE_ITEMS\" VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?," +
	"?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
//	var conn = $.hdb.getConnection();
	var j=0;															

	// For loop to get the item data
//	try{
	for (j = 0;j < ReqBody.item.length; j++)
	{
		conn.executeUpdate(
				invoiceLineItemQuery,
				getInvoiceSeqIdLItem(),
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
				getRequestId(),//ReqBody.item[j].REQUEST_ID,
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
				InvoiceId
				//ReqBody.item[j].INV_HEADER_ID
		);
	}		

//	End

	conn.commit();
	//$.response.setBody('{"Success": "Invoice Posted Successfully." }');
	$.response.setBody(JSON.stringify(
			{
				"Success": "Invoice Posted Sucessfully.", 
				"Request Id": RequestId, 
				"Vendor No": ReqBody.VENDOR_ID, 
				"Invoice No": ReqBody.INVOICE_NUMBER
			}
	));
	$.response.contentType = "application/json";	
	$.response.headers.set("Access-Control-Allow-Origin", "*");

}catch(e){
	$.response.contentType = "application/json";
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	$.response.setBody(JSON.stringify(e.message));
	conn.rollback();
}


//=====================================================================================================
//====================================Function
//Declaration=============================================
//=====================================================================================================

// Format JSON Body & Null check
function nullcheckForHeader(JsonBody)
{				
	if (JsonBody.ID	== "") {JsonBody.ID	= 0;}
	if (JsonBody.TOTAL	== "") {JsonBody.TOTAL	= 0;}
	if (JsonBody.DISCREPENCY_FLAG	== "") {JsonBody.DISCREPENCY_FLAG	= 0;}
	if (JsonBody.INVOICE_HEADER_CHARGES	== "") {JsonBody.INVOICE_HEADER_CHARGES	= 0;}
	if (JsonBody.FREIGHT_PERCENTAGE	== "") {JsonBody.FREIGHT_PERCENTAGE	= 0;}
	if (JsonBody.TAX_INDICATOR	== "") {JsonBody.TAX_INDICATOR	= 0;}
	if (JsonBody.INVOICE_DATE	== "") {JsonBody.INVOICE_DATE	= date();}
	if (JsonBody.PAYMENT_BLOCK	== "") {JsonBody.PAYMENT_BLOCK	= 0;}
	if (JsonBody.BASE_LINE_DATE	== "") {JsonBody.BASE_LINE_DATE	= date();}
	if (JsonBody.CURRENCY	== "") {JsonBody.CURRENCY	= 0;}
	if (JsonBody.PO_STORAGE	== "") {JsonBody.PO_STORAGE	= 0;}
	if (JsonBody.PO_FREIGHT	== "") {JsonBody.PO_FREIGHT	= 0;}
	if (JsonBody.PLANNED_COST	== "") {JsonBody.PLANNED_COST	= 0;}
	if (JsonBody.SUBTOTAL	== "") {JsonBody.SUBTOTAL	= 0;}
	if (JsonBody.FEE_PERCENTAGE	== "") {JsonBody.FEE_PERCENTAGE	= 0;}
	if (JsonBody.DELIVARY_DATE	== "") {JsonBody.DELIVARY_DATE	= date();}
	if (JsonBody.HAS_UNPLANNED_COST	== "") {JsonBody.HAS_UNPLANNED_COST	= 0;}
	if (JsonBody.PO_SURCHARGE	== "") {JsonBody.PO_SURCHARGE	= 0;}
	if (JsonBody.HEADER_PATTERN_MATCHING_FLAG	== "") {JsonBody.HEADER_PATTERN_MATCHING_FLAG	= 0;}
	if (JsonBody.POSTING_DATE	== "") {JsonBody.POSTING_DATE	= date();}
	if (JsonBody.TOTOAL_DISCOUNT	== "") {JsonBody.TOTOAL_DISCOUNT	= 0;}
	if (JsonBody.VENDOR_NAME	== "") {JsonBody.VENDOR_NAME	= 0;}
	if (JsonBody.TOTAL_INVOICE_AMOUNT	== "") {JsonBody.TOTAL_INVOICE_AMOUNT	= 0;}
	if (JsonBody.REQUEST_ID	== "") {JsonBody.REQUEST_ID	= 0;}
	if (JsonBody.INVOICE_NUMBER	== "") {JsonBody.INVOICE_NUMBER	= 0;}
	if (JsonBody.SURCHARGE	== "") {JsonBody.SURCHARGE	= 0;}
	if (JsonBody.VENDOR_ID	== "") {JsonBody.VENDOR_ID	= 0;}
	if (JsonBody.NET_DIFFERENCE_HEADER_CHARGES	== "") {JsonBody.NET_DIFFERENCE_HEADER_CHARGES	= 0;}
	if (JsonBody.COMPANY_CODE	== "") {JsonBody.COMPANY_CODE	= 0;}
	if (JsonBody.PO_IMPORT_FEE	== "") {JsonBody.PO_IMPORT_FEE	= 0;}
	if (JsonBody.PURCHASE_ORDER_REFERENCE	== "") {JsonBody.PURCHASE_ORDER_REFERENCE	= 0;}
	if (JsonBody.IMPORT_FEES	== "") {JsonBody.IMPORT_FEES	= 0;}
	if (JsonBody.ROUTE	== "") {JsonBody.ROUTE	= 0;}
	if (JsonBody.FREIGHT	== "") {JsonBody.FREIGHT	= 0;}
	if (JsonBody.PAYMENT_TERM	== "") {JsonBody.PAYMENT_TERM	= 0;}
	if (JsonBody.PAYMENT_METHOD	== "") {JsonBody.PAYMENT_METHOD	= 0;}
	if (JsonBody.STORAGE	== "") {JsonBody.STORAGE	= 0;}	

	return JsonBody;
}


// ====================================================================
// ========================Function Declaration==============================
// ====================================================================

// Format JSON Body & Null check
function nullCheckForLineItem(JsonBody)
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
		if (JsonBody.item[i].DATE_CREATED	== "") {JsonBody.item[i].DATE_CREATED	= date();}
		if (JsonBody.item[i].MATCHING_PO_NUMBER	== "") {JsonBody.item[i].MATCHING_PO_NUMBER	= 0;}
		if (JsonBody.item[i].COMMENT	== "") {JsonBody.item[i].COMMENT	= 0;}
		if (JsonBody.item[i].UNIT_PRICE_MISMATCH	== "") {JsonBody.item[i].UNIT_PRICE_MISMATCH	= 0;}
		if (JsonBody.item[i].INV_HEADER_ID	== "") {JsonBody.item[i].INV_HEADER_ID	= 0;}
	}



	return JsonBody;
}


function date()// YYYY-MM-DDThh:mm:ss
{
	var d = new Date();
	var output;		
	output = d.getFullYear() + '-' +
	('0' + (d.getMonth()+1)).slice(-2) + '-' +
	('0' +  d.getDate()).slice(-2) + 'T' +
	('0' +  d.getHours()).slice(-2) + ':' +
	('0' +  d.getMinutes()).slice(-2) + ':' +
	('0' +  d.getSeconds()).slice(-2);
	return output;
}


function getInvoiceSequenceId()
{
	if (InvoiceId == null)
	{
		var oConnection = $.db.getConnection(); 
		var oStatement = oConnection.prepareStatement("select AP.INVOICE_SEQUENCE.NEXTVAL FROM DUMMY"); 
		var rs = oStatement.executeQuery();	
		while (rs.next()) {InvoiceId= rs.getString(1);};	
		return InvoiceId;
	}

	else
	{
		return InvoiceId;
	}

}


//function getInvoiceSeqIdHeader()
//{
//	if (InvoiceId == null)
//	{
//		var oConnection = $.db.getConnection();
//		var oStatement = oConnection.prepareStatement("select AP.INVOICE_SEQUENCE.NEXTVAL FROM DUMMY");
//		var rs = oStatement.executeQuery();
//		while (rs.next()) {
//			InvoiceId = rs.getString(1);
//		}
//		return InvoiceId;
//	}
//
//}


function getRequestId()
{
	if (RequestId == "")
	{
		var oConnection = $.db.getConnection();
		var oStatement = oConnection.prepareStatement("select AP.REQUESTID_SEQ.NEXTVAL FROM DUMMY");
		var rs = oStatement.executeQuery();
		while (rs.next()) 
		{
			RequestId = rs.getString(1);
		}
		RequestId = 'AP' + RequestId;


	}
	return RequestId;

}



function getInvoiceSeqIdLItem()
{
	var oConnection = $.db.getConnection();
	var oStatement = oConnection
	.prepareStatement("select AP.INVOICE_SEQUENCE.NEXTVAL FROM DUMMY");
	var rs = oStatement.executeQuery();
	while (rs.next()) {
		InvoiceItemId = rs.getString(1);
	}
	return InvoiceItemId;

}


