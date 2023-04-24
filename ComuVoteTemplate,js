
//settings

const comu_event = "example_event"; //EXAMPLE LINKS:     comu:example_event & comu:{"example_event":true}
const handleJSON = true; //Handle JSON related data
const handleNonJSON = true; //Handle non-JSON data
const allowAnon = true; //Allow anon comu clicks
const preventSpam = true; //Prevent spam by comparing to an array of IDs
//----------------------------------------------------------------------

let preventSpam_list = [];
let votes = 0;
w.broadcastReceive(); //turn on ability to recieve messages



function handle_comu_event(data) {
  if (data.id == undefined && !allowAnon) {
    //if an anon is illegally voting, call the police.
    return false;
  }

  if (preventSpam) {
    if (addToPreventSpamList(data.id, data.sender)) {
      //if a new entry was just added, count the vote.
      votes++;
    } else {
      return false;
    }
  } else {
    //count the vote, ignoring spam.
    votes++;
  }
  console.log(comu_event, votes);
}


//this is the logic for reciving the message but doesnt need to modified from here. instead modify the handle_comu_event function.
w.on('cmd', function(comu) {
  if (handleJSON) {
    const data = comu.data;
    if (isJsonString(data)) {
      //capture json data
      const jsonData = JSON.parse(data);
      if (jsonData[comu_event]) {
        handle_comu_event(comu);
      }
    }
  }
  if (handleNonJSON) {
    if (!isJsonString(comu.data)) {
      if (comu.data == comu_event) {
        handle_comu_event(comu);
      }
    }
  }
})
//this function is used to determine if the string is valid without throwin errors in cases its not.
function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
//this is the logic to determine if prevent spam list contains the same ID.
const addToPreventSpamList = (string1, string2) => {
  if (!preventSpam_list.includes(string1) && !preventSpam_list.includes(string2)) {
    if (string1 !== undefined) {
      preventSpam_list.push(string1);
    }
    preventSpam_list.push(string2);
    return true
  } else {
    return false
  }
}
