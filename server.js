const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


app.use(express.static(__dirname));


let countriesData = [];
try {
    const data = fs.readFileSync(path.join(__dirname, 'countries.json'), 'utf8');
    countriesData = JSON.parse(data);
} catch (err) {
    console.error('Ошибка чтения countries.json:', err);
    process.exit(1);
}


app.get('/countries', (req, res) => {
    const {
        search,
        minPopulation,
        maxPopulation,
        minArea,
        maxArea,
        region
    } = req.query;

    let filteredCountries = countriesData;

    
    if (search) {
        const searchLower = search.toLowerCase();
        filteredCountries = filteredCountries.filter(country =>
            country.name.common.toLowerCase().includes(searchLower) ||
            country.name.official.toLowerCase().includes(searchLower)
        );
    }

    
    if (minPopulation) {
        filteredCountries = filteredCountries.filter(c =>
            c.population && c.population >= parseInt(minPopulation)
        );
    }
    if (maxPopulation) {
        filteredCountries = filteredCountries.filter(c =>
            c.population && c.population <= parseInt(maxPopulation)
        );
    }

    
    if (minArea) {
        filteredCountries = filteredCountries.filter(c =>
            c.area && c.area >= parseInt(minArea)
        );
    }
    if (maxArea) {
        filteredCountries = filteredCountries.filter(c =>
            c.area && c.area <= parseInt(maxArea)
        );
    }

    
    if (region) {
        filteredCountries = filteredCountries.filter(c => c.region === region);
    }

    
    const result = filteredCountries.map(country => ({
        code: country.cca2,
        name: country.name.common,
        officialName: country.name.official,
        region: country.region,
        capital: country.capital[0] || 'N/A',
        area: country.area || 0,
        population: country.population || 0,
        flag: country.flag ? country.flag: 'N/A',
        tld: country.tld[0] || 'N/A'
    }));

    res.json(result);
});


app.get('/countries/:code', (req, res) => {
    const code = req.params.code;
    const country = countriesData.find(c => c.cca2 === code);

    if (!country) {
        return res.status(404).json({ error: 'Страна не найдена' });
    }

    const detailedCountry = {
        code: country.cca2,
        name: country.name.common,
        officialName: country.name.official,
        region: country.region,
        capital: country.capital[0] || 'N/A',
        area: country.area || 0,
        population: country.population || 0,
        flag: country.flag ? country.flag: 'N/A',
        tld: country.tld[0] || 'N/A',
        independent: country.independent,
        unMember: country.unMember,
        currencies: country.currencies,
        idd: country.idd,
        languages: country.languages
    };

    res.json(detailedCountry);
});


app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
