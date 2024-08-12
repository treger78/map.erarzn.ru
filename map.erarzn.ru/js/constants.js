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
