export interface PrintReceiptData {
    name: string;
    amount: number;
    type: number;
    accountLabel: string;
    treasurerName: string;
    institutionName: string;
    recipientName: string;
    yearName: string;
    logoUrl?: string;
}

export const printReceipt = (data: PrintReceiptData): void => {
    const typeLabel = data.type === 2 ? 'Transaksi Masuk' : 'Transaksi Keluar';
    const amountStr = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(data.amount);
    const now = new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    const badgeColor    = data.type === 1 ? '#d4edda' : '#f8d7da';
    const badgeText     = data.type === 1 ? '#155724' : '#721c24';
    const amountColor   = data.type === 1 ? '#155724' : '#721c24';

    const html = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <title>Bukti Transaksi</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; font-size: 12pt; color: #1a1a1a; background: #fff; }
        .page {
            width: 148mm;
            min-height: 105mm;
            margin: 10mm auto;
            padding: 8mm 10mm;
            border: 1.5px solid #333;
        }
        .header { display: flex; align-items: center; gap: 12px; border-bottom: 2.5px solid #333; padding-bottom: 8px; margin-bottom: 10px; }
        .header-logo { width: 56px; height: 56px; object-fit: contain; flex-shrink: 0; }
        .header-logo-placeholder { width: 56px; flex-shrink: 0; }
        .header-text { flex: 1; text-align: center; }
        .header .yayasan { font-size: 9pt; color: #555; letter-spacing: 0.5px; margin-bottom: 2px; }
        .header .lembaga { font-size: 16pt; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; line-height: 1.2; }
        .header .tahun   { font-size: 9.5pt; color: #444; margin-top: 3px; }
        .badge { display: inline-block; padding: 3px 14px; border-radius: 12px; font-size: 9.5pt; font-weight: bold; margin-top: 8px;
            background: ${badgeColor};
            color: ${badgeText};
        }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        td { padding: 4px 6px; font-size: 10.5pt; vertical-align: top; }
        td:first-child { width: 38%; color: #555; }
        td:last-child  { font-weight: 500; }
        .amount-row td:last-child { font-size: 13pt; font-weight: bold; color: ${amountColor}; }
        .divider { border: none; border-top: 1px dashed #aaa; margin: 10px 0; }
        .signature-section { display: flex; justify-content: space-between; margin-top: 14px; gap: 12px; }
        .sign-box { flex: 1; text-align: center; }
        .sign-box .sign-label { font-size: 9.5pt; color: #555; margin-bottom: 4px; }
        .sign-box .sign-line  { border-top: 1px solid #333; margin-top: 38px; padding-top: 4px; font-size: 10pt; font-weight: bold; }
        .sign-box .sign-sub   { font-size: 8.5pt; color: #777; }
        .footer { text-align: center; margin-top: 10px; font-size: 8pt; color: #aaa; border-top: 1px solid #eee; padding-top: 6px; }
        @media print {
            body { margin: 0; }
            .page { border: 1.5px solid #333; margin: 0 auto; }
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="header">
            ${data.logoUrl
                ? `<img class="header-logo" src="${data.logoUrl}" alt="Logo ${data.institutionName}" />`
                : `<div class="header-logo-placeholder"></div>`
            }
            <div class="header-text">
                <div class="yayasan">Yayasan Darul Hikmah</div>
                <div class="lembaga">${data.institutionName}</div>
                <div class="tahun">Tahun Ajaran ${data.yearName}</div>
                <span class="badge">${typeLabel}</span>
            </div>
            ${data.logoUrl ? `<div class="header-logo-placeholder"></div>` : ``}
        </div>

        <table>
            <tr>
                <td>Tanggal</td>
                <td>${now}</td>
            </tr>
            <tr>
                <td>Rekening</td>
                <td>${data.accountLabel}</td>
            </tr>
            <tr>
                <td>Keterangan</td>
                <td>${data.name || '-'}</td>
            </tr>
            <tr class="amount-row">
                <td>Jumlah</td>
                <td>${amountStr}</td>
            </tr>
        </table>

        <hr class="divider" />

        <div class="signature-section">
            <div class="sign-box">
                <div class="sign-label">Bendahara</div>
                <div class="sign-line">${data.treasurerName}</div>
                <div class="sign-sub">Bendahara</div>
            </div>
            <div class="sign-box">
                <div class="sign-label">Penerima</div>
                <div class="sign-line">${data.recipientName || '..........................................'}</div>
                <div class="sign-sub">Penerima</div>
            </div>
        </div>

        <div class="footer">Dicetak oleh sistem PMBM &mdash; ${now}</div>
    </div>
    <script>
        window.onload = function () {
            window.print();
            window.onafterprint = function () { window.close(); };
        };
    </script>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=700,height=520');
    if (win) {
        win.document.write(html);
        win.document.close();
    }
};
