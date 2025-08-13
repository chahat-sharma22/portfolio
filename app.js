const express = require('express');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const axios = require('axios'); // ✅ Import axios

const app = express();

// Configure app
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route to serve editor page
app.get('/', (req, res) => res.redirect('/editor'));

app.get('/editor', (req, res) => {
    res.render('editor');
});

// Route for preview with data
app.get('/preview/:template/:registrationNo', async (req, res) => {
    const { template, registrationNo } = req.params;

    try {
        // ✅ Fetch data from API
        const { data: apiData } = await axios.get(
            `http://localhost:3000/api/profile/get/${registrationNo}`
        );

        // ✅ Validate template exists
        const templatePath = path.join(__dirname, 'views', 'templates', `${template}.ejs`);
        if (!fs.existsSync(templatePath)) {
            return res.status(404).send('Template not found');
        }

        // ✅ Merge API data into template variables
        res.render(`templates/${template}`, {
            portfolio: apiData.basicInfo || {},
            about: apiData.about || '',
            experiences: apiData.experiences || [],
            education: apiData.education || [],
            skills: apiData.skills || [],
            styles: apiData.styles || {}
        });

    } catch (err) {
        console.error('Preview error:', err.message);
        res.status(500).send('Error rendering template');
    }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
