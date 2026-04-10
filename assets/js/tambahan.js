function searchMateri() {
  let input = document.getElementById("docSearch").value.toLowerCase();
  let cards = document.getElementsByClassName("materi-item");

  for (let i = 0; i < cards.length; i++) {
    let title = cards[i].querySelector("h6").innerText.toLowerCase();
    let desc = cards[i].querySelector("p").innerText.toLowerCase();

    if (title.includes(input) || desc.includes(input)) {
      cards[i].style.display = "";
    } else {
      cards[i].style.display = "none";
    }
  }
}

function searchMateri() {
  let input = document.getElementById("docSearch").value.toLowerCase();
  let rows = document
    .getElementById("materiList")
    .getElementsByClassName("materi-item");

  for (let i = 0; i < rows.length; i++) {
    let textContent = rows[i].textContent.toLowerCase();
    if (textContent.includes(input)) {
      rows[i].style.display = "";
    } else {
      rows[i].style.display = "none";
    }
  }
}

function viewDoc(driveUrl, title) {
  // Mengubah link biasa menjadi link preview/embed
  // Contoh link drive: https://drive.google.com/file/d/ID_FILE/view
  // Harus diubah sedikit agar bisa di-embed
  let embedUrl = driveUrl.replace("/view", "/preview");

  document.getElementById("driveFrame").src = embedUrl;
  document.getElementById("documentTitle").innerText = title;
  $("#previewModal").modal("show");
}

function filterIndikator() {
  let inputSearch = document
    .getElementById("searchIndikator")
    .value.toLowerCase();
  let selectDomain = document.getElementById("filterDomain").value;
  let rows = document
    .getElementById("bodyIndikator")
    .getElementsByClassName("item-indikator");

  for (let i = 0; i < rows.length; i++) {
    let textIndikator = rows[i].cells[3].innerText.toLowerCase();
    let domainValue = rows[i].getAttribute("data-domain");

    // Logika Filter: Harus cocok dengan pencarian teks DAN pilihan dropdown
    let matchSearch = textIndikator.includes(inputSearch);
    let matchDomain = selectDomain === "" || domainValue === selectDomain;

    if (matchSearch && matchDomain) {
      rows[i].style.display = "";
    } else {
      rows[i].style.display = "none";
    }
  }
}

async function updateStatusOtomatis() {
    // Gunakan URL /exec kamu yang muncul di gambar tadi
    const urlGas = "https://script.google.com/macros/s/AKfycbzSe0WpkYSAQDO-CYYqom9ukzWiyX6hrISn-jIpptAKmFf1Ao9g_zapOK_sDgwPm7WiEg/exec";
    
    // Gunakan AllOrigins untuk membungkus data agar tidak terkena CORS 403
    const apiLink = `https://api.allorigins.win/get?url=${encodeURIComponent(urlGas)}`;
    
    console.log("Menghubungkan ke database Sheets melalui Proxy...");

    try {
        const response = await fetch(apiLink);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const rawData = await response.json();
        // AllOrigins membungkus data di dalam properti 'contents'
        const data = JSON.parse(rawData.contents); 
        
        console.log("Data Berhasil Dimuat:", data);

        for (let key in data) {
            let status = data[key];
            let baris = document.getElementById(key);

            if (baris) {
                let label = baris.querySelector(".status-label");
                if (status === "Terisi") {
                    baris.classList.add("is-uploaded");
                    if (label) {
                        label.innerHTML = ' <i class="feather icon-check-circle text-c-green"></i>';
                    }
                } else {
                    if (label) label.innerHTML = "";
                    baris.classList.remove("is-uploaded");
                }
            }
        }
    } catch (error) {
        console.error("Gagal memproses data database:", error);
    }
}

// Panggil fungsi saat halaman siap
document.addEventListener('DOMContentLoaded', updateStatusOtomatis);