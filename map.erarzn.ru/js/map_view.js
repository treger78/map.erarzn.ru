import { CONSTS } from './constants.js';
import trashPoints from './trash_points.js';

ymaps.ready(init);

function init() {
    const map = new ymaps.Map("map", {
        center: [54.61, 39.72],
        zoom: 9,
        type: 'yandex#hybrid'
    });
    
    for (let i = 0; i < trashPoints.length; i += 1) {
        const point = trashPoints[i];

        map.geoObjects.add(
            new ymaps.Placemark(
                [point.lat, point.lng],
                {
                    iconContent: CONSTS.trashCategory[point.categ].iconContent,
                    balloonContentHeader: `${point.id}. ${point.name}`,
                    balloonContentBody: `
                    <div><small>${CONSTS.trashCategory[point.categ].name}</small></div>
                    <div><small>Добавил точку: волонтёр</small></div>
                    <div><small>Статус точки: <span style="background-color: ${CONSTS.trashStatus[point.status].colorHEX}">${CONSTS.trashStatus[point.status].name}</span></small></div>
                    `,
                    balloonContentFooter: `
                    <small class="balloon-footer-detail">Подробно →</small>
                    `,
                },
                {
                    preset: `islands#${CONSTS.trashStatus[point.status].colorName}Icon`,
                    hideIconOnBalloonOpen: false,
                }
            )
        );
    }

    document.getElementById("total-trash-points").textContent = map.geoObjects.getLength();

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

    //TODO: сделать рефакториг, не было времени причесать код
    document.getElementById("refresh-map-button").addEventListener('click', () => {
        const trashCategories = Object.keys(CONSTS.trashCategory);
        const trashStatuses = Object.keys(CONSTS.trashStatus);

        map.geoObjects.removeAll();

        const selectedTrashCategory = [];

        for (let i = 0; i < trashCategories.length; i += 1) {
            const trashCategoryCheckbox = document.getElementById(`trashCategory_${trashCategories[i]}`);

            if (trashCategoryCheckbox.checked) selectedTrashCategory.push(trashCategories[i]);
        }

        const selectedTrashStatuses = [];

        for (let i = 0; i < trashStatuses.length; i += 1) {
            const trashStatuseCheckbox = document.getElementById(`trashStatus_${trashStatuses[i]}`);

            if (trashStatuseCheckbox.checked) selectedTrashStatuses.push(trashStatuses[i]);
        }

        for (let i = 0; i < trashPoints.length; i += 1) {
            const point = trashPoints[i];

            if (selectedTrashCategory.includes(point.categ) && selectedTrashStatuses.includes(point.status)) {
                map.geoObjects.add(
                    new ymaps.Placemark(
                        [point.lat, point.lng],
                        {
                            iconContent: CONSTS.trashCategory[point.categ].iconContent,
                            balloonContentHeader: `${point.id}. ${point.name}`,
                            balloonContentBody: `
                            <div><small>${CONSTS.trashCategory[point.categ].name}</small></div>
                            <div><small>Добавил точку: волонтёр</small></div>
                            <div><small>Статус точки: <span style="background-color: ${CONSTS.trashStatus[point.status].colorHEX}">${CONSTS.trashStatus[point.status].name}</span></small></div>
                            `,
                            balloonContentFooter: `
                            <small class="balloon-footer-detail">Подробно →</small>
                            `,
                        },
                        {
                            preset: `islands#${CONSTS.trashStatus[point.status].colorName}Icon`,
                            hideIconOnBalloonOpen: false,
                        }
                    )
                );
            }
        }
    });

}
