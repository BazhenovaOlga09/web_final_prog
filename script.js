
const countryList = document.getElementById('countries');
const countryDetail = document.getElementById('country-detail');
const countryInfo = document.getElementById('country-info');
const backBtn = document.getElementById('back-btn');

const searchInput = document.getElementById('search');
const minPopulationInput = document.getElementById('min-population');
const maxPopulationInput = document.getElementById('max-population');
const minAreaInput = document.getElementById('min-area');
const maxAreaInput = document.getElementById('max-area');
const regionSelect = document.getElementById('region');


const API_URL = 'http://localhost:3000';


let selectedCountryCode = null;

async function loadCountries() {
    const params = new URLSearchParams();


    if (searchInput.value) params.append('search', searchInput.value);
    if (minPopulationInput.value) params.append('minPopulation', minPopulationInput.value);
    if (maxPopulationInput.value) params.append('maxPopulation', maxPopulationInput.value);
    if (minAreaInput.value) params.append('minArea', minAreaInput.value);
    if (maxAreaInput.value) params.append('maxArea', maxAreaInput.value);
    if (regionSelect.value) params.append('region', regionSelect.value);


    const url = `${API_URL}/countries?${params.toString()}`;


    try {
        const response = await fetch(url);
        const countries = await response.json();

        renderCountryList(countries);
    } catch (error) {
        console.error('Ошибка загрузки стран:', error);
        countryList.innerHTML = '<li>Не удалось загрузить данные</li>';
    }
}


function renderCountryList(countries) {
    if (countries.length === 0) {
        countryList.innerHTML = '<li>Нет данных по заданным фильтрам</li>';
        return;
    }

    countryList.innerHTML = countries.map(country => `
        <li class="country-item">
            <div class="flag-container">
                <span class="flag-emoji">${country.flag}</span>
            </div>
            <div class="info">
                <h3>${country.name} 🌏</h3>
                <p><strong>Регион:</strong> ${country.region}</p>
                <p><strong>Столица:</strong> ${country.capital}</p>
                <p><strong>Площадь:</strong> ${country.area.toLocaleString()} км²</p>
                <p><strong>Население:</strong> ${country.population.toLocaleString()}</p>
            </div>
            <button class="detail-btn" data-code="${country.code}">Подробнее</button>
        </li>
    `).join('');

    
    document.querySelectorAll('.detail-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedCountryCode = btn.dataset.code;
            showCountryDetail();
        });
    });
}


async function showCountryDetail() {
    if (!selectedCountryCode) return;

    try {
        const response = await fetch(`${API_URL}/countries/${selectedCountryCode}`);
        const country = await response.json();

        if (response.status === 404) {
            countryInfo.innerHTML = `<p>Страна не найдена</p>`;
            return;
        }

        countryInfo.innerHTML = `
            
            <h2>
                <img src="https://flagcdn.com/w80/${country.code.toLowerCase()}.png" 
                alt="Флаг ${country.name}"
                class="country-flag-img">
                ${country.name}
            </h2>
            
            
            <p><strong>Официальное название:</strong> ${country.officialName}</p>
            <p><strong>Регион:</strong> ${country.region}</p>
            <p><strong>Столица:</strong> ${country.capital}</p>
            <p><strong>Площадь:</strong> ${country.area.toLocaleString()} км²</p>
            <p><strong>Население:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Домен:</strong> ${country.tld}</p>
            <p><strong>Независимость:</strong> ${country.independent ? 'Да' : 'Нет'}</p>
            <p><strong>Член ООН:</strong> ${country.unMember ? 'Да' : 'Нет'}</p>

            <h3 class="add_info">Языки</h3>
            <ul>
                ${Object.values(country.languages).map(lang => `<li>${lang}</li>`).join('')}
            </ul>

            <h3 class="add_info">Валюты</h3>
            <ul>
                ${Object.values(country.currencies).map(curr => `
                    <li>${curr.name} (${curr.symbol || 'нет символа'})</li>
                `).join('')}
            </ul>

            <h3 class="add_info">Телефонный код</h3>
            <p>${country.idd.root}${country.idd.suffixes.join('/')}</p>
        `;

        
        countryList.style.display = 'none';
        countryDetail.style.display = 'block';
    } catch (error) {
        console.error('Ошибка загрузки детализации:', error);
        countryInfo.innerHTML = `<p>Не удалось загрузить информацию о стране</p>`;
    }
}


function goBack() {
    countryDetail.style.display = 'none';
    countryList.style.display = 'block';
    selectedCountryCode = null;
}


document.addEventListener('DOMContentLoaded', () => {
    loadCountries(); 


    
    searchInput.addEventListener('input', loadCountries);
    minPopulationInput.addEventListener('input', loadCountries);
    maxPopulationInput.addEventListener('input', loadCountries);
    minAreaInput.addEventListener('input', loadCountries);
    maxAreaInput.addEventListener('input', loadCountries);
    regionSelect.addEventListener('change', loadCountries);

   
    backBtn.addEventListener('click', goBack);
});

const viewToggle = document.getElementById('view-toggle');
const countriesList = document.getElementById('countries');


const themeToggle = document.getElementById('theme-toggle');


if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggle.textContent = '🌜'; 
} else {
    themeToggle.textContent = '☀️'; 
}


themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('dark-theme')) {
        document.body.classList.remove('dark-theme');
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.add('dark-theme');
        themeToggle.textContent = '🌜';
        localStorage.setItem('theme', 'dark');
    }
});

const typeToggle = document.getElementById('type-toggle');


if (localStorage.getItem('type') === 'table') {
    document.body.classList.add('table-type');
    typeToggle.textContent = '📅'; 
} else {
    typeToggle.textContent = '📄'; 
}


typeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('table-type')) {
        document.body.classList.remove('table-type');
        typeToggle.textContent = '📄';
        localStorage.setItem('type', 'list');
    } else {
        document.body.classList.add('table-type');
        typeToggle.textContent = '📅';
        localStorage.setItem('type', 'table');
    }
});
