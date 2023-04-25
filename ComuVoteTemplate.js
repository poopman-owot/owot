
//SETTINGS
var comu_settings = {
  event_Name: "example_event", //EXAMPLE LINKS:     comu:{"example_event":yes}
  handle_JSON: true, //Handle JSON related data
  handle_Non_JSON: true, //Handle non-JSON data
  allow_Anon: true, //Allow anon comu clicks
  prevent_Spam: false, //Prevent spam by comparing to an array of IDs
  clear_Console: true, //Clear the console before logging the votes
  log_Console: true, //Show the votes in the console
}
//----------------------------------------------------------------------
//Inital Variables
let preventSpam_list = []; //Stores IDs to help reduce chance of spam
let votes = {
  yes: 0,
  no: 0
}; //This is the votes tally
w.broadcastReceive(); //turn on ability to recieve messages
//----------------------------------------------------------------------

//Main Function
function handle_comu_event(e) {
  if (e.id == undefined && comu_settings.allow_Anon == false) {
    //if an anon is illegally voting, call the police.
    return false;
  }
  if (comu_settings.prevent_Spam) {
    if (addToPreventSpamList(e.id, e.sender)) {
      //if a new entry was just added, count the vote.
      handle_comu_data(e);
    } else {
      return false;
    }
  } else {
    //count the vote, ignoring spam filter.
    handle_comu_data(e);
  }
}

function handle_comu_data(e) {
  //Check if the data is in JSON format
  const data = e.data;
  if (isJsonString(data)) {
    //capture json data
    const jsonData = JSON.parse(data);
    if (jsonData[comu_settings.event_Name]) {
			//extract vote data
      const vote = jsonData[comu_settings.event_Name];
      //add to vote tally
      votes[vote]++;
    }
  } else {
    //handle non-JSON
		//extract vote data
    const vote = data.split('$')[1];
		//add to vote tally
    votes[vote]++;
  }


  //logging
  if (comu_settings.log_Console) {
    if (comu_settings.clear_Console) {
      console.clear();
    }
    console.log(votes);
  }
}
//----------------------------------------------------------------------
//Main Event Listener
//this is the logic for reciving the message but doesnt need to modified from here. instead modify the handle_comu_event function.
w.on('cmd', function(e) {
  if (comu_settings.handle_JSON) {
    const data = e.data;
    if (isJsonString(data)) {
      //capture json data
      const jsonData = JSON.parse(data);
      if (jsonData[comu_settings.event_Name]) {
        handle_comu_event(e);
      }
    }
  }
  if (comu_settings.handle_Non_JSON) {
    if (!isJsonString(e.data)) {
      if (e.data.includes(comu_settings.event_Name)) {
        handle_comu_event(e);
      }
    }
  }
})
//----------------------------------------------------------------------
//HELPER FUNCTIONS
//this function is used to determine if the string is valid without throwin errors in cases its not.
function isJsonString(a) {
  try {
    JSON.parse(a);
  } catch (e) {
    return false;
  }
  return true;
}
//this is the logic to determine if prevent spam list contains the same ID.
const addToPreventSpamList = (a, b) => {
  if (!preventSpam_list.includes(a) && !preventSpam_list.includes(b)) {
    if (a !== undefined) {
      preventSpam_list.push(a);
    }
    preventSpam_list.push(b);
    return true
  } else {
    return false
  }
}
