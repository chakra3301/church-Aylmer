/**
 * Christ Church Aylmer - Site Search
 * Client-side inline search with dropdown results
 */
(function () {
  'use strict';

  var searchIndex = [
    {
      page: 'Home',
      url: 'index.html',
      content: 'Christ Church Aylmer welcoming Anglican congregation Aylmer sector Gatineau Sunday worship Holy Eucharist 10:00 AM community faith fellowship Get to Know Us about services visit us'
    },
    {
      page: 'About',
      url: 'about.html',
      content: 'About Christ Church Aylmer history mission values Anglican congregation worship community faith Incumbent Rev Chris Dunn Music Ministry David Irving Organist Choir Director Associate Incumbents Rev Dr Sony Jabouin Rev Dr Caz Ducros Parish of The Holy Spirit Berklee College of Music Chelsea Carleton University vestry wardens'
    },
    {
      page: 'Services',
      url: 'services.html',
      content: 'Sunday Service Holy Eucharist 10:00 AM Holy Communion Lord\'s Supper hymns scripture readings Old Testament Psalms Epistles Gospels sermon Communion coffee hour fellowship Upcoming Events Spring Book Bake Sale Good Friday Service Easter Sunday Service weekly bulletin PDF readings announcements What to Expect first visit parking wheelchair accessible children welcome communion bread wine'
    },
    {
      page: 'Facilities',
      url: 'facilities.html',
      content: 'Facilities church hall rental rent space event venue wedding reception meeting community gathering historic stone church hall kitchen capacity parking accessible 819 682 0958 rental inquiries'
    },
    {
      page: 'Visit Us',
      url: 'contact.html',
      content: 'Visit Us contact directions address 81 Aylmer Road Gatineau Quebec parking transit Sunday service 10:00 AM phone email christchurchaylmer@gmail.com get in touch map location'
    },
    {
      page: 'Donate',
      url: 'donate.html',
      content: 'Donate give support contribution CanadaHelps Interac e-Transfer christchurchaylmer@gmail.com PAR Pre-Authorized Remittance monthly giving charity registration 108084658RR0103 tax receipt stewardship offering'
    }
  ];

  var input = document.getElementById('search-input');
  var resultsList = document.getElementById('search-results');

  if (!input || !resultsList) return;

  function closeSearch() {
    resultsList.classList.remove('search-dropdown--active');
    resultsList.innerHTML = '';
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav__search-wrap')) {
      closeSearch();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSearch();
  });

  input.addEventListener('input', function () {
    var query = input.value.trim().toLowerCase();
    resultsList.innerHTML = '';

    if (query.length < 2) {
      closeSearch();
      return;
    }

    var words = query.split(/\s+/);
    var matches = [];

    searchIndex.forEach(function (entry) {
      var lowerContent = entry.content.toLowerCase();
      var score = 0;
      words.forEach(function (word) {
        if (lowerContent.indexOf(word) !== -1) score++;
      });
      if (score > 0) {
        matches.push({ entry: entry, score: score });
      }
    });

    matches.sort(function (a, b) { return b.score - a.score; });

    if (matches.length === 0) {
      resultsList.innerHTML = '<li class="search-dropdown__empty">No results found</li>';
      resultsList.classList.add('search-dropdown--active');
      return;
    }

    matches.forEach(function (match) {
      var entry = match.entry;
      var snippet = getSnippet(entry.content, words);

      var li = document.createElement('li');
      li.className = 'search-dropdown__item';
      li.innerHTML =
        '<a href="' + entry.url + '" class="search-dropdown__link">' +
        '<span class="search-dropdown__page">' + entry.page + '</span>' +
        '<p class="search-dropdown__text">' + snippet + '</p>' +
        '</a>';
      resultsList.appendChild(li);
    });

    resultsList.classList.add('search-dropdown--active');
  });

  function getSnippet(content, words) {
    var firstIndex = content.length;
    words.forEach(function (word) {
      var idx = content.toLowerCase().indexOf(word);
      if (idx !== -1 && idx < firstIndex) firstIndex = idx;
    });

    var start = Math.max(0, firstIndex - 20);
    var end = Math.min(content.length, firstIndex + 60);
    var snippet = (start > 0 ? '...' : '') + content.substring(start, end) + (end < content.length ? '...' : '');

    words.forEach(function (word) {
      var regex = new RegExp('(' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      snippet = snippet.replace(regex, '<mark>$1</mark>');
    });

    return snippet;
  }
})();
