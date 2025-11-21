async function loadMenuFromSheet() {
    const sheetUrl = "https://opensheet.elk.sh/1Xc0qzjSxCxvF7YLe_s05Qvu2LYEerL66Z0X7RPmejm4/1";
    const data = await fetch(sheetUrl).then(r => r.json());

    const menuRO = {};
    const menuRU = {};

    data.forEach(row => {
      if (!row.nume_ro || row.nume_ro.trim() === "") return;
        const cat = row.categorie.trim();

        if (!menuRO[cat]) menuRO[cat] = [];
        if (!menuRU[cat]) menuRU[cat] = [];

        const alergeni = row.alergeni ? row.alergeni.split(",").map(a => a.trim()) : [];

        const baseObj = {
            pret: String(row.pret),
            gramaj: row.gramaj,
            img: row.img,
            alergeni
        };

        menuRO[cat].push({
            ...baseObj,
            nume: row.nume_ro,
            descriere: row.descriere_ro
        });

        menuRU[cat].push({
            ...baseObj,
            nume: row.nume_ru,
            descriere: row.descriere_ru
        });
    });

    window.meniuRO = menuRO;
    window.meniuRU = menuRU;
}
history.scrollRestoration = "manual";

window.addEventListener('hashchange', () => {
    history.replaceState("", document.title, window.location.pathname + window.location.search);
});

window.addEventListener("load", () => {
    window.scrollTo(0, 0);
});




const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
});


let meniuRO = {};
let meniuRU = {};



const texte = {
  ro: {
    heroTitle: "SAVORRA CAFFÉ",
    heroSubtitle: "Doar la SAVORRA ai șansa să savurezi!",
    categories: {
      gustari: "GUSTĂRI",
      salate: "SALATE | GARNITURI",
      paste: "PASTE",
      pizza: "PIZZA",
      peste: "PEȘTE",
      carne: "CARNE",
      supe: "SUPE",
      desert: "DESERTURI",
      bauturi: "BĂUTURI",
      tarie: "TĂRIE & LICHIOR",
      bere: "BERE",
      cocktails: "COCKTAILS",
      limonade: "LIMONADE & BĂUTURI CARBOGAZOASE",
      ceai: "CEAI & CAFEA",
      wine: "WINE CARD"
    }
  },
  ru: {
    heroTitle: "SAVORRA CAFFÉ",
    heroSubtitle: "Только в SAVORRA у тебя есть шанс насладиться!",
    categories: {
      gustari: "ЗАКУСКИ",
      salate: "САЛАТЫ | ГАРНИРЫ",
      paste: "ПАСТА",
      pizza: "ПИЦЦА",
      peste: "РЫБА",
      carne: "МЯСО",
      supe: "СУПЫ",
      desert: "ДЕСЕРТЫ",
      bauturi: "НАПИТКИ",
      tarie: "КРЕПКИЕ НАПИТКИ",
      bere: "ПИВО",
      cocktails: "КОКТЕЙЛИ",
      limonade: "ЛИМОНАДЫ И ГАЗИРОВАННЫЕ НАПИТКИ",
      ceai: "ЧАЙ И КОФЕ",
      wine: "ВИНА"
    }
  }
};

let currentLang = 'ro';
let meniuCurent = meniuRO;

document.addEventListener("DOMContentLoaded", () => {
  const produse = document.querySelectorAll(".card, .bauturi-item");

  function animatieProduse() {
    const triggerHeight = window.innerHeight * 1;
    produse.forEach(p => {
      const top = p.getBoundingClientRect().top;
      if (top < triggerHeight) {
        p.classList.add("show");
      } else {
        p.classList.remove("show");
      }
    });
  }

  window.addEventListener("scroll", animatieProduse);
  animatieProduse(); 

  produse.forEach(p => p.classList.add("produs-animat"));
});



function createCard(p) {
  const card = document.createElement('div');
  card.className = 'card';
  const alergeniHTML = p.alergeni && p.alergeni.length
    ? `<div class='allergen-group'>${p.alergeni.map(a => `<img src='${a}' alt='alergen'>`).join('')}</div>`
    : '';
  card.innerHTML = `
    ${p.img ? `<img src='${p.img}' alt='${p.nume}'>` : `<img src="default.jpg" alt="default">`}

    ${alergeniHTML}
    <div class='content'>
      <div class='title'>${p.nume}</div>
      <div class='price-row'>
        <div class='price'>${p.pret} MDL</div>
        ${p.gramaj ? `<div class='gramaj'>${p.gramaj}</div>` : ''}
      </div>
    </div>`;
  card.addEventListener('click', () => openFullPage(p));
  return card;
}

