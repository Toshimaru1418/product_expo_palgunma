const { useState, useCallback, useMemo } = React;

const boothCategories = {
  food: { color: 'bg-blue-100', hoverColor: 'hover:bg-blue-200', icon: '🍔' },
  craft: { color: 'bg-green-100', hoverColor: 'hover:bg-green-200', icon: '🎨' },
  art: { color: 'bg-yellow-100', hoverColor: 'hover:bg-yellow-200', icon: '🖼️' },
  tech: { color: 'bg-purple-100', hoverColor: 'hover:bg-purple-200', icon: '💻' },
};

const EventMap = () => {
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);

  const booths = useMemo(() => 
    Array.from({ length: 40 }, (_, i) => ({
      id: i + 1,
      name: `ブース ${i + 1}`,
      description: `ブース ${i + 1} の説明`,
      products: ['商品 A', '商品 B', '商品 C'],
      category: Object.keys(boothCategories)[i % 4],
    }))
  , []);

  const mapLayout = useMemo(() => [
    { type: 'row', startId: 1, count: 10 },
    { type: 'tasting' },
    { type: 'row', startId: 11, count: 10 },
    { type: 'row', startId: 21, count: 10 },
    { type: 'tasting' },
    { type: 'row', startId: 31, count: 10 },
  ], []);

  const renderBooth = useCallback((booth, extraClass = '') => {
    const { color, hoverColor, icon } = boothCategories[booth.category];
    return (
      <button
        key={booth.id}
        onClick={() => setSelectedBooth(booth)}
        className={`booth-button ${color} ${hoverColor} text-blue-800 text-xs rounded-none flex items-center justify-center ${extraClass}`}
        aria-label={`ブース ${booth.id} を選択`}
      >
        {icon}
        <span className="ml-1">{booth.id}</span>
      </button>
    );
  }, []);

  const renderRow = (startId, count) => (
    <div className="flex justify-between w-full mb-4">
      {booths.slice(startId - 1, startId - 1 + count).map(booth => renderBooth(booth, 'w-16 h-12'))}
    </div>
  );

  const renderTastingBooth = () => (
    <div className="tasting-booth w-full h-16 mb-4">
      <span>試食ブース</span>
    </div>
  );

  const filteredBooths = useMemo(() => 
    booths.filter(booth =>
      booth.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booth.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  , [booths, searchTerm]);

  return (
    <div className="map-container">
      <h1 className="map-title">イベント会場マップ</h1>
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <input
            type="text"
            placeholder="ブースを検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input mr-2"
          />
          <button className="search-button">検索</button>
        </div>
        <div className="flex items-center">
          <button onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))} className="zoom-button mr-2">縮小</button>
          <button onClick={() => setZoomLevel(prev => Math.min(1.5, prev + 0.1))} className="zoom-button">拡大</button>
        </div>
      </div>
      <div role="region" aria-label="イベント会場マップ" className="relative w-full bg-white shadow-md p-8 overflow-auto mb-8" 
           style={{ 
             transform: `scale(${zoomLevel})`, 
             transformOrigin: 'top left',
           }}>
        {mapLayout.map((item, index) => (
          <React.Fragment key={index}>
            {item.type === 'row' && renderRow(item.startId, item.count)}
            {item.type === 'tasting' && renderTastingBooth()}
          </React.Fragment>
        ))}

        <div className="facility-label" style={{ top: '10px', right: '10px' }}>女子WC</div>
        <div className="facility-label" style={{ bottom: '10px', left: '10px' }}>男子WC</div>
        <div className="facility-label" style={{ top: '10px', left: '10px' }}>多目的WC</div>
        <div className="facility-label" style={{ top: '50px', right: '10px' }}>屋外イベント</div>

        <div className="absolute bottom-2 left-8 bg-blue-500 text-white px-2 py-1">
          <span className="ml-1">入口</span>
        </div>
        <div className="absolute bottom-2 right-8 bg-red-500 text-white px-2 py-1">
          <span className="ml-1">出口</span>
        </div>
      </div>

      <div className="category-legend grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(boothCategories).map(([category, { color, icon }]) => (
          <div key={category} className={`category-item ${color.replace('bg-', 'text-')} flex items-center justify-center`}>
            {icon} <span className="ml-2">{category}</span>
          </div>
        ))}
      </div>

      {selectedBooth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-none max-w-md w-full">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">{selectedBooth.name}</h2>
            <p className="mb-4">{selectedBooth.description}</p>
            <h3 className="font-bold mb-2">商品:</h3>
            <ul className="list-disc pl-5 mb-4">
              {selectedBooth.products.map((product, index) => (
                <li key={index}>{product}</li>
              ))}
            </ul>
            <button onClick={() => setSelectedBooth(null)} className="w-full bg-blue-800 text-white py-2 hover:bg-blue-900 transition-colors">
              閉じる
            </button>
          </div>
        </div>
      )}

      {searchTerm && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-blue-800">検索結果:</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredBooths.map(booth => (
              <li key={booth.id} className="bg-white shadow-md p-4">
                <button onClick={() => setSelectedBooth(booth)} className="text-blue-800 hover:underline font-bold">
                  {booth.name}
                </button>
                <p className="text-sm mt-2">{booth.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<EventMap />, document.getElementById('root'));
