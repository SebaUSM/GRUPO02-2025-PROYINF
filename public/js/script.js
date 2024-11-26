
document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const loginModal = document.getElementById('loginModal');
    const closeButton = document.querySelector('.close-button');

    loginButton.addEventListener('click', (e) => {
        e.preventDefault(); 
        loginModal.style.display = 'block'; 
    });

    closeButton.addEventListener('click', () => {
        loginModal.style.display = 'none'; 
    });

    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            loginModal.style.display = 'none'; 
        }
    });

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
    
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
    
        if (response.ok) {
            const userRole = await response.text(); 
            if (userRole === 'admin') {
                window.location.href = '/dashboard/admin';
            } else if (userRole === 'maestro') {
                window.location.href = '/dashboard/maestro';
            }
        } else {
            alert('Error al iniciar sesión');
        }
    });

    document.getElementById('uploadForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        alert(result.message);
        loadPDFs();
    });
});



async function loadPDFs() {
    const response = await fetch('/pdfs');
    const pdfs = await response.json();
    const pdfList = document.getElementById('pdfList');
    pdfList.innerHTML = '';
    
    pdfs.forEach(pdf => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="/pdf/${pdf.id}" target="_blank">${pdf.title}</a>`;
        pdfList.appendChild(listItem);
    });
}

// Cargar los PDFs al cargar la página

document.addEventListener('DOMContentLoaded', () => {
    loadPDFs();
});