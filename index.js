const { useState, useCallback, useMemo, lazy, Suspense } = React;

const boothCategories = {
  food: { color: 'bg-yellow-200', hoverColor: 'hover:bg-yellow-300', icon: '🍔' },
  craft: { color: 'bg-blue-200', hoverColor: 'hover:bg-blue-300', icon: '🎨' },
  art: { color: 'bg-green-200', hoverColor: 'hover:bg-green-300', icon: '🖼️' },
  tech: { color: 'bg-purple-200', hoverColor: 'hover:bg-purple-300', icon: '💻' },
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
      link: `/booths/${i + 1}`,
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
        onClick={() => handleBoothClick(booth)}
        className={`booth-button p-1 ${color} ${hoverColor} text-black text-xs rounded flex items-center justify-center ${extraClass}`}
        aria-label={`ブース ${booth.id} を選択`}
      >
        {icon}
        <span className="ml-1">{booth.id}</span>
      </button>
    );
  }, []);

  const handleBoothClick = (booth) => {
    setSelectedBooth(booth);
  };

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
      <h1 className="map-title">イベント会場 MAP</h1>
      <div className="mb-4 flex items-center justify-between flex-wrap">
        <div className="flex items-center mb-2 sm:mb-0">
          <input
            type="text"
            placeholder="ブースを検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mr-2 p-2 border rounded"
          />
          <button className="p-2 bg-blue-500 text-white rounded">検索</button>
        </div>
        <div className="flex items-center">
          <button onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))} className="mr-2 p-2 bg-gray-200 rounded">縮小</button>
          <button onClick={() => setZoomLevel(prev => Math.min(1.5, prev + 0.1))} className="p-2 bg-gray-200 rounded">拡大</button>
        </div>
      </div>
      <div role="region" aria-label="イベント会場マップ" className="relative w-full bg-white rounded-lg shadow-md p-8 overflow-auto" 
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
        <div className="facility-label" style={{ top: '50px', right: '10px', backgroundColor: '#2196f3' }}>屋外イベント</div>

        <div className="absolute bottom-2 left-8 bg-blue-300 px-2 py-1 rounded flex items-center">
          <span className="ml-1">入口</span>
        </div>
        <div className="absolute bottom-2 right-8 bg-red-300 px-2 py-1 rounded flex items-center">
          <span className="ml-1">出口</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {Object.entries(boothCategories).map(([category, { color, icon }]) => (
          <div key={category} className={`${color} p-2 rounded flex items-center justify-center`}>
            {icon} {category}
          </div>
        ))}
      </div>

      {selectedBooth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <h2>{selectedBooth.name}</h2>
            <p>{selectedBooth.description}</p>
            <h3>商品:</h3>
            <ul>
              {selectedBooth.products.map((product, index) => (
                <li key={index}>{product}</li>
              ))}
            </ul>
            <button onClick={() => setSelectedBooth(null)} className="mt-4 p-2 bg-red-500 text-white rounded">
              閉じる
            </button>
          </div>
        </div>
      )}

      {searchTerm && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">検索結果:</h2>
          <ul className="list-disc pl-5">
            {filteredBooths.map(booth => (
              <li key={booth.id} className="mb-1">
                <button onClick={() => handleBoothClick(booth)} className="text-blue-600 hover:underline">
                  {booth.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<EventMap />, document.getElementById('root'));