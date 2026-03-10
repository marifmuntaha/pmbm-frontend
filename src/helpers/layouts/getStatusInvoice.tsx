export const getStatusInvoice = (value?: string) => {
    switch (value) {
        case 'PENDING':
            return 'warning'
        case 'UNPAID':
            return 'danger'
        case 'PAID':
            return 'success'
        case 'OVERDUE':
            return 'danger'
        default:
            return 'light'
    }
}