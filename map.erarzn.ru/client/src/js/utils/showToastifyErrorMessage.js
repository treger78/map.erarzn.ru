export const showToastifyErrorMessage = () => {
    return Toastify({
        text: 'Произошла ошибка! Попробуйте снова.',
        duration: 3000,
        gravity: 'top',
        position: 'center',
        style: {
            background: '#ff0000bd' //red
        },
    }).showToast();
};
