function main() {
var x = document.evaluate('//p[text()="WOHNUNG"]',document,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
var done = [];
for(var i=0; i < x.snapshotLength; i++ ){
	let id = x.snapshotItem(i).nextSibling.nextSibling.nextSibling;
	let adress = id.innerText;
	let zip_code = adress.match(/[\d]{4}\s/i)[0].trim();
	let city = adress.match(/[\d]{4}\s.+/i)[0].replace(zip_code,"").trim();
	let street_number = adress.replace(zip_code,"").replace(city,"").replace(",","").trim();

	if (street_number !== '') {
      let house_number = "0";
      if(/[0-9]/.test(street_number)) {
        house_number = street_number.match(/(?=\w)\w[0-9A-za-z]{0,}$/)[0].trim();
      }
      let street = street_number.replace(house_number,"").trim();

      let iseligible = ({
        id,
        address: {
          city: city,
          house_number: house_number,
          language: "EN",
          new_order: true,
          street: street,
          zip_code: zip_code
        }
      });

//      iseligible.id.append("<img id='_"+Math.floor(Math.random() * 10)+"_' width='20px' style='margin-left:5px' src='"+ chrome.extension.getURL("images/loading.png") +"'></img>");

      chrome.extension.sendRequest({title: 'showResponse', homes: iseligible},
      function(response){

        //response.id.remove();
		console.log(respone);

        if(response.init7.fiber7 === true){
          $("div[data-id="+response.id+"]")
            .find(".header")
            .append("<img width='20px' style='margin-left:5px' src='"+ chrome.extension.getURL("images/Init7_logo.png") +"'></img>");
        }
        if(response.salt.valid === true){
          $("div[data-id="+response.id+"]")
            .find(".header")
            .append("<img width='20px' style='margin-left:5px' src='"+ chrome.extension.getURL("images/salt_logo.png") +"'></img>");
        }

        if(response.salt.valid === false && response.init7.fiber7 === false) {
 
          if(response.init7.vdsl){
            $("div[data-id="+response.id+"]")
              .find(".header")
            .append("<p style='font-size:0.6em'>Init7 VDSL:"+ response.init7.vdsl_down +"/"+ response.init7.vdsl_up +"</p>");
          } else {
          $("div[data-id="+response.id+"]")
            .find(".header")
            .append("<img width='20px' style='margin-left:5px' src='"+ chrome.extension.getURL("images/slow.png") +"'></img>");
          }
        }
      });
    }
  }
}

main();
