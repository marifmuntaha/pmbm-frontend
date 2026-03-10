export const formatIDR = (money: number|undefined|null): string => {
    return money ? new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(money) : 'Rp. 0'
}

export const formatCurrency = (value: number|null): string => {
    const number = String(value).replace(/[^0-9]/g, '');
    if (value !== null && value < 0) return "(" + number.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ")"
    else return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

export const formatNumber = (value: string): number => {
    const number = String(value).replace(/[^0-9]/g, '');
    return parseInt(number)
}