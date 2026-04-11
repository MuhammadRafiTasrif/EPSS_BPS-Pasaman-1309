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

function searchMateri2() {
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

// Konfigurasi
const spreadsheetId = "1w8aWjrc4jUToGymUxAfngIMb-DZ1qsiaWVQbCn6qvDY";

// Fungsi untuk mengganti dinas (dipanggil saat tombol diklik)
async function gantiDinas(namaSheet) {
    const judul = document.getElementById("judulDinas");
    if (judul) judul.innerText = "Progres: " + (namaSheet === 'Pendidikan' ? 'Dinas Pendidikan' : 'Dinas Perkim, Perhubungan & LH');
    
    // Update tampilan tombol agar terlihat mana yang aktif
    document.querySelectorAll('.btn-group .btn').forEach(btn => {
        btn.classList.replace('btn-primary', 'btn-outline-primary');
    });
    event.currentTarget.classList.replace('btn-outline-primary', 'btn-primary');

    await updateStatusOtomatis(namaSheet);
}

// Fungsi utama ambil data
async function updateStatusOtomatis(sheetName = "Pendidikan") {
    const apiLink = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

    try {
        // RESET TAMPILAN (Penting agar tidak tumpang tindih)
        document.querySelectorAll(".status-label").forEach(el => el.innerHTML = "");
        document.querySelectorAll(".item-indikator").forEach(el => el.classList.remove("is-uploaded"));

        const response = await fetch(apiLink);
        const text = await response.text();
        const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\)/);
        
        if (!match) return;
        
        const jsonData = JSON.parse(match[1]);
        const rows = jsonData.table.rows;
        let terisiCount = 0;
        const totalIndikator = 38;

        rows.forEach(row => {
            const idIndikator = row.c[0] ? row.c[0].v : null; 
            const status = row.c[2] ? row.c[2].v : null;

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

        updateProgressBar(terisiCount, totalIndikator);

    } catch (error) {
        console.error("Gagal sinkronisasi:", error);
    }
}

function updateProgressBar(count, total) {
    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");
    const persentase = Math.round((count / total) * 100);

    if (progressBar) {
        progressBar.style.width = persentase + "%";
        progressBar.innerText = persentase + "%";
    }
    if (progressText) {
        progressText.innerText = `${count} / ${total} Indikator Terpenuhi`;
    }
}

// SOLUSI SIDEBAR: Gunakan window.onload agar script template jalan duluan
window.onload = function() {
    console.log("Template siap, sidebar aktif.");
    // Jalankan ambil data setelah semua script template selesai diproses
    setTimeout(() => {
        updateStatusOtomatis("Pendidikan");
    }, 500); 
};

// Fungsi Search (Hanya satu versi agar tidak bentrok)
function filterIndikator() {
    let inputSearch = document.getElementById("searchIndikator").value.toLowerCase();
    let selectDomain = document.getElementById("filterDomain").value;
    let rows = document.getElementsByClassName("item-indikator");

    for (let i = 0; i < rows.length; i++) {
        let textIndikator = rows[i].innerText.toLowerCase();
        let domainValue = rows[i].getAttribute("data-domain");

        let matchSearch = textIndikator.includes(inputSearch);
        let matchDomain = selectDomain === "" || domainValue === selectDomain;

        rows[i].style.display = (matchSearch && matchDomain) ? "" : "none";
    }
}

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

