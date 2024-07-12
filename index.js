const { useState, useCallback } = React;
const { Tent, UtensilsCrossed, Search, ZoomIn, ZoomOut } = lucide;

const EventMap = () => {
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);

  const boothTypes = {
    orange: { color: 'bg-orange-200', hoverColor: 'hover:bg-orange-300', icon: 'orange-icon.png' },
    green: { color: 'bg-green-200', hoverColor: 'hover:bg-green-300', icon: 'green-icon.png' },
    pink: { color: 'bg-pink-200', hoverColor: 'hover:bg-pink-300', icon: 'pink-icon.png' },
  };

  const getBoothType = (id) => {
    if (id <= 34) return 'orange';
    if (id <= 39) return 'pink';
    return 'green';
  };

  const renderBooth = useCallback((id, extraClass = '') => {
    const type = getBoothType(id);
    const { color, hoverColor, icon } = boothTypes[type];
    return (
      <button
        key={id}
        onClick={() => setSelectedBooth({ id, type })}
        className={`booth-button ${color} ${hoverColor} ${extraClass}`}
        aria-label={`ブース ${id}`}
      >
        <img src={icon} alt={type} className="w-4 h-4 mr-1" />
        <span>{id}</span>
      </button>
    );
  }, []);

  const renderTastingSpace = (id, extraClass = '') => (
    <div key={id} className={`tasting-space ${extraClass}`}>
      <UtensilsCrossed size={16} className="mr-1" />
      <span>試食 {id}</span>
    </div>
  );

  return (
    <div className="map-container">
      <h1 className="map-title">会場 MAP</h1>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="ブースを検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-button">
            <Search size={20} />
          </button>
        </div>
        <div className="flex items-center">
          <button onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))} className="zoom-button mr-2">
            <ZoomOut size={20} />
          </button>
          <button onClick={() => setZoomLevel(prev => Math.min(1.5, prev + 0.1))} className="zoom-button">
            <ZoomIn size={20} />
          </button>
        </div>
      </div>
      <div className="relative w-full bg-white rounded-lg shadow-md p-4 overflow-auto" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}>
        <div className="grid grid-cols-[1fr_200px] gap-4">
          <div className="grid grid-cols-1 gap-6">
            {/* 1列目: オレンジのブース10個 */}
            <div className="flex justify-between">
              {[...Array(10)].map((_, i) => renderBooth(i + 1, 'w-20 h-10'))}
            </div>
            
            {/* 2列目: 試食スペース13個 */}
            <div className="flex justify-between">
              {[...Array(13)].map((_, i) => renderTastingSpace(i + 1, 'w-16 h-8'))}
            </div>
            
            {/* 3列目: 2列目と同じ */}
            <div className="flex justify-between">
              {[...Array(13)].map((_, i) => renderTastingSpace(i + 14, 'w-16 h-8'))}
            </div>
            
            {/* 4列目: オレンジのブース9個 + 試食スペース2個 */}
            <div className="flex justify-between">
              {[...Array(9)].map((_, i) => renderBooth(i + 11, 'w-20 h-10'))}
              {[...Array(2)].map((_, i) => renderTastingSpace(i + 27, 'w-16 h-8'))}
            </div>
            
            {/* 5列目: 4列目と同じ */}
            <div className="flex justify-between">
              {[...Array(9)].map((_, i) => renderBooth(i + 20, 'w-20 h-10'))}
              {[...Array(2)].map((_, i) => renderTastingSpace(i + 29, 'w-16 h-8'))}
            </div>
            
            {/* 6列目: 2列目と同じ */}
            <div className="flex justify-between">
              {[...Array(13)].map((_, i) => renderTastingSpace(i + 31, 'w-16 h-8'))}
            </div>
            
            {/* 7列目: 6列目と同じ */}
            <div className="flex justify-between">
              {[...Array(13)].map((_, i) => renderTastingSpace(i + 44, 'w-16 h-8'))}
            </div>
            
            {/* 8列目: オレンジのブース6個 */}
            <div className="flex justify-start">
              {[...Array(6)].map((_, i) => renderBooth(i + 29, 'w-20 h-10'))}
            </div>
            
            {/* 9列目: ピンクのブース5個 + スペース + 緑のブース1個 + ステージ + 緑のブース1個 */}
            <div className="flex justify-between mt-8">
              <div className="flex">
                {[...Array(5)].map((_, i) => renderBooth(i + 35, 'w-20 h-10'))}
              </div>
              <div className="flex items-center space-x-4">
                {renderBooth(40, 'w-20 h-10')}
                <div className="bg-yellow-200 w-28 h-10 rounded flex items-center justify-center">
                  ステージ
                </div>
                {renderBooth(41, 'w-20 h-10')}
              </div>
            </div>
          </div>
          
          {/* 右側の広いスペース */}
          <div className="event-info">
            <h2 className="text-lg font-bold mb-2">イベント情報</h2>
            <p>ここにイベントの詳細情報や注意事項などを表示できます。</p>
          </div>
        </div>

        {/* Other facilities */}
        <div className="facility-label top-2 right-2 bg-blue-300">入口</div>
        <div className="facility-label bottom-2 left-2 bg-green-300">出口</div>
      </div>

      {selectedBooth && (
        <div className="dialog-overlay" onClick={() => setSelectedBooth(null)}>
          <div className="dialog-content" onClick={e => e.stopPropagation()}>
            <h2 className="dialog-title">ブース {selectedBooth.id}</h2>
            <p className="dialog-description">ブースの詳細情報がここに表示されます。</p>
            <button onClick={() => setSelectedBooth(null)} className="close-button">
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<EventMap />, document.getElementById('root'));
