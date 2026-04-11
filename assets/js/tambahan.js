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

/**
 * DASHBOARD EPSS PASAMAN - AUTO SYNC & PROGRESS BAR
 * Deskripsi: Mengambil data status dari Google Sheets (Public) 
 * dan memperbarui status indikator serta progres bar di Dashboard.
 */

// Konfigurasi ID Spreadsheet kamu
const spreadsheetId = "1Rk1GEn8wBtOEaZAprXowlKoupOHVzDmJ2RvtqRwhwCNn4OjZ3y2uhb8NibXc6lObbvGUinYZcmMsOl";

async function gantiDinas(namaSheet) {
    // 1. Ubah Judul
    const judul = document.getElementById("judulDinas");
    if (judul) {
        judul.innerText = "Progres: " + (namaSheet === 'Pendidikan' ? 'Dinas Pendidikan' : 'Dinas Perkim, Perhubungan & LH');
    }

    // 2. Ubah Style Tombol (Active/Inactive)
    const btnP = document.getElementById("btnPendidikan");
    const btnH = document.getElementById("btnPerkim");
    if (namaSheet === 'Pendidikan') {
        btnP.classList.replace("btn-outline-primary", "btn-primary");
        btnH.classList.replace("btn-primary", "btn-outline-primary");
    } else {
        btnH.classList.replace("btn-outline-primary", "btn-primary");
        btnP.classList.replace("btn-primary", "btn-outline-primary");
    }

    // 3. Ambil Data
    await updateStatusOtomatis(namaSheet);
}

async function updateStatusOtomatis(sheetName = "Pendidikan") {
    // Link Gviz dengan parameter sheet name
    const apiLink = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

    try {
        const response = await fetch(apiLink);
        const text = await response.text();
        const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\)/);
        
        if (!match) return;
        
        const jsonData = JSON.parse(match[1]);
        const rows = jsonData.table.rows;
        let terisiCount = 0;
        const totalIndikator = 38;

        // RESET: Bersihkan semua centang dan warna baris sebelum mengisi data dinas baru
        document.querySelectorAll(".status-label").forEach(el => el.innerHTML = "");
        document.querySelectorAll(".item-indikator").forEach(el => {
            el.classList.remove("is-uploaded");
            el.style.backgroundColor = "";
        });

        // ISI DATA BARU
        rows.forEach(row => {
            const idIndikator = row.c[0] ? row.c[0].v : null; // ID di Kolom A (ind_1, ind_2, dst)
            const status = row.c[2] ? row.c[2].v : null;      // Status di Kolom C

            if (idIndikator) {
                const baris = document.getElementById(idIndikator);
                if (baris) {
                    const label = baris.querySelector(".status-label");
                    if (status === "Terisi") {
                        terisiCount++;
                        baris.classList.add("is-uploaded");
                        if (label) label.innerHTML = ' <i class="feather icon-check-circle text-c-green"></i>';
                    }
                }
            }
        });

        // UPDATE PROGRESS BAR
        const persentase = Math.round((terisiCount / totalIndikator) * 100);
        const progressBar = document.getElementById("progressBar");
        const progressText = document.getElementById("progressText");

        if (progressBar) {
            progressBar.style.width = persentase + "%";
            progressBar.innerText = persentase + "%";
            if (progressText) progressText.innerText = `${terisiCount} / ${totalIndikator} Indikator Terpenuhi`;
        }

    } catch (error) {
        console.error("Gagal memperbarui data dinas:", error);
    }
}

// Jalankan otomatis untuk Dinas Pendidikan saat pertama buka
document.addEventListener('DOMContentLoaded', () => {
    updateStatusOtomatis("Pendidikan");
});

// Default load pertama kali
document.addEventListener('DOMContentLoaded', () => {
    updateStatusOtomatis("Pendidikan");
});

/**
 * Fungsi untuk memperbarui elemen Progres Bar di HTML
 */
function updateProgressBar(count, total) {
    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");
    
    // Hitung persentase (bulatkan)
    const persentase = Math.round((count / total) * 100);

    if (progressBar && progressText) {
        // Update lebar bar dan teks di dalamnya
        progressBar.style.width = persentase + "%";
        progressBar.innerText = persentase + "%";
        progressBar.setAttribute("aria-valuenow", persentase);
        
        // Update teks keterangan di samping (Contoh: 15 / 38 Indikator)
        progressText.innerText = `${count} / ${total} Indikator Terpenuhi`;
        
        // Opsional: Ganti warna bar jika sudah 100%
        if (persentase === 100) {
            progressBar.classList.replace("bg-success", "bg-primary");
        }
    }
}

/**
 * Jalankan fungsi secara otomatis saat website dibuka
 */
document.addEventListener('DOMContentLoaded', () => {
    updateStatusOtomatis();
});

