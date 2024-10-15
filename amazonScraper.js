const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeAmazonProducts(productUrl) {
    try {
        const { data } = await axios.get(productUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        });

        const $ = cheerio.load(data);
        const products = [];  
        console.log($);
              

        $('.s-main-slot .s-result-item').each((i, el) => {
            const name = $(el).find('h2 .a-text-normal').text().trim();
            const priceText = $(el).find('.a-price .a-offscreen').text().trim();
            const price = priceText ? parseFloat(priceText.replace(/[₹,]/g, '')) : null;
            const imageUrl = $(el).find('.s-image').attr('src');
            const ratingText = $(el).find('.a-icon-alt').text().trim();
            const rating = ratingText ? parseFloat(ratingText.split(' ')[0]) : null;

            if (name && price && rating) {
                products.push({ name, price, imageUrl, rating });
            }
        });

        return products;

    } catch (error) {
        console.error('Error scraping Amazon:', error);
        return [];
    }
};



async function showTopProductsUnder1500(productUrl) {
    const products = await scrapeAmazonProducts(productUrl);
    const filteredProducts = products.filter(product => product.price < 1500);
    const topProducts = filteredProducts.slice(0, 5);
    console.log('Top 5 Products under ₹1500:', topProducts);
};

async function getBestRatedProducts(productUrl) {
    const products = await scrapeAmazonProducts(productUrl);
    const bestRatedProducts = products.sort((a, b) => b.rating - a.rating).slice(0, 5);
    console.log('Best-Rated Products:', bestRatedProducts);
};

async function listMostAffordableProducts(productUrl) {
    const products = await scrapeAmazonProducts(productUrl);
    const affordableProducts = products.sort((a, b) => a.price - b.price).slice(0, 5);
    console.log('Most Affordable Products:', affordableProducts);
};

async function compareProducts(productUrl) {
    const products = await scrapeAmazonProducts(productUrl);
    const comparedProducts = products.filter(product =>
        product.name.includes('boAt Airdopes 311 Pro') || product.name.includes('boAt Nirvana Ion')
    );
    console.log('Compared Products:', comparedProducts);
};

async function findProductsWithHighRatings(productUrl) {
    const products = await scrapeAmazonProducts(productUrl);
    const highRatedProducts = products.filter(product => product.rating >= 4);
    console.log('Products with 4-star Rating or Higher:', highRatedProducts);
};

const productUrl = 'https://www.amazon.in/s?k=electronics&crid=23W98Q0322VA0&sprefix=electronic%2Caps%2C261&ref=nb_sb_noss_1';


showTopProductsUnder1500(productUrl);
getBestRatedProducts(productUrl);
listMostAffordableProducts(productUrl);
compareProducts(productUrl);
findProductsWithHighRatings(productUrl);
