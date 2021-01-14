function main(newobject) {
	let id = newobject.parentElement.parentElement;
	let adress = id.innerText;
	let zip_code = adress.match(/[\d]{4}\s/i)[0].trim();
	let city = adress.match(/[\d]{4}\s.+/i)[0].replace(zip_code,"").trim();
	let street_number = adress.replace(zip_code,"").replace(city,"").replace(",","").trim();

	if (street_number !== '') {
      let house_number = "0";
      if(street_number !== null && /[0-9]/.test(street_number)) {
        try {
			house_number = street_number.match(/(?=\w)\w[0-9A-za-z]{0,}$/)[0].trim();
	}catch{
		house_number = "0";
	}
      }
      let street = street_number.replace(house_number,"").trim();

      let iseligible = ({
	 id,
        id_find: btoa(street.replaceAll(" ","_")+house_number.replaceAll(" ","_")),
        address: {
          city: city,
          house_number: house_number,
          language: "EN",
          new_order: true,
          street: street,
          zip_code: zip_code
        }
      });

      iseligible.id.insertAdjacentHTML('beforeend'," <br /> <img id='"+iseligible.id_find+"' width='20px' style='margin-left:5px' src='"+ chrome.extension.getURL("images/loading.png") +"'></img>");

      chrome.extension.sendRequest({title: 'showResponse', homes: iseligible},
      function(response){
        if(response.init7.fiber7 === true){
	   document.getElementById(response.id).insertAdjacentHTML("afterend"," <img width='20px' style='margin-left:5px' src='"+ chrome.extension.getURL("images/Init7_logo.png") +"'></img>");
        }
        if(response.salt.valid === true){
	   document.getElementById(response.id).insertAdjacentHTML("afterend","<img width='20px' style='margin-left:5px' src='"+ chrome.extension.getURL("images/salt_logo.png") +"'></img>");
        }

        if(response.init7.vdsl) {
			document.getElementById(response.id).insertAdjacentHTML("afterend","<p style='font-size:0.6em'>Init7 VDSL:"+ response.init7.vdsl_down +"/"+ response.init7.vdsl_up +"</p>");
          }

	document.getElementById(response.id).remove(); 
     });
   }
  }

var observer = new WebKitMutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		if(mutation.addedNodes.length > 0) {
			if(mutation.addedNodes[0].tagName === 'DIV'){
				var xpath = document.evaluate(".//*[local-name() = 'svg' and @data-icon='map-marker-alt']",mutation.addedNodes[0],null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);
				if(xpath.singleNodeValue !== null && xpath.singleNodeValue !== undefined){
					main(xpath.singleNodeValue);
				}
			}
		}
	});
});

observer.observe(document, {childList: true, subtree: true});
