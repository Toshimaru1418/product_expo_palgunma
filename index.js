import React, { useState, useCallback } from 'react';
import { Tent, UtensilsCrossed, ArrowRight, Search, ZoomIn, ZoomOut } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const EventMap = () => {
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);

  const boothTypes = {
    orange: { color: 'bg-orange-200', hoverColor: 'hover:bg-orange-300', icon: '/images/orange-icon.png' },
    green: { color: 'bg-green-200', hoverColor: 'hover:bg-green-300', icon: '/images/green-icon.png' },
    pink: { color: 'bg-pink-200', hoverColor: 'hover:bg-pink-300', icon: '/images/pink-icon.png' },
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
      <TooltipProvider key={id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setSelectedBooth({ id, type })}
              className={`p-1 ${color} ${hoverColor} text-black text-xs rounded flex items-center justify-center ${extraClass}`}
              aria-label={`ブース ${id}`}
            >
              <img src={icon} alt={type} className="w-4 h-4 mr-1" />
              <span>{id}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>ブース {id}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }, []);

  const renderTastingSpace = (id, extraClass = '') => (
    <div key={id} className={`bg-blue-200 rounded flex items-center justify-center ${extraClass}`}>
      <UtensilsCrossed size={16} className="mr-1" />
      <span className="text-xs">試食 {id}</span>
    </div>
  );

  return (
    <div className="p-4 max-w-7xl mx-auto bg-gray-100 border-4 border-orange-500 rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-orange-600">会場 MAP</h1>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
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
          <div className="bg-gray-100 rounded-lg p-4">
            <h2 className="text-lg font-bold mb-2">イベント情報</h2>
            <p>ここにイベントの詳細情報や注意事項などを表示できます。</p>
          </div>
        </div>

        {/* Other facilities */}
        <div className="absolute top-2 right-2 bg-blue-300 px-2 py-1 rounded text-xs">入口</div>
        <div className="absolute bottom-2 left-2 bg-green-300 px-2 py-1 rounded text-xs">出口</div>
      </div>

      <Dialog open={!!selectedBooth} onOpenChange={() => setSelectedBooth(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ブース {selectedBooth?.id}</DialogTitle>
            <DialogDescription>ブースの詳細情報がここに表示されます。</DialogDescription>
          </DialogHeader>
          <Button onClick={() => setSelectedBooth(null)} className="mt-4">
            閉じる
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventMap;
