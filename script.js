let infoBulan = "";
let infoTahun = "";
let infoTanggal = "";
let infoJam = "";
let statusTUPas = false; 

function updateWaktu() {
    const sekarang = new Date();
    const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    
    infoBulan = namaBulan[sekarang.getMonth()];
    infoTahun = sekarang.getFullYear().toString();
    infoTanggal = sekarang.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    infoJam = sekarang.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const elWaktu = document.getElementById('waktu-realtime');
    const elPeriode = document.getElementById('periode-otomatis');

    if (elWaktu) elWaktu.innerText = sekarang.toLocaleDateString('id-ID', { weekday: 'long' }) + ", " + infoTanggal + " | " + infoJam + " WIB";
    if (elPeriode) elPeriode.innerText = "Database Periode: " + infoBulan + " " + infoTahun;
}

setInterval(updateWaktu, 1000);

window.onload = function() {
    updateWaktu();
    cekKunciPerangkatHP();
};

function cekKunciPerangkatHP() {
    const selectNama = document.getElementById('nama');
    const widgetPerangkat = document.getElementById('status-perangkat');
    const namaTersimpan = localStorage.getItem("mahad_iqrasunnah_user_device");

    if (namaTersimpan) {
        selectNama.value = namaTersimpan;
        selectNama.disabled = true; 
        widgetPerangkat.innerText = "🔒 HP Terkunci Atas Nama: " + namaTersimpan;
        widgetPerangkat.className = "perangkat-widget perangkat-locked";
    } else {
        selectNama.value = "";
        selectNama.disabled = false;
        widgetPerangkat.innerText = "📱 Perangkat Baru: Silakan pilih nama Anda untuk dikunci di HP ini.";
        widgetPerangkat.className = "perangkat-widget";
    }
}

function pilihTipePelaporan() {
    const tipe = document.querySelector('input[name="tipe_kehadiran"]:checked').value;
    const grupStatusHadir = document.getElementById('grup-status-hadir');
    const grupKeterangan = document.getElementById('grup-keterangan');
    const inputKeterangan = document.getElementById('keterangan');

    if (tipe === 'Kehadiran') {
        grupStatusHadir.style.display = 'block';
        grupKeterangan.style.display = 'none';
        if (inputKeterangan) { inputKeterangan.required = false; inputKeterangan.value = ''; }
    } else {
        grupStatusHadir.style.display = 'none';
        grupKeterangan.style.display = 'block';
        if (inputKeterangan) inputKeterangan.required = true;
    }
}

function kirimDataAbsen(event) {
    event.preventDefault();
    const btn = document.getElementById('tombolKirim');
    const selectNama = document.getElementById('nama');
    const tipeKehadiran = document.querySelector('input[name="tipe_kehadiran"]:checked').value;
    const statusWaktu = document.getElementById('status_waktu').value;
    const keterangan = document.getElementById('keterangan').value || '-';

    if (selectNama.value === "") {
        alert("Harap pilih nama Anda terlebih dahulu!");
        return;
    }

    const namaTersimpan = localStorage.getItem("mahad_iqrasunnah_user_device");
    if (!namaTersimpan) {
        localStorage.setItem("mahad_iqrasunnah_user_device", selectNama.value);
    }

    const namaFinal = localStorage.getItem("mahad_iqrasunnah_user_device");

    btn.innerText = "Memproses...";
    btn.disabled = true;

    // PASTIKAN LINK URL GOOGLE APPS SCRIPT ANDA TETAP TERTEMPEL DI SINI
    const urlGoogleScript = "https://script.google.com/macros/s/AKfycbyDVutuOrLuYMMbB6Y7m7bHZmt88-sqxnLcVEN6DNPqD8EsTiVSknysefVu_0Cr_tFy/exec";

    const queryParams = "?tanggal=" + encodeURIComponent(infoTanggal) +
                        "&bulan=" + encodeURIComponent(infoBulan) +
                        "&tahun=" + encodeURIComponent(infoTahun) +
                        "&nama=" + encodeURIComponent(namaFinal) +
                        "&tipe=" + encodeURIComponent(tipeKehadiran) +
                        "&statusWaktu=" + encodeURIComponent(statusWaktu) +
                        "&jam=" + encodeURIComponent(infoJam) +
                        "&keterangan=" + encodeURIComponent(keterangan);

    fetch(urlGoogleScript + queryParams, { method: 'POST' })
    .then(response => {
        alert("Alhamdulillah, Absensi " + tipeKehadiran + " atas nama " + namaFinal + " berhasil tercatat secara otomatis.");
        document.getElementById('formAbsensi').reset();
        pilihTipePelaporan();
        cekKunciPerangkatHP();
    })
    .catch(error => {
        alert("Simulasi Berhasil! Sambungkan URL Apps Script untuk menyimpan data nyata.");
        cekKunciPerangkatHP();
    })
    .finally(() => {
        btn.innerText = "Kirim Absensi";
        btn.disabled = false;
    });
}

