const previewFrame = document.getElementById('previewFrame');
const templateSelect = document.getElementById('templateSelect');
let currentTemplate = templateSelect.value;

document.getElementById('saveBtn').addEventListener('click', () => {
    const updatedData = {
        name: document.getElementById('name').value,
        title: document.getElementById('title').value,
        skills: document.getElementById('skills').value.split(',').map(s => s.trim()),
        experience: JSON.parse(document.getElementById('experience').value),
        styles: {
            headingFont: document.getElementById('headingFont').value,
            headingColor: document.getElementById('headingColor').value,
            bgColor: document.getElementById('bgColor').value
        }
    };

    fetch('/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
    }).then(() => {
        previewFrame.src = `/preview/${currentTemplate}?t=${Date.now()}`;
    });
});

templateSelect.addEventListener('change', () => {
    currentTemplate = templateSelect.value;
    previewFrame.src = `/preview/${currentTemplate}?t=${Date.now()}`;
});

document.getElementById('downloadBtn').addEventListener('click', () => {
    window.location.href = `/download/${currentTemplate}`;
});
