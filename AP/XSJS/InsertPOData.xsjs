
var POId="";
var Reqid = "";
var dummy = 0;//For the fields which are not mapped
var destination_package = "AP_Automation.AP.XSJS";
var destination_name = "inctureAWS";
$.response.contentType = "application/json";	

var pono = $.request.parameters.get('pono');
var Reqid = $.request.parameters.get('reqid');

if (pono == "" || pono == null)//Exit Further Processing and Return
{

	$.response.setBody('{"Error": "Purchase Order No Not found." }');

}

else
{//	=========================== Processing starts========================================

	try 
	{
		var dest = $.net.http.readDestination(destination_package, destination_name);
		var client = new $.net.http.Client();

//		=========================== Read PO Header Data Processing starts=====================

		var poHeader = new $.net.http.Request($.net.http.GET, "po_noSet('"+pono+"')/pono_header?$format=json"); 
		client.request(poHeader, dest);
		var poHeaderResponse = client.getResponse();  
		var POHeaderData = JSON.parse(poHeaderResponse.body.asString());
		//Check for NoData Found in PO . 
//		If No data found it should not execute the Items,History,GRN data also
		if(POHeaderData.d.results[0].PoNumber == "")
		{
			$.response.setBody('{"Error": "Data Not found for '+pono+'" }');
		}
		else //It means PO data is Read for OData Service from ECC
		{
//			=========================== PO Header Data
			POHeaderData = nullcheckForHeader(POHeaderData);
//			Get DB Connection
			var conn = $.hdb.getConnection();
			//Prepare PO Header Query
			var POHeaderQuery = "INSERT INTO \"AP\".\"AP_PO\" VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

			//Inserting For PO Header
			conn.executeUpdate(POHeaderQuery,
					getPOSeqId(),//ID
					dummy,//HAS_DELIVERY_CHARGES,
					Reqid,//POHeaderData.REQUEST_ID,
					POHeaderData.d.results[0].Vendor,
					POHeaderData.d.results[0].PoNumber,
					POHeaderData.d.results[0].Currency,
					POHeaderData.d.results[0].CompCode,
					POHeaderData.d.results[0].SupplVend,
					dummy,//POHeaderData.Has_DELIVERY_VENDOR,
					POHeaderData.d.results[0].CreatedBy,
					dummy,//POHeaderData.PLANNED_COST,
					dummy,//POHeaderData.HAS_GR,
					POHeaderData.d.results[0].DocDate,//POHeaderData.DOC_DATE,
					POHeaderData.d.results[0].exch_rate,//POHeaderData.EXCH_RATE,
					POHeaderData.d.results[0].CreatDate,//POHeaderData.CREAT_DATE,
					POHeaderData.d.results[0].Pmnttrms//POHeaderData.PMNTTRMS
			);

//			=========================== Read PO Item Data Processing starts=====================

			var poItem = new $.net.http.Request($.net.http.GET, "po_noSet('"+pono+"')/pono_items?$format=json"); 
			client.request(poItem, dest);
			var poItemResponse = client.getResponse();  
			var POItemData = JSON.parse(poItemResponse.body.asString());
			POItemData = nullCheckForLineItem(POItemData);


//			Prepare PO Item Query
			var POItemQuery = "INSERT INTO \"AP\".\"AP_PO_ITEM\" VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?," +
			"?,?,?,?,?,?,?,?,?)";
			var i=0;
			for (i = 0;i < POItemData.d.results.length; i++)
			{
				conn.executeUpdate(POItemQuery,
						getPOItemSeqId(),
						POItemData.d.results[i].Material,
						POItemData.d.results[i].PoItem,
						POItemData.d.results[i].Material,
						POItemData.d.results[i].PoUnit,
						dummy,
						POItemData.d.results[i].PriceUnit,
						POItemData.d.results[i].NET_PRICE,
						dummy,
						dummy,
						dummy,
						dummy,
						POItemData.d.results[i].PriceUnit,
						POItemData.d.results[i].NetWeight,
						POItemData.d.results[i].ConvNum1,
						dummy,
						POItemData.d.results[i].ShortText,
						POItemData.d.results[i].Quantity,
						POItemData.d.results[i].ConvDen1,
						dummy,
						POItemData.d.results[i].ItemCat,
						POItemData.d.results[i].VendMat,
						POId);


			}


//			=========================== Read PO History Data(GRN line items) Processing starts=====================

			var poHistory = new $.net.http.Request($.net.http.GET, "po_noSet('"+pono+"')/pono_history?$format=json"); 
			client.request(poHistory, dest);
			var poHistoryResponse = client.getResponse();  
			var poHistoryData = JSON.parse(poHistoryResponse.body.asString());
			poHistoryData = nullCheckForPoHistory(poHistoryData);		

//			Prepare PO History Query
			var POHistoryQuery = "INSERT INTO \"AP\".\"AP_GRN_LINE_ITEMS\" VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?," +
			"?,?,?)";
			var i=0;
			for (i = 0;i < poHistoryData.d.results.length; i++)
			{
				conn.executeUpdate(
						POHistoryQuery,
						getPOItemSeqId(),//Reused for History Data also
						poHistoryData.d.results[i].MatdocItm,
						poHistoryData.d.results[i].DocYear,
						poHistoryData.d.results[i].MatDoc,
						poHistoryData.d.results[i].Material,
						dummy,
						poHistoryData.d.results[i].IvvalFor,
						dummy,
						poHistoryData.d.results[i].ValForcur,
						dummy,
						poHistoryData.d.results[i].ValLoccur,
						poHistoryData.d.results[i].PoItem,
						dummy,
						poHistoryData.d.results[i].IvvalLoc,
						poHistoryData.d.results[i].Quantity,
						dummy,
						POId);
			}	

//			=========================== Read PO Total Data(GRN line items Totals) Processing starts=====================

			var poTotal = new $.net.http.Request($.net.http.GET, "po_noSet('"+pono+"')/pono_totals?$format=json"); 
			client.request(poTotal, dest);
			var poTotalResponse = client.getResponse();  
			var poTotalData = JSON.parse(poTotalResponse.body.asString());
			poTotalData = nullCheckForPoTotals(poTotalData);		

//			Prepare PO History Query
			var POTotalQuery = "INSERT INTO \"AP\".\"AP_GRN_ITEM_TOTALS\" VALUES (?,?,?,?,?,?,?,?,?)";
			var i=0;
			for (i = 0;i < poTotalData.d.results.length; i++)
			{
				conn.executeUpdate(
						POTotalQuery,
						getPOItemSeqId(),//Reused for History Data also
						poTotalData.d.results[i].DelivQty,
						poTotalData.d.results[i].ValIvFor,
						POId,//PO Header ID
						date(new Date()),
						poTotalData.d.results[i].PoPrQnt,
						poTotalData.d.results[i].IvQty,
						poTotalData.d.results[i].ValGrFor,
						poTotalData.d.results[i].PoItem
				);
			}			

			//			=========================== Commit starts========================================

			conn.commit();
			$.response.setBody('{"Success": "PO Data Posted Successfully." }');
			$.response.contentType = "application/json";	
			$.response.status = $.net.http.OK;
		} 

	}
	catch (e)
	{
		$.response.contentType = "application/json";
		$.response.setBody(e.message);
	}




}



