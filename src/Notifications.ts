import {Module} from "./ModuleRunner";
import {Selector} from "./Selector";
import {genericCleanup} from "./util";
import {Materials} from "./GameProperties";

export class Notifications implements Module {
  private tag = "pb-nots";
  cleanup() {
    genericCleanup(this.tag);
  }
  run() {
    const elements = document.querySelectorAll(Selector.Notification);
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
	  const textContent = (element.children[1].children[0] as HTMLElement).textContent;
	  if(textContent == null){continue;}
	  const text = textContent.toLowerCase();
	  Searchers.forEach(search => {
		  const match = text.match(new RegExp(search[0]));
		  if(match != null)
		  {
			const typeSpan = document.createElement("div");
			typeSpan.textContent = search[1].toUpperCase();
			typeSpan.classList.add(this.tag);
			typeSpan.classList.add("notification");
			typeSpan.style.color = search[2];
			element.children[1].insertBefore(typeSpan, element.children[1].children[0]);
			
			// Shorten notifications
			var matches;
			var notText = (element.children[1].children[1] as HTMLElement).textContent;
			
			if(notText == null){return;}
			
			notText = notText.replace(/Chamber of Global Commerce/, "COGC");
			
			switch(search[0])
			{
				case "produced":
					notText = notText.replace(/at your base /, "");
					notText = notText.replace(/One /, "1 ");
					notText = notText.replace(/ have been/, "");
					notText = notText.replace(/ unit[s]? of/, "");
					matches = notText.match(/ ([A-z -]+) produced/);
					if(matches != null && matches[1] != undefined && Materials[matches[1]] != undefined)
					{
						notText = notText.replace(new RegExp(matches[1]), Materials[matches[1]][0]);
					}
					break;
				case "trade":
					matches = notText.match(/your ([A-z -]+) order/);
					if(matches != null && matches[1] != undefined && Materials[matches[1]] != undefined)
					{
						notText = notText.replace(new RegExp(matches[1]), Materials[matches[1]][0]);
					}
				case "order filled":
					notText = notText.replace(/ Commodity Exchange/, "");
					matches = notText.match(/([A-z -]+) order/);
					if(matches != null && matches[1] != undefined && Materials[matches[1]] != undefined)
					{
						notText = notText.replace(new RegExp(matches[1]), Materials[matches[1]][0]);
					}
					break;
				case "accepted":
					notText = notText.replace(/ the/, "");
					notText = notText.replace(/ local market/, "");
					break;
				case "contract":
					notText = notText.replace(/Your partner /, "");
					break;
				case "arrived at":
					notText = notText.replace(/its destination /, "");
					break;
				case "cogc":
				case "chamber of global commerce":
					notText = notText.replace(/ a new economic program/, "");
					break;
			}
			(element.children[1].children[1] as HTMLElement).textContent = notText;
		  }
	  });
      
    }
  }
}

// Words to search for, their types, and colors courtesy of Ray K
// Searches must be lower case
const Searchers = [
	["contract", "contract", "rgb(247, 166, 0)"],
	["produced", "produced", "#3fa2de"],
	["accepted", "advert", "#449c57"],
	["expired", "advert", "#449c57"],
	["trade", "trade", "#008000"],
	["order filled", "order", "#cc2929"],
	["arrived at", "arrival", "#b336b3"],
	["report", "report", "#00aa77"],
	["election", "election", "#8f52cc"],
	["governor", "governor", "#8f52cc"],
	["rules", "rules", "#8f52cc"],
	["cogc", "COGC", "#8f52cc"],
	["chamber of global commerce", "COGC", "#8f52cc"],
	["expert", "expert", "#ff8a00"],
	["our corporation", "corp", "#8f52cc"],
	["population infrastructure project", "POPI", "#8f52cc"],
	["apex", "update", "#00aa77"]
]