import trashPoints from './trash_points.js';

document.getElementById("current-year").textContent = new Date().getFullYear();

const newMapPointsTable = document.getElementById("new-map-points-table-body");

for (let i = trashPoints.length - 1; i > trashPoints.length - 11; i -= 1) {
    const trashPoint = trashPoints[i];
    let trashCategory;
    let trashStatus;
    let trashStatusColor;
    
    switch (trashPoint.categ) {
        case '10': trashCategory = 'строительный мусор';
        break;

        case '20': trashCategory = 'бытовые отходы';
        break;

        case '30': trashCategory = 'промышленные отходы';
        break;
    }

    switch (trashPoint.status) {
        case "-20": {
            trashStatus = 'отменена';
            trashStatusColor = 'gray';
        }; break;

        case "0": {
            trashStatus = 'не проверена';
            trashStatusColor = 'yellow';
        }; break;

        case "10": {
            trashStatus = 'переданно в спец. органы';
            trashStatusColor = 'orange';
        }; break;

        case "20": {
            trashStatus = 'проверена';
            trashStatusColor = 'red';
        }; break;
        
        case "30": {
            trashStatus = 'идет уборка';
            trashStatusColor = 'lightBlue';
        }; break;

        case "40": {
            presetColor = 'убрана';
            trashStatusColor = 'green';
        }; break;
    }

    newMapPointsTable.insertAdjacentHTML('beforeend', `
    <td><small>Дата</small></td>
    <td>${trashPoint.id}</td>
    <td class="trash-point-name">${trashPoint.name}</td>
    <td><span style="background-color: ${trashStatusColor}">${trashStatus}</span></td>
    <td>${trashCategory}</td>
    <td class="volunteer-name">Волонтер</td>
    `);
}
