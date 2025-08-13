const express = require('express');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const axios = require('axios');

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
    res.render('editor', { registrationNo: '4001' }); // Pass registrationNo to editor
});

// Preview route (server-side API fetch)
app.get('/preview/:template/:registrationNo', async (req, res) => {
    const { template, registrationNo } = req.params;

    try {
        // Fetch from API
        const { data: apiData } = await axios.get(
            `http://localhost:3000/api/profile/get/${registrationNo}`
        );
        console.log("Fetched API data:", apiData);

        // Check template exists
        const templatePath = path.join(__dirname, 'views', 'templates', `${template}.ejs`);
        if (!fs.existsSync(templatePath)) {
            return res.status(404).send('Template not found');
        }

        // Map API fields to portfolio object
        let portfolio = {
            name: apiData.studentProfile.name,
            email: apiData.studentProfile.email,
            phone: apiData.studentProfile.phone,
            field: apiData.studentProfile.field,
            batchYear: apiData.studentProfile.batchYear,
            profilePic: apiData.studentProfile.profilePic,
            address: apiData.studentProfile.address,
            skills: apiData.skills || [],
            education: apiData.education || [],
            projects: apiData.projects || [],
            experiences: apiData.experiences || [],
            volunteering: apiData.volunteering || []
        };

        // Normalize skills into array
        if (typeof portfolio.skills === 'string') {
            portfolio.skills = portfolio.skills.split(',').map(s => s.trim());
        }

        res.render(`templates/${template}`, { portfolio });

    } catch (err) {
        console.error('Preview error:', err);
        res.status(500).send('Error rendering template');
    }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
