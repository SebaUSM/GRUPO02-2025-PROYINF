
const axios = require('axios');

// Se configura la API de Adobe
const API_BASE_URL = 'https://documentcloud.adobe.io/document/api';
const API_KEY = 'Llave_de_API_';  
const TEMPLATE_ID = 'ID_plantilla';  

async function generateDocument(data) {
    try {
        const response = await axios.post(`${API_BASE_URL}/generate`, {
            templateId: TEMPLATE_ID,
            data: data
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error generando el documento:', error);
        throw error;
    }
}

async function getDocumentStatus(documentId) {
    try {
        const response = await axios.get(`${API_BASE_URL}/status/${documentId}`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error obteniendo el estado del documento:', error);
        throw error;
    }
}

module.exports = {
    generateDocument,
    getDocumentStatus
};
