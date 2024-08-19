// JavaScriptコードでイメージマップをレスポンシブにする処理
document.addEventListener("DOMContentLoaded", function() {
    function resizeImageMap() {
        const image = document.getElementById('responsive-image');
        const map = document.querySelector('map[name="image-map"]');
        const areas = map.getElementsByTagName('area');
        const width = image.naturalWidth;
        const height = image.naturalHeight;
        const scaleWidth = image.clientWidth / width;
        const scaleHeight = image.clientHeight / height;

        for (let i = 0; i < areas.length; i++) {
            const coords = areas[i].getAttribute('coords').split(',');
            for (let j = 0; j < coords.length; j++) {
                coords[j] = Math.round(coords[j] * (j % 2 === 0 ? scaleWidth : scaleHeight));
            }
            areas[i].setAttribute('coords', coords.join(','));
        }
    }

    resizeImageMap();
    window.addEventListener('resize', resizeImageMap);
});