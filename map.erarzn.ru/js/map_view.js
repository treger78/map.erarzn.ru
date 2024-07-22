ymaps.ready(init);

function init() {
    const map = new ymaps.Map("map", {
        center: [54.61, 39.72],
        zoom: 9,
        type: 'yandex#hybrid'
    });

    //categ - вид отмеченного на карте мусора:
    //10 - строительный мусор
    //20 - бытовые отходы
    //30 - промышленные

    //status - статус отмеченного на карте мусора:
    //-20 - grey, отменена
    //0 - yellow, не проверена
    //10 - orange, переданно в спец. органы
    //20 - red, проверена
    //30 - #33ffff ~ligthblue, идет уборка
    //40 - green, убрана

    const coords = [
        [54.60, 39.70],
        [54.61, 39.71],
        [54.62, 39.72]
    ];
    
    for (let i = 0; i < coords.length; i += 1) {
        map.geoObjects.add(
            new ymaps.Placemark(
                coords[i],
                {
                    iconContent: 'С',
                    balloonContentHeader: 'Заголовок раскрывающегося при клике на метку контента',
                    balloonContentBody: 'Тело контента',
                    balloonContentFooter: 'Подвал',
                    /*balloonContent: 'Контент при клике',*/
                },
                {
                    preset: 'islands#yellowIcon',
                }
            )
        );
    }
}