//====================================================================
//========================Function Declaration========================
//====================================================================

//Generate PO Header Sequence ID
function getPOSeqId()
{
	if (POId == "")
	{
		var oConnection = $.db.getConnection();
		var oStatement = oConnection.prepareStatement("select AP.PO_SEQUENCE.NEXTVAL FROM DUMMY");
		var rs = oStatement.executeQuery();
		while (rs.next()) {
			POId = rs.getString(1);
		}
		return POId;
	}

}

//Generate PO Item Sequence ID
function getPOItemSeqId()
{
	var POItemID;
	var oConnection = $.db.getConnection();
	var oStatement = oConnection.prepareStatement("select AP.PO_SEQUENCE.NEXTVAL FROM DUMMY");
	var rs = oStatement.executeQuery();
	while (rs.next()) {
		POItemID = rs.getString(1);
	}
	return POItemID;


}

//Format JSON Body & Null check
function nullcheckForHeader(JsonBody)
{				

	JsonBody.d.results[0].Vendor = 	check(JsonBody.d.results[0].Vendor);
	JsonBody.d.results[0].PoNumber = 	check(JsonBody.d.results[0].PoNumber);
	JsonBody.d.results[0].Currency = 	check(JsonBody.d.results[0].Currency);
	JsonBody.d.results[0].CompCode = 	check(JsonBody.d.results[0].CompCode);
	JsonBody.d.results[0].SupplVend = 	check(JsonBody.d.results[0].SupplVend);
	JsonBody.d.results[0].CreatedBy = 	check(JsonBody.d.results[0].CreatedBy);
	JsonBody.d.results[0].DocDate =	check(JsonBody.d.results[0].DocDate);
	JsonBody.d.results[0].DocDate = date(eval('new ' + JsonBody.d.results[0].DocDate.replace(/\//g, '')));
	JsonBody.d.results[0].exch_rate =	check(JsonBody.d.results[0].exch_rate);
	JsonBody.d.results[0].CreatDate =	check(JsonBody.d.results[0].CreatDate);
	JsonBody.d.results[0].CreatDate = date(eval('new ' + JsonBody.d.results[0].CreatDate.replace(/\//g, '')));
	JsonBody.d.results[0].Pmnttrms =	check(JsonBody.d.results[0].Pmnttrms);


	return JsonBody;
}


function date(d)// YYYY-MM-DDThh:mm:ss
{
	var output;


	output = d.getFullYear() + '-' +
	('0' + (d.getMonth()+1)).slice(-2) + '-' +
	('0' +  d.getDate()).slice(-2) + 'T' +
	('0' +  d.getHours()).slice(-2) + ':' +
	('0' +  d.getMinutes()).slice(-2) + ':' +
	('0' +  d.getSeconds()).slice(-2);
	return output;
}
//Return 0 for WhiteSpace and null
function check(str)
{
	if(str == "" || str == null)
	{str = 0}
	return str;

}

//Format JSON Body & Null check
function nullCheckForLineItem(JsonBody)
{				
	var i=0;
	for ( i = 0;i < JsonBody.d.results.length; i++)
	{ 
		JsonBody.d.results[i].Material =	check(JsonBody.d.results[i].Material );
		JsonBody.d.results[i].PoItem =	check(JsonBody.d.results[i].PoItem );
		JsonBody.d.results[i].Material =	check(JsonBody.d.results[i].Material );
		JsonBody.d.results[i].PoUnit =	check(JsonBody.d.results[i].PoUnit );
		JsonBody.d.results[i].PriceUnit =	check(JsonBody.d.results[i].PriceUnit );
		JsonBody.d.results[i].NET_PRICE =	check(JsonBody.d.results[i].NET_PRICE );
		JsonBody.d.results[i].PriceUnit =	check(JsonBody.d.results[i].PriceUnit );
		JsonBody.d.results[i].NetWeight =	check(JsonBody.d.results[i].NetWeight );
		JsonBody.d.results[i].ConvNum1 =	check(JsonBody.d.results[i].ConvNum1 );
		JsonBody.d.results[i].ShortText =	check(JsonBody.d.results[i].ShortText );
		JsonBody.d.results[i].Quantity =	check(JsonBody.d.results[i].Quantity );
		JsonBody.d.results[i].ConvDen1 =	check(JsonBody.d.results[i].ConvDen1 );
		JsonBody.d.results[i].ItemCat =	check(JsonBody.d.results[i].ItemCat );
		JsonBody.d.results[i].VendMat =	check(JsonBody.d.results[i].VendMat );
	}



	return JsonBody;
}


//PO History null check
function nullCheckForPoHistory(JsonBody)
{

	var i=0;
	for ( i = 0;i < JsonBody.d.results.length; i++)
	{ 
		JsonBody.d.results[i].MatdocItm =	check(JsonBody.d.results[i].MatdocItm );
		JsonBody.d.results[i].DocYear =	check(JsonBody.d.results[i].DocYear );		
		JsonBody.d.results[i].MatDoc =	check(JsonBody.d.results[i].MatDoc );
		JsonBody.d.results[i].Material =	check(JsonBody.d.results[i].Material );
		JsonBody.d.results[i].IvvalFor =	check(JsonBody.d.results[i].IvvalFor );
		JsonBody.d.results[i].ValForcur =	check(JsonBody.d.results[i].ValForcur );
		JsonBody.d.results[i].ValLoccur =	check(JsonBody.d.results[i].ValLoccur );
		JsonBody.d.results[i].PoItem =	check(JsonBody.d.results[i].PoItem );
		JsonBody.d.results[i].IvvalLoc =	check(JsonBody.d.results[i].IvvalLoc );
		JsonBody.d.results[i].Quantity =	check(JsonBody.d.results[i].Quantity );

	}



	return JsonBody;


}

//PO History null check
function nullCheckForPoTotals(JsonBody)
{

	var i=0;
	for ( i = 0;i < JsonBody.d.results.length; i++)
	{ 
		JsonBody.d.results[i].DelivQty =	check(JsonBody.d.results[i].DelivQty );
		JsonBody.d.results[i].ValIvFor =	check(JsonBody.d.results[i].ValIvFor );		
		JsonBody.d.results[i].PoPrQnt =	check(JsonBody.d.results[i].PoPrQnt );
		JsonBody.d.results[i].IvQty =	check(JsonBody.d.results[i].IvQty );
		JsonBody.d.results[i].ValGrFor =	check(JsonBody.d.results[i].ValGrFor );
		JsonBody.d.results[i].PoItem =	check(JsonBody.d.results[i].PoItem );

	}

	return JsonBody;


}
