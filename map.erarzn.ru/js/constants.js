export const CONSTS = {
    trashStatus: {
        "-20": {
            name: "отменена",
            color: "gray",
        },

        "0": {
            name: "не проверена",
            color: "yellow",
        },

        "10": {
            name: "переданно в спец. органы",
            color: "orange",
        },
        
        "20": {
            name: "проверена",
            color: "red",
        },

        "30": {
            name: "идет уборка",
            color: "lightBlue",
        },

        "40": {
            name: "убрана",
            color: "green",
        }
    },
    
    trashCategory: {
        "10": {
            name: "строительный мусор",
            iconContent: 'С'
        },

        "20": {
            name: "бытовые отходы",
            iconContent: 'Б'
        },

        "30": {
            name: "промышленные отходы",
            iconContent: 'П'
        }
    }
};

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
