import { CONSTS } from './constants.js';
import { header } from '../components/header.js';
import { trashCategory } from '../components/trashCategory.js';
import { trashStatus } from '../components/trashStatus.js';
import { footer } from '../components/footer.js';

const trashStatuses = Object.keys(CONSTS.trashStatus);

const insertHTMLElementsToPageByTagName = (tagName, DOMElement) => {
    return document.getElementsByTagName(tagName)[0].insertAdjacentHTML('beforeend', DOMElement);
};

const fillManageMapViewPoints = (trashManageMapViewPointsHTMLElements) => {
    return document.getElementById("manage-map-view-points").insertAdjacentHTML("afterbegin", trashManageMapViewPointsHTMLElements);
}

const getCurrentYearAndInsertIntoFooter = () => {
    return document.getElementById("current-year").textContent = new Date().getFullYear();
};

const fillTrashCategory = (CONSTS) => {
    const trashCategory = document.getElementById("trash-category");
    const trashCategories = Object.keys(CONSTS.trashCategory);

    for (let i = 0; i < trashCategories.length; i += 1) {
        const trashCategoryID = trashCategories[i];
        
        trashCategory.insertAdjacentHTML('beforeend', `
            <div>
                <input type="checkbox" id="trashCategory_${trashCategoryID}" checked>
                <label for="trashCategory_${trashCategoryID}"><b>${CONSTS.trashCategory[trashCategoryID].iconContent}</b> - ${CONSTS.trashCategory[trashCategoryID].name}</label>
            </div>
        `);
    }

    return trashCategory;
};

const fillTrashStatus = (CONSTS, trashStatuses) => {
    const trashStatus = document.getElementById("trash-status");

    for (let i = 0; i < trashStatuses.length; i += 1) {
        const trashStatusID = trashStatuses[i];
    
        trashStatus.insertAdjacentHTML('beforeend', `
            <div>
                <input type="checkbox" id="trashStatus_${trashStatusID}" checked>
                <label for="trashStatus_${trashStatusID}">
                    <span style="background-color: ${CONSTS.trashStatus[trashStatusID].colorHEX}">${CONSTS.trashStatus[trashStatusID].name}</span>
                </label>
            </div>
        `);
    }

    return trashStatus;
};

const changeSelectionTrashStatuses = (trashStatusesArray, selectValue) => {
    for (let i = 0; i < trashStatusesArray.length; i += 1) {
        document.getElementById(`trashStatus_${trashStatusesArray[i]}`).checked = selectValue;
    }
}

const addHandlerToTrashStatus_AllStatusCheckbox = (changeSelectionTrashStatuses, trashStatuses) => {
    const trashStatus_AllStatusCheckbox = document.getElementById("trashStatus_AllStatus");

    trashStatus_AllStatusCheckbox.addEventListener('change', () => {
        if (trashStatus_AllStatusCheckbox.checked) {
            changeSelectionTrashStatuses(trashStatuses, true);
        } else {
            changeSelectionTrashStatuses(trashStatuses, false);
        }
    });

    return trashStatus_AllStatusCheckbox;
};

insertHTMLElementsToPageByTagName('header', header);
fillManageMapViewPoints(trashStatus);
fillManageMapViewPoints(trashCategory);
insertHTMLElementsToPageByTagName('footer', footer);
getCurrentYearAndInsertIntoFooter();
fillTrashCategory(CONSTS);
fillTrashStatus(CONSTS, trashStatuses);
addHandlerToTrashStatus_AllStatusCheckbox(changeSelectionTrashStatuses, trashStatuses);