function bukaFiturLaporan() {
    const passAdmin = prompt("Masukkan Kata Sandi Pengurus Ma'had:");
    if (passAdmin === "adminmahad") {
        window.open("https://google.com", "_blank");
    } else {
        alert("Kata sandi salah!");
    }
}

function bukaFiturResetHP() {
    const passAdmin = prompt("Masukkan Kata Sandi Admin Ma'had:");
    if (passAdmin === "adminmahad") {
        localStorage.removeItem("mahad_iqrasunnah_user_device");
        alert("Kunci perangkat dicabut. Silakan refresh halaman.");
        cekKunciPerangkatHP();
    } else {
        alert("Sandi Salah!");
    }
}

function bukaPanelTU() {
    const panelTU = document.getElementById('panel-input-tu');
    const navTU = document.getElementById('nav-tu');
    
    if (statusTUPas) {
        if (panelTU.style.display === "block") {
            panelTU.style.display = "none";
            navTU.className = "btn-admin-nav";
        } else {
            panelTU.style.display = "block";
            navTU.className = "btn-admin-nav active";
        }
        return;
    }

    const passAdmin = prompt("Masukkan Kata Sandi Akses Tata Usaha (TU):");
    if (passAdmin === "adminmahad") {
        statusTUPas = true;
        panelTU.style.display = "block";
        navTU.className = "btn-admin-nav active";
        alert("Login Sukses! Panel Input Manual TU Aktif.");
    } else {
        alert("Sandi TU Salah. Akses Input Manual Ditolak!");
    }
}

function aturFormKeteranganTU() {
    const status = document.getElementById('tu_status').value;
    const inputKet = document.getElementById('tu_keterangan');
    if (status === "Izin" || status === "Sakit") {
        inputKet.value = "";
        inputKet.placeholder = "Tuliskan alasan izin/sakit guru...";
    } else {
        inputKet.value = "Diinput manual oleh TU (HP Tertinggal/Trouble)";
    }
}

function kirimAbsenManualTU(event) {
    event.preventDefault();
    const namaGuru = document.getElementById('tu_nama').value;
    const statusTU = document.getElementById('tu_status').value;
    const keteranganTU = document.getElementById('tu_keterangan').value;

    if (namaGuru === "") {
        alert("Harap pilih nama guru terlebih dahulu!");
        return;
    }

    let tipeFinal = "Kehadiran";
    let statusWaktuFinal = "Masuk";

    if (statusTU === "Hadir-Masuk") {
        tipeFinal = "Kehadiran";
        statusWaktuFinal = "Masuk";
    } else if (statusTU === "Hadir-Pulang") {
        tipeFinal = "Kehadiran";
        statusWaktuFinal = "Pulang";
    } else {
        tipeFinal = statusTU;
        statusWaktuFinal = "-";
    }

    const jamTU = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Link URL Google Apps Script Anda wajib tertempel di sini juga
    const urlGoogleScript = "https://script.google.com/macros/s/AKfycbyDVutuOrLuYMMbB6Y7m7bHZmt88-sqxnLcVEN6DNPqD8EsTiVSknysefVu_0Cr_tFy/exec";

    const queryParams = "?tanggal=" + encodeURIComponent(infoTanggal) +
                        "&bulan=" + encodeURIComponent(infoBulan) +
                        "&tahun=" + encodeURIComponent(infoTahun) +
                        "&nama=" + encodeURIComponent(namaGuru) +
                        "&tipe=" + encodeURIComponent(tipeFinal) +
                        "&statusWaktu=" + encodeURIComponent(statusWaktuFinal) +
                        "&jam=" + encodeURIComponent(jamTU) +
                        "&keterangan=" + encodeURIComponent(keteranganTU);

    fetch(urlGoogleScript + queryParams, { method: 'POST' })
    .then(response => {
        alert("Alhamdulillah, Data Absen manual " + namaGuru + " sukses disimpan oleh TU ke Google Sheets.");
        document.getElementById('formTU').reset();
        document.getElementById('tu_keterangan').value = "Diinput manual oleh TU (HP Tertinggal/Trouble)";
    })
    .catch(error => {
        alert("Simulasi TU Berhasil! (Sambungkan URL Google script untuk menyimpan data nyata).");
    });
}
