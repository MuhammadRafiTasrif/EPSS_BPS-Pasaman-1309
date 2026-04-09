function searchMateri() {
    let input = document.getElementById('docSearch').value.toLowerCase();
    let cards = document.getElementsByClassName('materi-item');
    
    for (let i = 0; i < cards.length; i++) {
        let title = cards[i].querySelector('h6').innerText.toLowerCase();
        let desc = cards[i].querySelector('p').innerText.toLowerCase();
        
        if (title.includes(input) || desc.includes(input)) {
            cards[i].style.display = "";
        } else {
            cards[i].style.display = "none";
        }
    }
}

function searchMateri() {
    let input = document.getElementById('docSearch').value.toLowerCase();
    let rows = document.getElementById('materiList').getElementsByClassName('materi-item');
    
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
    let embedUrl = driveUrl.replace('/view', '/preview');
    
    document.getElementById('driveFrame').src = embedUrl;
    document.getElementById('documentTitle').innerText = title;
    $('#previewModal').modal('show');
}


function filterIndikator() {
    let inputSearch = document.getElementById("searchIndikator").value.toLowerCase();
    let selectDomain = document.getElementById("filterDomain").value;
    let rows = document.getElementById("bodyIndikator").getElementsByClassName("item-indikator");

    for (let i = 0; i < rows.length; i++) {
        let textIndikator = rows[i].cells[3].innerText.toLowerCase();
        let domainValue = rows[i].getAttribute("data-domain");

        // Logika Filter: Harus cocok dengan pencarian teks DAN pilihan dropdown
        let matchSearch = textIndikator.includes(inputSearch);
        let matchDomain = (selectDomain === "" || domainValue === selectDomain);

        if (matchSearch && matchDomain) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}

