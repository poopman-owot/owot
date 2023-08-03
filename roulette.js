let userBuffer = new CircularBuffer(100);
function russianRoulette(inputString, name = "Someone", defaultPercentage = 16.67) {
  if (!inputString.includes("!roulette")) {
    return false;
  }

  if (inputString === "!roulette help") {
    return "Usage:\n1. !roulette <percentage>% <message> (!𝘳𝘰𝘶𝘭𝘦𝘵𝘵𝘦 10% 𝘱𝘰𝘰𝘱𝘮𝘢𝘯). 𝗔𝗱𝗱 '𝗯𝗲𝘁 𝗸𝗶𝗹𝗹𝗲𝗱' 𝗼𝗿 '𝗯𝗲𝘁 𝘀𝗮𝗳𝗲' 𝗮𝘁 𝘁𝗵𝗲 𝗲𝗻𝗱 𝗼𝗳 𝘁𝗵𝗲 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝘁𝗼 𝗺𝗮𝗸𝗲 𝗮 𝗽𝗿𝗲𝗱𝗶𝗰𝘁𝗶𝗼𝗻 (!𝘳𝘰𝘶𝘭𝘦𝘵𝘵𝘦 20% 𝘫𝘢𝘯𝘦 𝘣𝘦𝘵 𝘬𝘪𝘭𝘭𝘦𝘥). You can skip anything after !roulette to use default parameters.";
  }

  const sadExpressions = ["oh no!", "RIP", "oof", "it's too bad, really"];
  const happyExpressions = ["yay!", "whew!", "that was a close one!"];
  
  // Regex patterns
  const percentageRegex = /(\d+)%/;
  const betRegex = /\b(bet\s*(killed|safe))\b/gi;
  const rouletteRegex = /!roulette/i;
  
  // Find the percentage in the inputString or use defaultPercentage
  const percentageMatch = inputString.match(percentageRegex);
  const percentage = percentageMatch ? parseInt(percentageMatch[1]) : defaultPercentage;
  if (isNaN(percentage) || percentage < 0 || percentage > 100) {
    percentage = defaultPercentage;
  }

  // Remove the percentage, !roulette, and any bet statements from the inputString
  const nameRegex = new RegExp(`${percentage}%|${rouletteRegex.source}|${betRegex.source}`, 'gi');
  const cleanedString = inputString.replace(nameRegex, "").trim();

  // Use the cleanedString as the name if it's not empty, otherwise use the provided name
  const message = cleanedString || name;

  // Check for bet anywhere in the inputString
  let betOutcome = null;
  const betMatches = inputString.match(betRegex);
  if (betMatches) {
    const lastBetMatch = betMatches[betMatches.length - 1];
    if (lastBetMatch) {
      if (lastBetMatch.toLowerCase().includes("killed")) {
        betOutcome = true;
      } else if (lastBetMatch.toLowerCase().includes("safe")) {
        betOutcome = false;
      }
    }
  }

  let outcomeMessage = "";

  if (percentage === 100) {
    outcomeMessage = `${message} with a 100% chance? That's suicide!`;
  } else if (percentage === 0) {
    outcomeMessage = `${message} with a 0% chance? What a pussy..`;
  } else {
    const randomNum = Math.random() * 100;
    if (randomNum < percentage) {
      outcomeMessage = `${message} 𝗷𝘂𝘀𝘁 🅳🅸🅴🅳 ${sadExpressions[Math.floor(Math.random() * sadExpressions.length)]}`;
      if (betOutcome !== null) {
        outcomeMessage += betOutcome ? " You were right!" : " You were wrong!";
      }
    } else {
      outcomeMessage = `${message} 𝗶𝘀 🅢🅐🅕🅔 ${happyExpressions[Math.floor(Math.random() * happyExpressions.length)]}`;
      if (betOutcome !== null) {
        outcomeMessage += betOutcome ? " You were wrong!" : " You were right!";
      }
    }
  }
  // Sanitize the outcome message by removing any forward slashes
  outcomeMessage = outcomeMessage.replace(/\//g, '');
  return outcomeMessage;
}





const nameObject = {};

function addNameWithTimer(name) {
  if (!nameObject[name]) {
    nameObject[name] = {
      timer: null,
      isActive: false,
    };

    nameObject[name].timer = setTimeout(() => {
      nameObject[name].isActive = false;
      delete nameObject[name];
    }, 5000);

    nameObject[name].isActive = true;
    return true;
  } else {
    if (nameObject[name].isActive) {
      return false;
    } else {
      clearTimeout(nameObject[name].timer);
      nameObject[name].timer = setTimeout(() => {
        nameObject[name].isActive = false;
        delete nameObject[name];
      }, 5000);

      nameObject[name].isActive = true;
      return true;
    }
  }
}
w.on("chatmod",function(e){
   
    const username = e.nickname || e.id;

    const result = russianRoulette(e.message, username);
    if(result){
    const sendResult = addNameWithTimer(username);
if(sendResult){
   api_chat_send("> "+result,{nick:"RouletteBot"})
}
else{
api_chat_send(`/tell ${e.id} 𝒀𝒐𝒖 𝒄𝒂𝒏 𝒐𝒏𝒍𝒚 𝒖𝒔𝒆 𝒎𝒆 𝒐𝒏𝒄𝒆 𝒆𝒗𝒆𝒓𝒚 𝟓 𝒔𝒆𝒄𝒐𝒏𝒅𝒔`)
}

    }
})

 api_chat_send("ACTIVATED",{nick:"RouletteBot"})
