export const getTrashPoints = async () => {
    try {
        const response = await fetch('/trash-points');
        const data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
    }
};
