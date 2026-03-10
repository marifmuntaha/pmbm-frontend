export const getPaymentStatusText = (value?: number | string) => {
    switch (Number(value)) {
        case 1:
            return 'Menunggu Pembayaran'
        case 2:
            return 'Lunas'
        default:
            return 'Draft'
    }
}

export const getPaymentStatusColor = (value?: number | string) => {
    switch (Number(value)) {
        case 1:
            return 'warning'
        case 2:
            return 'success'
        default:
            return 'light'
    }
}