function render() {
  const simpleCategories = ['bauturi', 'tarie', 'bere', 'cocktails', 'limonade', 'ceai', 'wine'];

  Object.keys(meniuCurent).forEach(cat => {
    const grid = document.getElementById('grid-' + cat);
    if (!grid) return;

    if (simpleCategories.includes(cat)) {
      grid.innerHTML = meniuCurent[cat]
        .map(item => `<div class='bauturi-item'><span>${item.nume}</span><span>${item.pret} MDL</span></div>`)
        .join('');
    } else {
      grid.innerHTML = '';
      meniuCurent[cat].forEach(p => grid.appendChild(createCard(p)));
    }
  });
}

function updateMenuLinks(lang) {
  const links = document.querySelectorAll('.menu-links a');
  const categories = Object.keys(texte[lang].categories);
  links.forEach((link, index) => {
    const cat = categories[index];
    if (cat && texte[lang].categories[cat]) {
      link.textContent = texte[lang].categories[cat];
    }
  });
}

const productPage = document.getElementById('productPage');
const prodImg = document.getElementById('prodImg');
const prodName = document.getElementById('prodName');
const prodDesc = document.getElementById('prodDesc');
const prodAlergeni = document.getElementById('prodAlergeni');
const prodPrice = document.getElementById('prodPrice');
document.getElementById('closeFull').onclick = () => productPage.classList.remove('open');
setTimeout(() => {
  productPage.style.display = "none";
}, 100);


function openFullPage(p) {
 prodImg.src = p.img && p.img !== '' ? p.img : 'default.jpg';

  prodName.textContent = p.nume;
  prodDesc.textContent = p.descriere;
  prodPrice.innerHTML = `
    ${p.gramaj ? `<div class='gramaj-popup'>${p.gramaj}</div>` : ''}
    <div>${p.pret} MDL</div>`;
  prodAlergeni.innerHTML = p.alergeni && p.alergeni.length
    ? p.alergeni.map(a => `<img src='${a}' alt='alergen'>`).join('')
    : '';
  productPage.style.display = "flex";
setTimeout(() => {
  productPage.classList.add('open');
}, 10);

  productPage.scrollTo(0, 0);
}

// function setLanguage(lang) {
//   currentLang = lang;
//   meniuCurent = lang === 'ru' ? meniuRU : meniuRO;

//   document.querySelector('.hero h1').textContent = texte[lang].heroTitle;
//   document.querySelector('.hero p').textContent = texte[lang].heroSubtitle;

//   Object.keys(texte[lang].categories).forEach(cat => {
//     const el = document.querySelector(`#${cat}`);
//     if (el) el.textContent = texte[lang].categories[cat];
//   });

//   updateMenuLinks(lang); 
//   render();
// }
function setLanguage(lang) {
  currentLang = lang;
  meniuCurent = lang === 'ru' ? meniuRU : meniuRO;

  if (lang === 'ru') {
    Object.keys(meniuRO).forEach(categorie => {
      meniuRU[categorie]?.forEach((produs, index) => {
        if (!produs.img || produs.img === '') {
          produs.img = meniuRO[categorie][index]?.img || '';
        }
      });
    });
  }

  document.querySelector('.hero h1').textContent = texte[lang].heroTitle;
  document.querySelector('.hero p').textContent = texte[lang].heroSubtitle;

  Object.keys(texte[lang].categories).forEach(cat => {
    const el = document.querySelector(`#${cat}`);
    if (el) el.textContent = texte[lang].categories[cat];
  });

  updateMenuLinks(lang); 
  render();

  if (lang === "ru") {
    history.pushState({}, "", "/#/ru");
} else {
    history.pushState({}, "", "/");
}


}


document.getElementById('lang').addEventListener('change', e => {
  setLanguage(e.target.value);
});

loadMenuFromSheet().then(() => {
    meniuRO = window.meniuRO;
    meniuRU = window.meniuRU;
    meniuCurent = meniuRO;

    if (location.hash === "#/ru") {
        document.getElementById("lang").value = "ru";
        setLanguage("ru");
    } else {
        setLanguage("ro");
    }
});


