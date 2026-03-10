import {Bounce, toast, type ToastOptions} from "react-toastify";

export const RToast = (message: string, variant: string = 'danger') => {
    const option: ToastOptions = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    }

    switch (variant) {
        case 'success':
            toast.success(message, option);
            break;
        case 'info':
            toast.info(message, option);
            break;
        case 'warning':
            toast.warning(message, option);
            break;
        default:
            toast.error(message, option);
    }
}