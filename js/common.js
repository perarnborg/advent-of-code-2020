function show(day, first, second, displayFn = (value) => JSON.stringify(value)) {
  console.log({day, first, second})

  window.document.write('<br/><hr/><br/>' + day + '/12 <br/> First: ' + displayFn(first) + ' <br/> Second: ' + displayFn(second) + '<br/>')
}
