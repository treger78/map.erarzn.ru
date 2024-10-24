import { showMessage } from '../utils/showMessage.js';

export const getTrashPoints = async () => {
    try {
        const response = await fetch('/trash-points');
        const data = await response.json();

        showMessage({ text: data.message, color: data.messageColor });

        return data;
    } catch (error) {
        showMessage({ text: error, type: 'error' });
    }
};
