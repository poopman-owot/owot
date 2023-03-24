function filterChat(whitelist, blacklist) {
  const chatfield = document.getElementById('page_chatfield');
  const divs = chatfield.querySelectorAll('div');
  var divHidden = 0;
  divs.forEach(div => {
    const title = div.querySelector('a[title]');
    if (title) {
      const titleContent = (title.getAttribute('title'))
      div.style.display = 'block';
      if (blacklist.some(word => titleContent.includes(word)) || blacklist.some(word => div.textContent.includes(word))) {
        if (whitelist.some(word => titleContent.includes(word))) return;
        div.style.display = 'none';
        divHidden++;
      }

    }
  });
}
const chatWindow = document.getElementById('chat_window');
const chatUpper = document.getElementById('chat_upper');
const chatFilterBtnHTML = '<div class="chat_tab_button" id="chat-filter">chat-filter&nbsp;<b id="global_unread" class="unread" style="display: none;">(-)</b></div>'; // create the HTML code as a string
chatUpper.insertAdjacentHTML('beforeend', chatFilterBtnHTML); // append the HTML code to the chatUpper element
const chatFilterBtn = document.getElementById("chat-filter");
chatFilterBtn.style.backgroundColor = "chartreuse";
chatFilterBtn.style.cursor = "pointer";
const chatFilterPageHtml = '<div class="chatfield" id="chat-Filter-Page" style="display: none"><div id="filter-grid"><div id = "blacklist-section"><p>Blacklist</p></div><div id = "whitelist-section"><p>Whitelist</p></div></div></div>';
chatWindow.insertAdjacentHTML('beforeend', chatFilterPageHtml);
const chatFilterPage = document.getElementById("chat-Filter-Page");
const filterGrid = document.getElementById("filter-grid");
const blacklistSection = document.getElementById("blacklist-section");
const whitelistSection = document.getElementById("whitelist-section");
blacklistSection.style.width = "40%";
whitelistSection.style.width = "40%";
blacklistSection.style.float = "left";
whitelistSection.style.float = "left";

for (i = 0; i < 20; i++) {
  const filterChatInput = document.createElement('input'); // create a new <input> element
  const filterChatInput2 = document.createElement('input'); // create a new <input> element
  filterChatInput.type = 'text'; // set the type attribute to 'text'
  filterChatInput.style.width = '100%'; // set the width to 100% to fill the available space
  blacklistSection.appendChild(filterChatInput); // append the <input> element to the #chat-filter element
  whitelistSection.appendChild(filterChatInput2); // append the <input> element to the #chat-filter element
};

function getFilterLists() {
  const blacklistInputs = document.querySelectorAll('#blacklist-section input');
  const whitelistInputs = document.querySelectorAll('#whitelist-section input');

  const blacklist = [];
  const whitelist = [];

  blacklistInputs.forEach(input => {
    const value = input.value.trim();
    if (value !== '') {
      blacklist.push(value);
    }
  });

  whitelistInputs.forEach(input => {
    const value = input.value.trim();
    if (value !== '') {
      whitelist.push(value);
    }
  });

  return [whitelist, blacklist];
}


chatFilterBtn.onclick = function() {

  if (chatFilterPage.style.display == "none") {
    chatFilterPage.style.display = "block";
  } else {
    chatFilterPage.style.display = "none"
  }
}
setInterval(function() {
  const [whitelist, blacklist] = getFilterLists();
  filterChat(whitelist, blacklist);
}, 100)
