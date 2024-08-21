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

function showPopup(event, boothName) {
    event.preventDefault();  // デフォルトのイベントをキャンセル

    const popup = document.getElementById('popup');
    const title = document.getElementById('popup-title');
    const description = document.getElementById('popup-description');
    const image = document.getElementById('popup-image');
    const link = document.getElementById('popup-link');

    if (boothName === 'エスケー石鹸') {
        title.textContent = 'エスケー石鹸';
        description.textContent = 'エスケー石鹸のブースでは、最新の洗浄技術を駆使した石鹸製品を展示しています。';
        image.src = 'sample1.jpg'; // 実際の画像パスに置き換えてください
        link.href = 'https://www.sksoap.co.jp/index.html';
        link.textContent = '詳細を見る';
    }

    popup.style.display = 'block';
}

document.getElementById('popup-close').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'none';
});

