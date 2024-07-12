const express = require('express');
const axios = require('axios');
const app = express();
const port = 9876;

const WINDOW_SIZE = 10;
let storedNumbers = [];

app.use(express.json());

app.get('/numbers/:numberid', async (req, res) => {
    const numberId = req.params.numberid;

    if (!['p', 'f', 'e', 'r'].includes(numberId)) {
        return res.status(400).json({ error: 'Invalid number ID' });
    }

    const fetchNumbers = async () => {
        try {
            const resp = await axios.get(`http://localhost:9876/getnumbers/${numberId}, { timeout: 500 }`);
            return resp.data.numbers;
        } catch (error) {
            console.error('Error fetching numbers:', error);
            return [];
        }
    };

    const previousState = [...storedNumbers];
    const newNumbers = await fetchNumbers();

    const uninumbers = newNumbers.filter(num => !storedNumbers.includes(num));
    storedNumbers = [...storedNumbers, ...uninumbers].slice(-WINDOW_SIZE);

    const average = storedNumbers.length > 0
        ? storedNumbers.reduce((acc, num) => acc + num, 0) / storedNumbers.length
        : 0;

    res.json({
        windowPrevState: previousState,
        windowCurrState: storedNumbers,
        numbers: newNumbers,
        avg: average.toFixed(2)
    });
});

app.get('/getnumbers/:numberid', (req, res) => {
    const numberId = req.params.numberid;
    let numbers = [];


    switch (numberId) {
        case 'p':
            numbers = [2, 3, 5, 7, 11];
            break;
        case 'f':
            numbers = [55,89,144,233,377,610,987,1597,2584,4181,6765];
            break;
        case 'e':
            numbers = [8,10,112,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56];
            break;
        case 'r':
            numbers = [2,19,25,7,4,24,17,27,30,21,14,10,23];
            break;
        default:
            break;
    }

    res.json({ numbers });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});