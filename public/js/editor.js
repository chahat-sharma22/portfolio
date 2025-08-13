document.addEventListener("DOMContentLoaded", () => {
    const previewFrame = document.getElementById("previewFrame");
    const templateSelect = document.getElementById("template");

    const nameInput = document.getElementById("name");
    const skillsInput = document.getElementById("skills");
    const experienceInput = document.getElementById("experience");
    const headingColorInput = document.getElementById("headingColor");
    const fontFamilyInput = document.getElementById("fontFamily");

    // Fetch API data and populate form
    fetch(`http://localhost:3000/api/profile/get/${REGISTRATION_NO}`)
        .then(res => res.json())
        .then(data => {
            console.log("Fetched API data (frontend):", data);

            nameInput.value = data.studentProfile?.name || "";
            skillsInput.value = Array.isArray(data.skills) ? data.skills.join(", ") : data.skills || "";
            experienceInput.value = data.experiences?.[0]?.description || "";
            headingColorInput.value = "#000000"; // No color in API, default black
            fontFamilyInput.value = "Arial"; // No font in API, default Arial

            updatePreview();
        })
        .catch(err => console.error("Error fetching data:", err));

    // Update preview iframe
    function updatePreview() {
        const selectedTemplate = templateSelect.value;
        previewFrame.src = `/preview/${selectedTemplate}/${REGISTRATION_NO}`;
    }

    // Change preview when template changes
    templateSelect.addEventListener("change", updatePreview);
});
