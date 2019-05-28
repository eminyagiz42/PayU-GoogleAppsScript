
var merchant,timeStamp,signature,date,url,keyset,startDate,endDate,secretkey;
  var url;
  //"https://secure.payu.com.tr/reports/orders";
  var Secret_KEY = "Your-secret-key";
  var JSONObject; //Payu Respond 
  var OrderStatus; // Sipariş Statü
  var Client; // Müşteri Adı-Soyadı
  var OrderDate; //Sipariş Tarihi
  var Email; // Müşteri Email
  var Bank; // Banka Adı
  var Phone; // Telefon
  var GeneralTotal; //Sipariş Tutarı
  var Currency; //Para Birimi
  var OrderTotal; // 189.99 TRY 
  var DateTime;
  var values; // Sipariş Bilgiler Array
  
  /** 
  * siparis Numarasıyla Payu'da Arama Yapabilirsin
  * @return values
  * @param {string} OrderNo Sipariş No
  * @customfunction 
  */
  function payuOrder(OrderNo) {
      if(OrderNo == null || OrderNo == undefined ){
      return  "Sipariş No Yazınız";
      }else if(typeof OrderNo !== 'string'){
       return "Tırnaklı Yazınız";
      }else if(OrderNo.substring(0,2) == 56 && OrderNo.length == 10){ 
         JSONObject = payu(OrderNo);
        
          OrderStatus = JSONObject.data[0]['Order status']; 
          Client = JSONObject.data[0]['Delivery Client'];
          OrderDate = JSONObject.data[0]['Order Date'];
    
          Email = JSONObject.data[0].Email;
          Phone = JSONObject.data[0].Phone; 
          GeneralTotal = JSONObject.data[0]['General Total'];
          Currency = JSONObject.data[0]['Currency'];
          OrderTotal = GeneralTotal+" "+ Currency;
          Bank = JSONObject.data[0]['Issuer Bank'];
    
          values = [[OrderNo,
                     OrderStatus,
                     OrderDate,
                     Client,
                     Email,
                     Phone,
                     "***",
                     OrderTotal,
                     Bank]];
          return values;
      }else{
      return "Sipariş No Yazınız";
      }
     }

  function payu(externalRefNo) {
      merchant = "Your-Merchant-Name";
      date = new Date();
      endDate = Utilities.formatDate(date, "GMT","yyyy-MM-dd");
      startDate = Utilities.formatDate(new Date(new Date().setDate(new Date().getDate() - 15)), "GMT", "yyyy-MM-dd");
      timeStamp = Math.floor((date.getTime()/1000)).toString();
      //16MERCHANTNAME102018-12-01102018-12-02101552028499
      keyset = merchant.length+merchant+startDate.length+startDate+endDate.length+endDate+timeStamp.length+timeStamp+externalRefNo.length+externalRefNo;
      Logger.log(keyset);
      signature = Encrypt(keyset,Secret_KEY);
      url = "https://secure.payu.com.tr/reports/orders?merchant="+merchant+"&startDate="+startDate+"&endDate="+endDate+"&timeStamp="+timeStamp+"&signature="+signature+"&externalRefNo="+externalRefNo;              
      var fetch = UrlFetchApp.fetch(url).getContentText();
      JSONObject = JSON.parse(fetch);
      //Logger.log(JSONObject.data[0]);
    return JSONObject;
  }
   //Convert from Byte[] Array to String
  function Encrypt(Keyset,Secretkey) {
  signature = Utilities.computeHmacSignature(Utilities.MacAlgorithm.HMAC_MD5,Keyset,Secretkey);
  var signatureStr = '';
      for (i = 0; i < signature.length; i++) {
        var byte = signature[i];
        if (byte < 0)
           byte += 256;
        var byteStr = byte.toString(16);
        if (byteStr.length == 1) byteStr = '0'+byteStr;
        signatureStr += byteStr;
         }   
    return signatureStr;
  }
