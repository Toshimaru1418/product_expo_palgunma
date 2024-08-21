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

// ポップアップを表示する関数
function showPopup(event, boothName) {
    event.preventDefault();  // デフォルトのイベントをキャンセル

    const popup = document.getElementById('popup');
    const title = document.getElementById('popup-title');
    const description = document.getElementById('popup-description');
    const image = document.getElementById('popup-image');
    const link = document.getElementById('popup-link');

    switch (boothName) {
        case 'エスケー石鹸':
            title.textContent = 'エスケー石鹸';
            description.textContent = 'エスケー石鹸のブース説明';
            image.src = 'sample1.jpg';
            link.href = 'https://www.palsystem-gunma.coop/';
            link.textContent = '詳細を見る';
            break;
        case '水宗園':
            title.textContent = '水宗園';
            description.textContent = '水宗園のブース説明';
            image.src = 'sample2.jpg';
            link.href = 'https://www.suisouen.co.jp/';
            break;
        case '北海道漁連':
            title.textContent = '北海道漁連';
            description.textContent = '北海道漁連のブース説明';
            image.src = 'sample3.jpg';
            link.href = 'https://www.gyoren.or.jp/';
            break;
        case '平田産業':
            title.textContent = '平田産業';
            description.textContent = '平田産業のブース説明';
            image.src = 'sample4.jpg';
            link.href = 'https://hiratasangyo.com/';
            break;
        case 'グリンリーフ':
            title.textContent = 'グリンリーフ';
            description.textContent = 'グリンリーフのブース説明';
            image.src = 'sample5.jpg';
            link.href = 'https://www.akn.jp/';
            break;
        case '河村屋':
            title.textContent = '河村屋';
            description.textContent = '河村屋のブース説明';
            image.src = 'sample6.jpg';
            link.href = 'https://www.kawamuraya.co.jp/';
            break;
        case 'ゴミ分別ブース':
            title.textContent = 'ゴミ分別ブース';
            description.textContent = 'ゴミ分別ブースのブース説明';
            image.src = 'sample7.jpg';
            link.href = 'https://www.palsystem-gunma.coop/';
            break;
        case 'ステージ':
            title.textContent = 'ステージ';
            description.textContent = 'ステージのブース説明';
            image.src = 'sample8.jpg';
            link.href = 'https://www.palsystem-gunma2.coop/';
            break;   
    }

    popup.style.display = 'block'; // ポップアップを表示
}

document.getElementById('popup-close').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'none'; // ポップアップを非表示にする
});
