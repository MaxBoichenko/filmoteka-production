var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},t={},a={},r=e.parcelRequired7c6;null==r&&((r=function(e){if(e in t)return t[e].exports;if(e in a){var r=a[e];delete a[e];var i={id:e,exports:{}};return t[e]=i,r.call(i.exports,i,i.exports),i.exports}var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}).register=function(e,t){a[e]=t},e.parcelRequired7c6=r),r("3ILHO"),r("eC6VJ");var i=r("8IjGi");r("70Nf4");var n=r("bbmaV"),l=(n=r("bbmaV"),r("gMdK3")),o=r("3ILHO");r("amrNH");const{cardsEl:s,modalFilm:c,closeModalBtn:d,backdrop:u,modalContainer:m,modalFilmContainer:g}=o.refs,p=document.querySelector(".header__watch-btn"),b=document.querySelector(".header__queue-btn");window.addEventListener("load",(async function(e){try{await l.movieDatabase.fetchGenres()}catch(e){console.log(e)}p.classList.add("btn-active");let t=JSON.parse(localStorage.getItem(n.FILMOTEKA_KEY_WATCHED))??[],a=JSON.parse(localStorage.getItem(n.FILMOTEKA_KEY_QUEUE))??[];if(l.movieDatabase.films=t.concat(a),t.length){const e=l.movieDatabase.createCardsMarkup(t);return void(s.innerHTML=(0,i.default)(e))}s.innerHTML='<h1 class="title-queue">Your watched list is empty</h1><img src="https://image.tmdb.org/t/p/w500/wjYOUKIIOEklJJ4xbbQVRN6PRly.jpg"></img>'})),p.addEventListener("click",(function(){let e=JSON.parse(localStorage.getItem(n.FILMOTEKA_KEY_WATCHED))??[];if(p.classList.add("btn-active"),b.classList.remove("btn-active"),!e.length)return void(s.innerHTML='<h1 class="title-queue">Your watched list is empty</h1><img src="https://image.tmdb.org/t/p/w500/wjYOUKIIOEklJJ4xbbQVRN6PRly.jpg"></img>');let t=l.movieDatabase.createCardsMarkup(e);s.innerHTML=(0,i.default)(t)})),b.addEventListener("click",(function(){let e=JSON.parse(localStorage.getItem(n.FILMOTEKA_KEY_QUEUE))??[];if(p.classList.remove("btn-active"),b.classList.add("btn-active"),!e.length)return void(s.innerHTML='<h1 class="title-queue">Your queue is empty</h1><img src="https://image.tmdb.org/t/p/w500/wjYOUKIIOEklJJ4xbbQVRN6PRly.jpg"></img>');const t=l.movieDatabase.createCardsMarkup(e);s.innerHTML=(0,i.default)(t)})),r("96upZ"),r("hUfoy");
//# sourceMappingURL=library.e3db1552.js.map