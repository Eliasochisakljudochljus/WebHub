function filterLinks() {
  var input, filter, links, a, i;
  input = document.querySelector('.search-input');
  filter = input.value.toUpperCase();
  links = document.querySelectorAll('.button');

  for (i = 0; i < links.length; i++) {
    a = links[i];
    if (a.textContent.toUpperCase().indexOf(filter) > -1) {
      a.style.display = "";
    } else {
      a.style.display = "none";
    }
  }
}

function darkmodetoggle () {
  const content = document.getElementById('light')
  if (content === 'Dark mode') {
    document.getElementById('light').textContent = 'Light mode'
    document.querySelector('body').classList.add('dark')
  } else if (content === 'Light mode') {
    document.getElementById('light').textContent = 'Dark mode'
    document.querySelector('body').classList.remove('dark')
  }
}