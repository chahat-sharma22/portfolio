const express = require('express');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

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
app.get('/preview/:template', (req, res) => {
    try {
        const template = req.params.template;
        const data = req.query.data ? JSON.parse(req.query.data) : {};
        
        // Validate template exists
        const templatePath = path.join(__dirname, 'views', 'templates', `${template}.ejs`);
        if (!fs.existsSync(templatePath)) {
            return res.status(404).send('Template not found');
        }

        res.render(`templates/${template}`, {
            portfolio: data.basicInfo || {},
            about: data.about || '',
            experiences: data.experiences || [],
            education: data.education || [],
            skills: data.skills || [],
            styles: data.styles || {}
        });
    } catch (err) {
        console.error('Preview error:', err);
        res.status(500).send('Error rendering template');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));