import trashPoints from './trash_points.js';
import { CONSTS } from './constants.js';

document.getElementById("current-year").textContent = new Date().getFullYear();

const newMapPointsTable = document.getElementById("new-map-points-table-body");

for (let i = trashPoints.length - 1; i > trashPoints.length - 11; i -= 1) {
    const trashPoint = trashPoints[i];

    newMapPointsTable.insertAdjacentHTML('beforeend', `
    <td><small>Дата</small></td>
    <td>${trashPoint.id}</td>
    <td class="trash-point-name">${trashPoint.name}</td>
    <td><span style="background-color: ${CONSTS.trashStatus[trashPoint.status].color}">${CONSTS.trashStatus[trashPoint.status].name}</span></td>
    <td>${CONSTS.trashCategory[trashPoint.categ].name}</td>
    <td class="volunteer-name">Волонтер</td>
    `);
}

//trashCategory - вид отмеченного на карте мусора:
//10 - строительный мусор
//20 - бытовые отходы
//30 - промышленные

//trashStatus - статус отмеченного на карте мусора:
//-20 - gray, отменена
//0 - yellow, не проверена
//10 - orange, переданно в спец. органы
//20 - red, проверена
//30 - #33ffff ~ligthblue, идет уборка
//40 - green, убрана

const trashCategory = document.getElementById("trash-category");
const trashStatus = document.getElementById("trash-status");

trashCategory.insertAdjacentHTML('beforeend', `
    <b>Виды мусора на карте:</b>
    <div>${CONSTS.trashCategory[10].name}</div>
    <div>${CONSTS.trashCategory[20].name}</div>
    <div>${CONSTS.trashCategory[30].name}</div>
`);

trashStatus.insertAdjacentHTML('beforeend', `
    <b>Статус:</b>
    <div>Все статусы</div>
    <div style="background-color: ${CONSTS.trashStatus['-20'].color}">${CONSTS.trashStatus['-20'].name}</div>
    <div style="background-color: ${CONSTS.trashStatus['0'].color}">${CONSTS.trashStatus['0'].name}</div>
    <div style="background-color: ${CONSTS.trashStatus['10'].color}">${CONSTS.trashStatus['10'].name}</div>
    <div style="background-color: ${CONSTS.trashStatus['20'].color}">${CONSTS.trashStatus['20'].name}</div>
    <div style="background-color: ${CONSTS.trashStatus['30'].color}">${CONSTS.trashStatus['30'].name}</div>
    <div style="background-color: ${CONSTS.trashStatus['40'].color}">${CONSTS.trashStatus['40'].name}</div>
`);
