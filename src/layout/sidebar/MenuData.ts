const menuAdmin = [
    {
        icon: "monitor",
        text: "Dashboard",
        link: "/dashboard",
    },
    {
        icon: "archived",
        text: "Master Data",
        subMenu: [
            {
                text: "Tahun Pelajaran",
                link: "/master-data/tahun-pelajaran",
            },
            {
                text: "Program PONPES",
                link: "/master-data/program-ponpes",
            },
            {
                text: "Konfigurasi Pembayaran",
                link: "/master-data/konfigurasi-pembayaran",
            },
            {
                text: "Aturan Umum",
                link: "/master-data/aturan-umum",
            },
        ],
    },
    {
        icon: "building",
        text: "Lembaga",
        subMenu: [
            {
                text: "Daftar Lembaga",
                link: "/lembaga/data-lembaga",
            }
        ],
    },
    {
        icon: "file-text",
        text: "Laporan",
        subMenu: [
            {
                text: "Laporan Pendaftar",
                link: "/laporan/pendaftar"
            },
            {
                text: "Laporan Tagihan",
                link: "/laporan/tagihan"
            },
            {
                text: "Laporan Potongan",
                link: "/laporan/potongan"
            },
            {
                text: "Laporan Pembayaran",
                link: "/laporan/pembayaran"
            }
        ]
    },
    {
        icon: "bell",
        text: "Pengumuman",
        link: "/pengumuman",
    },
    {
        icon: "users",
        text: "Data Pengguna",
        link: "/data-pengguna",
    },
    {
        icon: "live",
        text: "Layanan",
        link: "/test-integrasi",
    },
    {
        icon: "setting",
        text: "Pengaturan",
        subMenu: [
            {
                text: "Whatsapp",
                link: "/pengaturan/whatsapp",
            }
        ],

    },
    {
        icon: "file-text",
        text: "Log Sistem",
        link: "/log-sistem",
    }
];

const menuStudent = [
    {
        icon: "monitor",
        text: "Beranda",
        link: "/dashboard",
    },
    {
        icon: "file",
        text: "Pendaftaran",
        subMenu: [
            { text: 'Data Pribadi', link: '/pendaftaran/data-pribadi' },
            { text: 'Data Orangtua', link: '/pendaftaran/data-orangtua' },
            { text: 'Data Tempat Tinggal', link: '/pendaftaran/data-tempat-tinggal' },
            { text: 'Program Pilihan', link: '/pendaftaran/program-pilihan' },
            { text: 'Data Sekolah Asal', link: '/pendaftaran/data-sekolah-asal' },
            { text: 'Data Prestasi', link: '/pendaftaran/data-prestasi' },
            { text: 'Unggah Berkas', link: '/pendaftaran/unggah-berkas' },
        ]
    },
    {
        icon: "cc-alt",
        text: "Pembayaran",
        link: "/pembayaran",
    },
    {
        icon: "printer",
        text: "Cetak Kartu",
        link: "/cetak-kartu",
    }
];

const menuTreasurer = [
    {
        icon: "monitor",
        text: "Beranda",
        link: "/dashboard",
    },
    {
        icon: "archive",
        text: "Master Data",
        subMenu: [
            {
                text: "Item Pembayaran",
                link: "/master-data/item-pembayaran",
            }
        ],
    },
    {
        icon: "users",
        text: "Data Pendaftar",
        link: "/data-pendaftar"
    },
    {
        icon: "file-docs",
        text: "Data Tagihan",
        link: "/data-tagihan",

    },
    {
        icon: "cc-alt",
        text: "Pembayaran",
        link: "/pembayaran",
    },
    {
        icon: "money",
        text: "Arus Kas",
        link: "/arus-kas",
    },
    {
        icon: "file-text",
        text: "Laporan",
        subMenu: [
            {
                text: "Laporan Tagihan",
                subMenu: [
                    {text: "Tagihan Per Siswa", link: "/laporan/tagihan/siswa"},
                    {text: "Tagihan Per Item", link: "/laporan/tagihan/Item"},
                ]
            },
            {
                text: "Laporan Pembayaran",
                link: "/laporan/pembayaran"
            }
        ]
    }
];

const menuOperator = [
    {
        icon: "monitor",
        text: "Beranda",
        link: "/",
    },
    {
        icon: "archive",
        text: "Master Data",
        subMenu: [
            {
                text: "Aktifitas Lembaga",
                link: "/master-data/aktifitas-lembaga",
            },
            {
                text: "Program Madrasah",
                link: "/master-data/program-lembaga",
            },
            {
                text: "Periode Pendaftaran",
                link: "/master-data/periode-pendaftaran",
            },
            {
                text: "Aturan Lembaga",
                link: "/master-data/aturan-lembaga",
            }
        ],
    },
    {
        icon: "building",
        text: "Data Lembaga",
        link: "/data-lembaga",
    },
    {
        icon: "users",
        text: "Data Pendaftar",
        link: "/data-pendaftar",
    },
    {
        icon: "bell",
        text: "Pengumuman",
        link: "/pengumuman",
    },
    {
        icon: "users",
        text: "Data Pengguna",
        link: "/data-pengguna",
    },
    {
        icon: "setting",
        text: "Pengaturan",
        subMenu: [
            {
                text: "Whatsapp",
                link: "/pengaturan/whatsapp",
            }
        ],

    }
];

const menuBoarding = [
    {
        icon: "monitor",
        text: "Beranda",
        link: "/",
    },
    {
        icon: "archive",
        text: "Master Data",
        subMenu: [
            {
                text: "Data Kamar",
                link: "/master-data/data-kamar",
            }
        ],
    },
    {
        icon: "users",
        text: "Data Santri",
        link: "/data-pendaftar",
    }
];

const menuTeller = [
    {
        icon: "monitor",
        text: "Beranda",
        link: "/",
    },
    {
        icon: "money",
        text: "Transaksi",
        link: "/transaksi",
    },
    {
        icon: "users",
        text: "Data Pendaftar",
        link: "/data-pendaftar",
    }
]

const menuDefault = [
    {
        icon: "monitor",
        text: "Beranda",
        link: "/",
    },
    {
        icon: "file",
        text: "Aturan & Prosedur",
        link: "/aturan-prosedur",
    },
    {
        icon: "calendar",
        text: "Jadwal Pelaksanaan",
        link: "/jadwal-pelaksanaan",
    },
    {
        icon: "list-round",
        text: "Alur Pelaksanaan",
        link: "/alur-pelaksanaan",
    },
];

export { menuDefault, menuAdmin, menuTreasurer, menuOperator, menuStudent, menuBoarding, menuTeller };
