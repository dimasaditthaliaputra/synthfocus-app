const apiKey = "AIzaSyBZbTHgGZBf6rk5V0Lc77-AygxvBIm_6KU"; 
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

async function cekModel() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) {
        console.error("❌ Error API:", data.error.message);
        return;
    }

    console.log("✅ MODEL YANG TERSEDIA UNTUKMU:");
    const models = data.models
        .filter(m => m.supportedGenerationMethods.includes("generateContent"))
        .map(m => m.name.replace("models/", "")); // Hapus prefix 'models/'

    console.log(models);
  } catch (error) {
    console.error("Gagal fetch:", error);
  }
}

cekModel();