export const CONSTS = {
    trashStatus: {
        "-20": {
            name: "отменена",
            colorName: "gray",
            colorHEX: "#80808085",
        },

        "0": {
            name: "не проверена",
            colorName: "yellow",
            colorHEX: "#ffff0085",
        },

        "10": {
            name: "переданно в спец. органы",
            colorName: "orange",
            colorHEX: "#ffa50085",
        },
        
        "20": {
            name: "проверена",
            colorName: "red",
            colorHEX: "#ff000085",
        },

        "30": {
            name: "идет уборка",
            colorName: "lightBlue",
            colorHEX: "#ADD8E6",
        },

        "40": {
            name: "убрана",
            colorName: "green",
            colorHEX: "#00800085",
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
//-20   - gray, отменена
//0     - yellow, не проверена
//10    - orange, переданно в спец. органы
//20    - red, проверена
//30    - ligthblue, идет уборка
//40    - green, убрана
