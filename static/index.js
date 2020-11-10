var channel = localStorage.getItem('last_channel')
var list = document.getElementById('channelsList').innerHTML

console.log(channel)
console.log(list)

  if (list.includes(channel)) {
      window.location.replace('/channels/' + channel);   
  }
