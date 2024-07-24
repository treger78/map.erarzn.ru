import trashPoints from './trash_points.js';

ymaps.ready(init);

function init() {
    const map = new ymaps.Map("map", {
        center: [54.61, 39.72],
        zoom: 9,
        type: 'yandex#hybrid'
    });

    //categ - вид отмеченного на карте мусора:
    //10 - строительный мусор
    //20 - бытовые отходы
    //30 - промышленные

    //status - статус отмеченного на карте мусора:
    //-20 - gray, отменена
    //0 - yellow, не проверена
    //10 - orange, переданно в спец. органы
    //20 - red, проверена
    //30 - #33ffff ~ligthblue, идет уборка
    //40 - green, убрана
    
    for (let i = 0; i < trashPoints.length; i += 1) {
        const point = trashPoints[i];
        let iconContent;
        let presetColor;
        let trashCategory;

        switch (point.categ) {
            case '10': {
                iconContent = 'С';
                trashCategory = 'строительный мусор';
            }; break;

            case '20': {
                iconContent = 'Б';
                trashCategory = 'бытовые отходы';
            }; break;

            case '30': {
                iconContent = 'П';
                trashCategory = 'промышленные отходы';
            }; break;
        }

        switch (point.status) {
            case "-20": presetColor = 'islands#grayIcon';
            break;

            case "0": presetColor = 'islands#yellowIcon';
            break;

            case "10": presetColor = 'islands#orangeIcon';
            break;

            case "20": presetColor = 'islands#redIcon';
            break;
            
            case "30": presetColor = 'islands#lightBlueIcon';
            break;

            case "40": presetColor = 'islands#greenIcon';
            break;
        }

        map.geoObjects.add(
            new ymaps.Placemark(
                [point.lat, point.lng],
                {
                    iconContent: iconContent,
                    balloonContentHeader: `${point.id}. ${point.name}`,
                    balloonContentBody: `
                    ${trashCategory}
                    `,
                    balloonContentFooter: 'Подвал',
                },
                {
                    preset: presetColor,
                    hideIconOnBalloonOpen: false,
                }
            )
        );
    }

    document.getElementById("searchpoint_button").addEventListener('click', () => {
        const pointIDSearchInput = document.getElementById('searchpoint_input');
        const pointID = pointIDSearchInput.value;

        if (!pointID) return undefined;

        for (let i = 0; i < map.geoObjects.getLength(); i += 1) {
            const placemark = map.geoObjects.get(i);
            const placemarkID = placemark.properties._data.balloonContentHeader.split('.')[0];

            if (placemarkID === pointID) {
                placemark.balloon.open();

                pointIDSearchInput.value = '';

                break;
            }
        }
    });
}
