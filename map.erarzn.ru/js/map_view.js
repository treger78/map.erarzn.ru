import { CONSTS } from './constants.js';
import trashPoints from './trash_points.js';

ymaps.ready(init);

function init() {
    const map = new ymaps.Map("map", {
        center: [54.61, 39.72],
        zoom: 9,
        type: 'yandex#hybrid'
    });
  
    const addPlacemark = (point, CONSTS) => {
        return map.geoObjects.add(
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
    };

    for (let i = 0; i < trashPoints.length; i += 1) {
        addPlacemark(trashPoints[i], CONSTS);
    }

    const refreshTotalTrashPoints = (map) => {
        document.getElementById("total-trash-points").textContent = map.geoObjects.getLength();
    };

    refreshTotalTrashPoints(map);

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

    const getSelectedManageMapViewPointsCheckboxes = (trashMapViewFiltersIndexes, trashMapViewManageName) => {
        const selectedTrashMapViewManageCheckboxes = [];

        for (let i = 0; i < trashMapViewFiltersIndexes.length; i += 1) {
            const trashMapViewManageCheckbox = document.getElementById(`${trashMapViewManageName}_${trashMapViewFiltersIndexes[i]}`);

            if (trashMapViewManageCheckbox.checked) selectedTrashMapViewManageCheckboxes.push(trashMapViewFiltersIndexes[i]);
        }

        return selectedTrashMapViewManageCheckboxes;
    };

    document.getElementById("refresh-map-button").addEventListener('click', () => {
        map.geoObjects.removeAll();

        const selectedTrashCategory = getSelectedManageMapViewPointsCheckboxes(Object.keys(CONSTS.trashCategory), 'trashCategory');
        const selectedTrashStatuses = getSelectedManageMapViewPointsCheckboxes(Object.keys(CONSTS.trashStatus), 'trashStatus');;

        for (let i = 0; i < trashPoints.length; i += 1) {
            const point = trashPoints[i];

            if (selectedTrashCategory.includes(point.categ) && selectedTrashStatuses.includes(point.status)) {
                addPlacemark(point, CONSTS);
            }
        }

        refreshTotalTrashPoints(map);
    });
}
