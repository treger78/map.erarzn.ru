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

const trashCategory = document.getElementById("trash-category");
const trashStatus = document.getElementById("trash-status");
const trashCategories = Object.keys(CONSTS.trashCategory);
const trashStatuses = Object.keys(CONSTS.trashStatus);

for (let i = 0; i < trashCategories.length; i += 1) {
    const trashCategoryID = trashCategories[i];
    
    trashCategory.insertAdjacentHTML('beforeend', `
        <div>
            <input type="checkbox" id="trashCategory_${trashCategoryID}" checked>
            <label for="trashCategory_${trashCategoryID}"><b>${CONSTS.trashCategory[trashCategoryID].iconContent}</b> - ${CONSTS.trashCategory[trashCategoryID].name}</label>
        </div>
    `);
}

for (let i = 0; i < trashStatuses.length; i += 1) {
    const trashStatusID = trashStatuses[i];

    trashStatus.insertAdjacentHTML('beforeend', `
        <div>
            <input type="checkbox" id="trashStatus_${trashStatusID}" checked>
            <label for="trashStatus_${trashStatusID}">
                <span style="background-color: ${CONSTS.trashStatus[trashStatusID].color}">${CONSTS.trashStatus[trashStatusID].name}</span>
            </label>
        </div>
    `);
}
