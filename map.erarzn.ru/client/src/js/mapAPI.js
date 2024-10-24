import { CONSTS } from './constants.js';
import { getTrashPoints } from './api/getTrashPoints.js';

function init(trashPoints) {
    const map = new ymaps.Map("map", {
        center: [54.61, 39.72],
        zoom: 9,
        type: 'yandex#hybrid'
    });

    const addPlacemark = (map, point, CONSTS) => {
        return map.geoObjects.add(
            new ymaps.Placemark(
                [point.lat, point.lng],
                {
                    iconContent: CONSTS.trashCategory[point.categ].iconContent,
                    balloonContentHeader: `${point.id}. ${point.name}`,
                    balloonContentBody: `
                    <div><small>${CONSTS.trashCategory[point.categ].name}</small></div>
                    <div><small>Добавил точку: ${point.User?.name || 'волонтёр'}</small></div>
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

    const refreshTotalTrashPoints = (map) => {
        return document.getElementById("total-trash-points").textContent = map.geoObjects.getLength();
    };

    const fillMap = (trashPoints, map, CONSTS, refreshTotalTrashPoints) => {
        for (let i = 0; i < trashPoints.length; i += 1) {
            addPlacemark(map, trashPoints[i], CONSTS);
        }

        refreshTotalTrashPoints(map);

        return map;
    };

    const addHandlerToSearchPointButton = (map) => {
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

        return map;
    };

    const getSelectedManageMapViewPointsCheckboxes = (trashMapViewFiltersIndexes, trashMapViewFiltersManageName) => {
        const selectedTrashMapViewManageCheckboxes = [];

        for (let i = 0; i < trashMapViewFiltersIndexes.length; i += 1) {
            const trashMapViewManageCheckbox = document.getElementById(`${trashMapViewFiltersManageName}_${trashMapViewFiltersIndexes[i]}`);

            if (trashMapViewManageCheckbox.checked) selectedTrashMapViewManageCheckboxes.push(Number(trashMapViewFiltersIndexes[i]));
        }

        return selectedTrashMapViewManageCheckboxes;
    };

    const addHandlerToRefreshMapButton = (map, getSelectedManageMapViewPointsCheckboxes, CONSTS, getTrashPoints, addPlacemark, refreshTotalTrashPoints) => {
        document.getElementById("refresh-map-button").addEventListener('click', async () => {
            map.geoObjects.removeAll();
    
            const selectedTrashCategory = getSelectedManageMapViewPointsCheckboxes(Object.keys(CONSTS.trashCategory), 'trashCategory');
            const selectedTrashStatuses = getSelectedManageMapViewPointsCheckboxes(Object.keys(CONSTS.trashStatus), 'trashStatus');;
            
            const data = await getTrashPoints();
            const trashPoints = data.trashPoints;

            for (let i = 0; i < trashPoints.length; i += 1) {
                const point = trashPoints[i];
    
                if (selectedTrashCategory.includes(point.categ) && selectedTrashStatuses.includes(point.status)) {
                    addPlacemark(map, point, CONSTS);
                }
            }
    
            refreshTotalTrashPoints(map);
        });

        return map;
    };

    fillMap(trashPoints, map, CONSTS, refreshTotalTrashPoints);
    addHandlerToSearchPointButton(map);
    addHandlerToRefreshMapButton(map, getSelectedManageMapViewPointsCheckboxes, CONSTS, getTrashPoints, addPlacemark, refreshTotalTrashPoints);
}

const fillNewMapPointsTable = (trashPoints, CONSTS) => {
    const newMapPointsTable = document.getElementById("new-map-points-table-body");

    //Выбираем 10 последних добавленных свалок для отображения в таблице
    for (let i = trashPoints.length - 1; i > trashPoints.length - 11; i -= 1) {
        const trashPoint = trashPoints[i];
    
        newMapPointsTable.insertAdjacentHTML('beforeend', `
            <td><small>${new Date(trashPoint.date * 1000).toLocaleString().slice(0, -3)}</small></td>
            <td>${trashPoint.id}</td>
            <td class="trash-point-name">${trashPoint.name}</td>
            <td><span style="background-color: ${CONSTS.trashStatus[trashPoint.status].colorHEX}">${CONSTS.trashStatus[trashPoint.status].name}</span></td>
            <td>${CONSTS.trashCategory[trashPoint.categ].name}</td>
            <td class="volunteer-name">${trashPoint.User.name || 'Волонтер'}</td>
        `);
    }

    return newMapPointsTable;
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await getTrashPoints();

        ymaps.ready(() => init(data.trashPoints));

        fillNewMapPointsTable(data.trashPoints, CONSTS);
    } catch (error) {
        console.error(error);
    }
});
