export const showMessage = (messageConfig) => {
    const isError = messageConfig.type === 'error';

    if (isError) console.error(messageConfig.text);

    return Toastify({
        text: isError ? 'Произошла ошибка! Попробуйте снова.' : messageConfig.text,
        duration: 3000,
        gravity: 'top',
        position: 'center',
        style: {
            background: messageConfig.color || '#ff0000bd'
        },
    }).showToast();
};
