// ==UserScript==
// @name         Stocks in One Basket
// @author       Flutterz
// @description  Displays stocks owned on stock bargain page
// @match        https://www.neopets.com/stockmarket.phtml?type=portfolio
// @match        https://www.neopets.com/stockmarket.phtml?type=list&search=%&bargain=true
// ==/UserScript==

const stocks = ["AAVL","ACFI","BB","BOTT","BUZZ","CHIA","CHPS","COFL","CYBU","DROO","EEEEE","FAER","FISH","HELT","HUW","KAUF","KBAT","KSON","LDSC","LUPE","MPC","MYNC","NAKR","NATN","PDSS","PEOP","POWR","SHRX","SKBD","SKEI","SMUG","SSS","STFP","SWNC","TAG","TNAH","TNPT","TPEG","TPP","TSRC","UNIB","VPTS","YIPP"];

function inURL(substr) {
    return document.URL.includes(substr);
}

function fetchAmount(){
    var bobby = document.getElementsByTagName("tr");
    var stockRecord = [];
    for (let i = 0; i < bobby.length; i++) {
        var boop = bobby[i].innerHTML.toString().indexOf("onclick=\"disclose");
        if (boop == 65){
            var nameIndex = bobby[i].innerHTML.toString().indexOf("?type=buy&amp;ticker=")+21;
            var stockName = bobby[i].innerHTML.toString().substring(nameIndex,nameIndex+5);
            if (stockName.indexOf("\"")>-1) stockName = stockName.substring(0,stockName.indexOf("\""));
            var priceIndex = bobby[i].innerHTML.toString().indexOf("td align=\"center")+18;
            var stockAmount = bobby[i].innerHTML.toString().substring(priceIndex);
            priceIndex = stockAmount.indexOf("td align=\"center")+18;
            stockAmount = stockAmount.substring(priceIndex);
            priceIndex = stockAmount.indexOf("td align=\"center")+18;
            stockAmount = stockAmount.substring(priceIndex);
            priceIndex = stockAmount.indexOf("td align=\"center")+18;
            stockAmount = stockAmount.substring(priceIndex);
            priceIndex = stockAmount.indexOf("td align=\"center")+18;
            stockAmount = stockAmount.substring(priceIndex);
            priceIndex = stockAmount.indexOf("td align=\"center")+19;
            stockAmount = stockAmount.substring(priceIndex);
            priceIndex = stockAmount.indexOf("\t");
            stockAmount = stockAmount.substring(0,priceIndex).replace(",","");
            stockRecord[stocks.indexOf(stockName)]=stockAmount;
        }
    }
   window.localStorage.setItem('stockCount', stockRecord);
}

function postAmount(){
    var stockRecord = [];
    var i = 0;
    var inRecord = window.localStorage.getItem('stockCount');
    while (inRecord.indexOf(",")>-1){
        stockRecord[i] = parseInt(inRecord.substring(0,inRecord.indexOf(",")));
        inRecord = inRecord.substring(inRecord.indexOf(",")+1);
        i++;
    }
    stockRecord[i] = parseInt(inRecord);
    var bobby = document.getElementsByTagName("tr");
    var skip = true;
    for (let j = 0; j < bobby.length; j++) {
        var boop = bobby[j].innerHTML.toString().indexOf("?type=profile&amp;company");

        if (boop > -1){
            if (skip){
                skip = false;
            } else {
                var nameIndex = bobby[j].innerHTML.toString().indexOf("?type=profile&amp;company")+21;
                var stockName = bobby[j].innerHTML.toString().substring(nameIndex,nameIndex+20);
                stockName = stockName.substring(stockName.indexOf("\">")+5);
                if (stockName.indexOf("<")>-1){
                    stockName = stockName.substring(0,stockName.indexOf("<"));
                }
                var volumeIndex = bobby[j].innerHTML.toString().indexOf("\" align=")+17;
                var volumeTemp = bobby[j].innerHTML.toString().substring(volumeIndex);
                var volumeIndex2 = volumeTemp.indexOf("<");
                var repVolume = bobby[j].innerHTML.toString().substring(volumeIndex-3,volumeIndex+volumeIndex2+3);
                var newVolume = stockRecord[stocks.indexOf(stockName)];
                if (isNaN(newVolume)){
                    bobby[j].innerHTML = bobby[j].innerHTML.replace(repVolume,"r\">Owned<br><b>0</b></t");
                } else {
                    bobby[j].innerHTML = bobby[j].innerHTML.replace(repVolume,"r\">Owned<br><b>"+newVolume+"</b></t");
                }
                var repLow = volumeTemp.substring(93);
                repLow = repLow.substring(repLow.indexOf("<b>"));
                var repLow2 = repLow.substring(3);
                var repPrice = repLow.substring(3,repLow.indexOf("</b>"));
                if (repPrice!=15) {
                    bobby[j].innerHTML = bobby[j].innerHTML.replace(repLow,repLow2);
                }

            }

        }

    }

}

function mainLoad(){
    if (inURL("bargain=true")){
        postAmount();
    } else {
        fetchAmount();
    }
}

mainLoad();