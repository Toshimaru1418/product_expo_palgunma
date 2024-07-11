import React, { useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { Tent, UtensilsCrossed, ArrowRight, Search, ZoomIn, ZoomOut, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip } from '@/components/ui/tooltip';

const LazyDialog = lazy(() => import('@/components/ui/dialog'));

const EventMap = () => {
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);

  const boothCategories = {
    food: { color: 'bg-yellow-200', hoverColor: 'hover:bg-yellow-300' },
    craft: { color: 'bg-blue-200', hoverColor: 'hover:bg-blue-300' },
    art: { color: 'bg-green-200', hoverColor: 'hover:bg-green-300' },
    tech: { color: 'bg-purple-200', hoverColor: 'hover:bg-purple-300' },
  };

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
    const { color, hoverColor } = boothCategories[booth.category];
    return (
      <Tooltip content={`${booth.name} - ${booth.description}`}>
        <Button
          key={booth.id}
          onClick={() => handleBoothClick(booth)}
          className={`p-1 ${color} ${hoverColor} text-black text-xs rounded flex items-center justify-center ${extraClass} transition-transform duration-200 hover:scale-110`}
          aria-label={`ブース ${booth.id} を選択`}
        >
          <Tent size={12} />
          <span className="ml-1">{booth.id}</span>
        </Button>
      </Tooltip>
    );
  }, [boothCategories]);

  const handleBoothClick = (booth) => {
    setSelectedBooth(booth);
  };

  const closeDialog = () => {
    setSelectedBooth(null);
  };

  const renderRow = (startId, count) => (
    <div className="flex justify-between w-full mb-4">
      {booths.slice(startId - 1, startId - 1 + count).map(booth => renderBooth(booth, 'w-16 h-12'))}
    </div>
  );

  const renderTastingBooth = () => (
    <div className="w-full h-16 bg-pink-200 rounded-lg flex items-center justify-center mb-4 transition-transform duration-200 hover:scale-105">
      <UtensilsCrossed size={24} className="mr-2" />
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
    <div className="p-4 max-w-6xl mx-auto bg-gradient-to-b from-orange-100 to-orange-200 border-4 border-orange-500 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-6 text-orange-600 font-serif">イベント会場 MAP</h1>
      <div className="mb-4 flex items-center justify-between flex-wrap">
        <div className="flex items-center mb-2 sm:mb-0">
          <Input
            type="text"
            placeholder="ブースを検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mr-2"
          />
          <Search size={20} />
        </div>
        <div className="flex items-center">
          <Button onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))} className="mr-2">
            <ZoomOut size={20} />
          </Button>
          <Button onClick={() => setZoomLevel(prev => Math.min(1.5, prev + 0.1))}>
            <ZoomIn size={20} />
          </Button>
        </div>
      </div>
      <div role="region" aria-label="イベント会場マップ" className="relative w-full bg-white rounded-lg shadow-md p-8 overflow-auto" 
           style={{ 
             transform: `scale(${zoomLevel})`, 
             transformOrigin: 'top left',
             backgroundImage: 'url("/path-to-subtle-pattern.png")',
             backgroundRepeat: 'repeat'
           }}>
        <div className="sr-only">
          このマップには{booths.length}個のブースが表示されています。
          各ブースはカテゴリー別に色分けされており、クリックすると詳細情報が表示されます。
        </div>
        {mapLayout.map((item, index) => (
          <React.Fragment key={index}>
            {item.type === 'row' && renderRow(item.startId, item.count)}
            {item.type === 'tasting' && renderTastingBooth()}
          </React.Fragment>
        ))}

        {/* Entrances and exits */}
        <div className="absolute bottom-2 left-8 bg-blue-300 px-2 py-1 rounded flex items-center transition-transform duration-200 hover:scale-110">
          <ArrowRight size={16} />
          <span className="ml-1">入口</span>
        </div>
        <div className="absolute bottom-2 right-8 bg-red-300 px-2 py-1 rounded flex items-center transition-transform duration-200 hover:scale-110">
          <ArrowRight size={16} className="transform rotate-180" />
          <span className="ml-1">出口</span>
        </div>

        {/* Other facilities */}
        <Tooltip content="女子トイレ">
          <div className="absolute top-2 right-2 bg-green-300 px-2 py-1 rounded text-xs transition-transform duration-200 hover:scale-110">女子WC</div>
        </Tooltip>
        <Tooltip content="男子トイレ">
          <div className="absolute bottom-2 left-2 bg-green-300 px-2 py-1 rounded text-xs transition-transform duration-200 hover:scale-110">男子WC</div>
        </Tooltip>
        <Tooltip content="多目的トイレ">
          <div className="absolute top-2 left-2 bg-green-300 px-2 py-1 rounded text-xs transition-transform duration-200 hover:scale-110">多目的WC</div>
        </Tooltip>
        <Tooltip content="屋外イベント情報">
          <div className="absolute top-12 right-2 bg-blue-200 px-2 py-1 rounded text-xs transition-transform duration-200 hover:scale-110">屋外イベント</div>
        </Tooltip>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {Object.entries(boothCategories).map(([category, { color }]) => (
          <div key={category} className={`${color} p-2 rounded flex items-center justify-center transition-transform duration-200 hover:scale-105`}>
            {category}
          </div>
        ))}
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        {selectedBooth && (
          <LazyDialog open={!!selectedBooth} onOpenChange={closeDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedBooth?.name}</DialogTitle>
                <DialogDescription>{selectedBooth?.description}</DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <h3 className="font-bold mb-2">商品:</h3>
                <ul className="list-disc pl-5">
                  {selectedBooth?.products.map((product, index) => (
                    <li key={index}>{product}</li>
                  ))}
                </ul>
              </div>
              <Button onClick={closeDialog} className="mt-4">
                閉じる
              </Button>
            </DialogContent>
          </LazyDialog>
        )}
      </Suspense>

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

export default EventMap;