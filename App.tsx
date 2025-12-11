import React, { useState, useEffect } from 'react';
import { Edit3, Save, X, Lock, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, RotateCcw, Maximize2, QrCode, ArrowDown, Camera, Aperture } from 'lucide-react';
import { AppData, Photo, ProfileData } from './types';
import { loadData, saveData, resetData } from './storage';

// --- Reusable UI Components ---

const SectionDivider = ({ label, number }: { label: string; number: string }) => (
  <div className="w-full flex items-center gap-4 py-8 opacity-40">
    <span className="text-xs font-mono tracking-widest">{number}</span>
    <div className="h-[1px] flex-grow bg-stone-400"></div>
    <span className="text-xs font-mono uppercase tracking-widest">{label}</span>
  </div>
);

const MetadataLabel = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-stone-500 font-mono">
    <Icon size={10} />
    <span>{label}</span>
  </div>
);

// --- Page Components (相册页面组件) ---

interface PageProps {
  front: Photo;
  back: Photo;
  zIndex: number;
  flipped: boolean;
  onFlip: () => void;
  isEditing: boolean;
  onUpdatePhoto: (photo: Photo) => void;
}

// [组件] 竖屏翻页 (左右翻转)
const PortraitPage: React.FC<PageProps> = ({ front, back, zIndex, flipped, onFlip, isEditing, onUpdatePhoto }) => {
  return (
    <div
      className="absolute top-0 left-0 w-full h-full transform-style-3d transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer origin-left shadow-xl"
      style={{
        zIndex: flipped ? 1 : zIndex,
        transform: flipped ? 'rotateY(-180deg)' : 'rotateY(0deg)',
      }}
      onClick={onFlip}
    >
      {/* 正面 (Right Side) */}
      <div className="absolute inset-0 backface-hidden bg-white overflow-hidden border-l border-stone-100">
        <div className="w-full h-full relative group">
            <img src={front.url} alt={front.caption} className="w-full h-full object-cover" />
            <div className="absolute top-0 left-0 bottom-0 w-6 bg-gradient-to-r from-black/10 to-transparent pointer-events-none mix-blend-multiply" />
            
            <div className="absolute bottom-0 w-full p-4 md:p-6 text-white bg-gradient-to-t from-black/50 via-black/20 to-transparent">
                 <div className="flex justify-between items-end border-b border-white/30 pb-2 mb-1">
                    {isEditing ? (
                        <input className="bg-transparent text-white font-serif text-lg md:text-xl outline-none w-full placeholder-white/50"
                            value={front.caption} onChange={(e) => onUpdatePhoto({...front, caption: e.target.value})} onClick={(e) => e.stopPropagation()}/>
                     ) : <span className="font-serif text-lg md:text-xl tracking-wide leading-none">{front.caption}</span>}
                    <span className="font-mono text-[10px] opacity-80 mb-1 ml-4">{front.date}</span>
                 </div>
                 <div className="flex gap-3 opacity-70">
                   <MetadataLabel icon={Camera} label="ISO 400" />
                   <MetadataLabel icon={Aperture} label="f/2.8" />
                 </div>
            </div>

            {isEditing && (
              <div className="absolute top-2 right-2 bg-white/90 p-2 rounded shadow-md z-20" onClick={(e) => e.stopPropagation()}>
                <input type="text" value={front.url} onChange={(e) => onUpdatePhoto({...front, url: e.target.value})} className="text-xs p-1 w-32 border border-stone-300 rounded text-black" placeholder="URL..."/>
              </div>
            )}
        </div>
      </div>
      
      {/* 背面 (Left Side) */}
      <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white overflow-hidden border-r border-stone-100">
         <div className="w-full h-full relative group">
            <img src={back.url} alt={back.caption} className="w-full h-full object-cover" />
            <div className="absolute top-0 right-0 bottom-0 w-6 bg-gradient-to-l from-black/10 to-transparent pointer-events-none mix-blend-multiply" />
            
             <div className="absolute bottom-0 w-full p-4 md:p-6 text-white bg-gradient-to-t from-black/50 via-black/20 to-transparent text-right">
                 <div className="flex flex-row-reverse justify-between items-end border-b border-white/30 pb-2 mb-1">
                     {isEditing ? (
                        <input className="bg-transparent text-white font-serif text-lg md:text-xl outline-none w-full text-right placeholder-white/50"
                            value={back.caption} onChange={(e) => onUpdatePhoto({...back, caption: e.target.value})} onClick={(e) => e.stopPropagation()}/>
                     ) : <span className="font-serif text-lg md:text-xl tracking-wide leading-none">{back.caption}</span>}
                     <span className="font-mono text-[10px] opacity-80 mb-1 mr-4">{back.date}</span>
                 </div>
                 <div className="flex gap-3 opacity-70 justify-end">
                   <MetadataLabel icon={Camera} label="ISO 800" />
                   <MetadataLabel icon={Aperture} label="f/1.8" />
                 </div>
            </div>

             {isEditing && (
              <div className="absolute top-2 left-2 bg-white/90 p-2 rounded shadow-md z-20" onClick={(e) => e.stopPropagation()}>
                <input type="text" value={back.url} onChange={(e) => onUpdatePhoto({...back, url: e.target.value})} className="text-xs p-1 w-32 border border-stone-300 rounded text-black" placeholder="URL..."/>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

// [组件] 横屏翻页 (上下翻转)
const LandscapePage: React.FC<PageProps> = ({ front, back, zIndex, flipped, onFlip, isEditing, onUpdatePhoto }) => {
  return (
    <div
      className="absolute top-0 left-0 w-full h-full transform-style-3d transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer origin-top shadow-xl"
      style={{
        zIndex: flipped ? 1 : zIndex, 
        transform: flipped ? 'rotateX(180deg)' : 'rotateX(0deg)',
      }}
      onClick={onFlip}
    >
      {/* Front (Bottom) */}
      <div className="absolute inset-0 backface-hidden bg-white overflow-hidden border-t border-stone-100">
        <div className="w-full h-full relative group">
            <img src={front.url} alt={front.caption} className="w-full h-full object-cover" />
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/10 to-transparent pointer-events-none mix-blend-multiply" />
            
            <div className="absolute bottom-0 w-full p-4 md:p-6 text-white bg-gradient-to-t from-black/50 via-black/20 to-transparent">
                 <div className="flex justify-between items-end border-b border-white/30 pb-2 mb-1">
                     {isEditing ? (
                        <input className="bg-transparent text-white font-serif text-lg md:text-xl outline-none w-full placeholder-white/50"
                            value={front.caption} onChange={(e) => onUpdatePhoto({...front, caption: e.target.value})} onClick={(e) => e.stopPropagation()}/>
                     ) : <span className="font-serif text-lg md:text-xl tracking-wide leading-none">{front.caption}</span>}
                 </div>
                 <div className="flex gap-4 opacity-70">
                    <span className="font-mono text-[10px]">{front.date}</span>
                    <MetadataLabel icon={Camera} label="RAW" />
                 </div>
            </div>
            
            {isEditing && (
              <div className="absolute bottom-2 right-2 bg-white/90 p-2 rounded shadow-md z-20" onClick={(e) => e.stopPropagation()}>
                <input type="text" value={front.url} onChange={(e) => onUpdatePhoto({...front, url: e.target.value})} className="text-xs p-1 w-32 border border-stone-300 rounded text-black" placeholder="URL..."/>
              </div>
            )}
        </div>
      </div>
      
      {/* Back (Top) */}
      <div className="absolute inset-0 backface-hidden bg-white overflow-hidden border-b border-stone-100" style={{ transform: 'rotateX(180deg)' }}>
         <div className="w-full h-full relative group">
            <img src={back.url} alt={back.caption} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/10 to-transparent pointer-events-none mix-blend-multiply" />
            
            <div className="absolute top-0 w-full p-4 md:p-6 text-white bg-gradient-to-b from-black/50 via-black/20 to-transparent">
                 <div className="flex justify-between items-end border-b border-white/30 pb-2 mb-1">
                     {isEditing ? (
                        <input className="bg-transparent text-white font-serif text-lg md:text-xl outline-none w-full placeholder-white/50"
                            value={back.caption} onChange={(e) => onUpdatePhoto({...back, caption: e.target.value})} onClick={(e) => e.stopPropagation()}/>
                     ) : <span className="font-serif text-lg md:text-xl tracking-wide leading-none">{back.caption}</span>}
                 </div>
                 <div className="flex gap-4 opacity-70">
                    <span className="font-mono text-[10px]">{back.date}</span>
                    <MetadataLabel icon={Camera} label="FILM" />
                 </div>
            </div>

             {isEditing && (
              <div className="absolute top-2 left-2 bg-white/90 p-2 rounded shadow-md z-20" onClick={(e) => e.stopPropagation()}>
                <input type="text" value={back.url} onChange={(e) => onUpdatePhoto({...back, url: e.target.value})} className="text-xs p-1 w-32 border border-stone-300 rounded text-black" placeholder="URL..."/>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};


// --- Main App ---

export default function App() {
  const [data, setData] = useState<AppData>(loadData());
  const [isEditing, setIsEditing] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [zoomQR, setZoomQR] = useState<string | null>(null);

  const [portraitIndex, setPortraitIndex] = useState(0);
  const [landscapeIndex, setLandscapeIndex] = useState(0);

  useEffect(() => {
    if (isEditing) {
      const timer = setTimeout(() => saveData(data), 1000); 
      return () => clearTimeout(timer);
    }
  }, [data, isEditing]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === '3214128190' && password === 'shanlvbi') {
      setIsEditing(true); setShowLogin(false); setAuthError(''); setUsername(''); setPassword('');
    } else { setAuthError('Invalid credentials'); }
  };

  const logout = () => { setIsEditing(false); saveData(data); };
  
  const updateProfile = (field: keyof ProfileData, value: string) => {
    setData(prev => ({ ...prev, profile: { ...prev.profile, [field]: value } }));
  };

  const updatePhoto = (type: 'portrait' | 'landscape', newPhoto: Photo) => {
    setData(prev => ({
      ...prev,
      [type === 'portrait' ? 'portraitPhotos' : 'landscapePhotos']: prev[type === 'portrait' ? 'portraitPhotos' : 'landscapePhotos'].map(p => p.id === newPhoto.id ? newPhoto : p)
    }));
  };

  const getPairs = (photos: Photo[]) => {
    const list = [...photos];
    if (list.length % 2 !== 0) {
        list.push({ id: `placeholder-${Date.now()}`, url: 'https://images.unsplash.com/photo-1544378730-8b7791443729?q=80&w=1000&auto=format&fit=crop', caption: 'End', date: '' });
    }
    const pairs = [];
    for (let i = 0; i < list.length; i += 2) {
      pairs.push({ front: list[i], back: list[i + 1] });
    }
    return pairs;
  };

  const portraitPairs = getPairs(data.portraitPhotos);
  const landscapePairs = getPairs(data.landscapePhotos);

  return (
    <div className="min-h-screen bg-[#f0f0ed] flex flex-col font-sans relative overflow-x-hidden selection:bg-amber-200 bg-noise">
      
      {/* ======================================================== */}
      {/* [区域 1] 顶部固定导航栏 (BRANDING) */}
      {/* ======================================================== */}
      <nav className="fixed top-0 left-0 w-full z-40 p-6 flex justify-between items-center mix-blend-difference text-stone-500 pointer-events-none">
          {/* 左上角品牌名称 */}
          <div className="font-serif font-bold tracking-widest text-xs md:text-sm text-stone-900 pointer-events-auto">LUMIÈRE ©2024</div>
          {/* 右上角标语 */}
          <div className="font-mono text-[10px] md:text-xs tracking-widest uppercase hidden md:block text-stone-800">Visual Anthology</div>
      </nav>

      {/* ======================================================== */}
      {/* [区域 2] 个人资料首屏 (HERO SECTION) */}
      {/* 包含大标题、简介和旋转头像 */}
      {/* ======================================================== */}
      <header className="relative w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-20 md:py-32 flex flex-col md:flex-row items-start md:items-center gap-12 md:gap-24">
        {/* 左侧文字区域 (移动端在下方) */}
        <div className="flex-1 order-2 md:order-1 space-y-8 md:space-y-10 relative z-10">
           <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <div className="h-[1px] w-8 bg-stone-800"></div>
                 <p className="text-stone-500 font-mono tracking-[0.2em] text-xs uppercase">Portfolio</p>
              </div>
              
              {isEditing ? (
                <input className="w-full text-5xl md:text-8xl font-serif font-bold text-stone-900 bg-transparent border-b border-stone-300 outline-none leading-none"
                  value={data.profile.name} onChange={(e) => updateProfile('name', e.target.value)} />
              ) : (
                <h1 className="text-5xl md:text-8xl font-serif font-bold text-stone-900 leading-[0.9] tracking-tight">
                  {data.profile.name.split(' ')[0]}<br/>
                  <span className="italic font-light ml-4 md:ml-12 text-stone-600">{data.profile.name.split(' ').slice(1).join(' ')}</span>
                </h1>
              )}
           </div>

           {isEditing ? (
             <input className="w-full text-lg text-stone-600 font-medium bg-transparent border-b border-stone-300 outline-none"
               value={data.profile.title} onChange={(e) => updateProfile('title', e.target.value)} />
           ) : <h2 className="text-lg md:text-xl text-stone-500 font-medium tracking-wide uppercase font-mono max-w-md">{data.profile.title}</h2>}
           
           {isEditing ? (
             <textarea className="w-full text-stone-600 leading-relaxed bg-white/50 border border-stone-300 p-4 rounded outline-none h-40"
               value={data.profile.bio} onChange={(e) => updateProfile('bio', e.target.value)} />
           ) : <p className="text-stone-700 leading-relaxed text-base md:text-lg font-serif max-w-lg border-l-2 border-stone-300 pl-6">{data.profile.bio}</p>}
           
           <div className="pt-8 hidden md:block">
              <ArrowDown className="animate-bounce opacity-40" size={24}/>
           </div>
        </div>

        {/* 右侧头像区域 (移动端在上方) */}
        <div className="flex-1 order-1 md:order-2 w-full flex justify-center md:justify-end relative">
          <div className="relative w-64 h-64 md:w-[28rem] md:h-[34rem] shadow-2xl rotate-3 transition-transform hover:rotate-0 duration-700 ease-out bg-white p-2 md:p-4">
             <div className="w-full h-full overflow-hidden bg-stone-200 filter grayscale contrast-125">
                 <img src={data.profile.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
             </div>
             {/* 装饰胶带效果 */}
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-amber-100/80 backdrop-blur shadow-sm transform -rotate-2"></div>
             
             {isEditing && (
              <div className="absolute bottom-4 right-4 z-20 bg-amber-600 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-amber-500">
                 <input type="text" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => updateProfile('avatarUrl', e.target.value)} />
                 <Edit3 size={16} />
              </div>
             )}
          </div>
          {/* 背景大数字装饰 */}
          <div className="absolute -right-10 -bottom-20 md:-right-20 md:-bottom-20 text-[10rem] md:text-[18rem] font-serif font-bold text-stone-200/50 -z-10 select-none">00</div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* [区域 3] 竖屏相册展示区 (PORTRAIT SERIES) */}
      {/* 左右翻页效果 */}
      {/* ======================================================== */}
      <section className="w-full min-h-[90vh] py-20 flex flex-col items-center justify-center relative overflow-hidden">
         {/* 背景线条与数字装饰 */}
         <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute right-0 top-1/4 w-1/3 h-[1px] bg-stone-300"></div>
            <div className="absolute left-0 bottom-1/4 w-1/3 h-[1px] bg-stone-300"></div>
            <div className="absolute left-10 top-20 text-[8rem] md:text-[16rem] font-serif leading-none text-stone-300/20">01</div>
         </div>

         {/* 标题栏 */}
         <div className="relative z-10 w-full max-w-6xl px-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-2">
            <div>
               <h3 className="font-serif text-3xl md:text-5xl text-stone-800 tracking-tight">Portraiture</h3>
               <p className="font-mono text-xs md:text-sm text-stone-500 uppercase tracking-widest mt-2">Study of Light & Face</p>
            </div>
            <div className="hidden md:block font-mono text-xs text-stone-400">FIG. 1 — {portraitPairs.length} PLATES</div>
         </div>

         {/* 3D 书本容器 (宽高比 3:2) */}
         <div className="relative z-10 w-[90vw] md:w-[70vw] max-w-[1000px] aspect-[3/2] perspective-2000 my-4 md:my-8">
            {/* 书封底 */}
            <div className="absolute w-full h-full bg-[#fdfdfc] shadow-2xl flex overflow-hidden rounded-[2px] border border-stone-200">
                <div className="w-1/2 h-full border-r border-stone-200 relative bg-[#faf9f8]"><div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-stone-300/40 to-transparent pointer-events-none"/></div>
                <div className="w-1/2 h-full border-l border-stone-200 relative bg-[#faf9f8]"><div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-stone-300/40 to-transparent pointer-events-none"/></div>
            </div>
            
            {/* 页面渲染层 */}
            <div className="absolute top-[3%] bottom-[3%] left-1/2 w-[48%] h-[94%] z-20" style={{ transformStyle: 'preserve-3d' }}>
                <div className="absolute inset-0 bg-[#f5f4f2] flex flex-col items-center justify-center border border-stone-200">
                    <div className="w-16 h-16 border border-stone-300 rounded-full flex items-center justify-center mb-4"><RotateCcw size={20} className="text-stone-400"/></div>
                    <span className="font-serif text-stone-400 italic">End of collection</span>
                </div>
                {portraitPairs.map((pair, index) => (
                    <PortraitPage key={pair.front.id} front={pair.front} back={pair.back} zIndex={portraitPairs.length - index} 
                        flipped={index < portraitIndex} onFlip={() => index < portraitIndex ? setPortraitIndex(Math.max(0, portraitIndex - 1)) : setPortraitIndex(portraitIndex + 1)}
                        isEditing={isEditing} onUpdatePhoto={(p) => updatePhoto('portrait', p)} />
                ))}
            </div>
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-stone-300/50 z-30"></div>
         </div>

         {/* 翻页控制按钮 */}
         <div className="w-full max-w-xl px-6 flex justify-between items-center mt-6 md:mt-10 z-20">
             <button onClick={() => setPortraitIndex(Math.max(0, portraitIndex - 1))} className="group flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors">
                <div className="p-3 border border-stone-300 rounded-full group-hover:bg-white group-hover:shadow-lg transition-all"><ChevronLeft size={20}/></div>
                <span className="hidden md:inline font-mono text-xs uppercase">Prev</span>
             </button>
             
             <div className="flex flex-col items-center">
                <span className="font-serif text-xl md:text-2xl">{portraitIndex}</span>
                <div className="w-12 h-[1px] bg-stone-400 my-1"></div>
                <span className="font-mono text-xs text-stone-400">{portraitPairs.length}</span>
             </div>

             <button onClick={() => setPortraitIndex(Math.min(portraitPairs.length, portraitIndex + 1))} className="group flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors">
                <span className="hidden md:inline font-mono text-xs uppercase">Next</span>
                <div className="p-3 border border-stone-300 rounded-full group-hover:bg-white group-hover:shadow-lg transition-all"><ChevronRight size={20}/></div>
             </button>
         </div>
      </section>

      {/* 装饰性分割线 */}
      <SectionDivider label="Interlude" number="01-02" />

      {/* ======================================================== */}
      {/* [区域 4] 横屏相册展示区 (LANDSCAPE SERIES) */}
      {/* 上下翻页效果 */}
      {/* ======================================================== */}
      <section className="w-full min-h-[90vh] py-20 flex flex-col items-center justify-center relative overflow-hidden bg-[#e8e6e3]">
         {/* 背景装饰 */}
         <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute right-10 top-20 text-[8rem] md:text-[16rem] font-serif leading-none text-white/40">02</div>
            <div className="absolute left-1/4 top-0 h-full w-[1px] bg-stone-400/20"></div>
            <div className="absolute right-1/4 top-0 h-full w-[1px] bg-stone-400/20"></div>
         </div>

         {/* 标题栏 */}
         <div className="relative z-10 w-full max-w-6xl px-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-2 text-right md:text-left">
             <div className="hidden md:block font-mono text-xs text-stone-400">FIG. 2 — {landscapePairs.length} PLATES</div>
             <div className="md:text-right">
               <h3 className="font-serif text-3xl md:text-5xl text-stone-800 tracking-tight">Landscape</h3>
               <p className="font-mono text-xs md:text-sm text-stone-500 uppercase tracking-widest mt-2">Horizons & Textures</p>
            </div>
         </div>
         
         {/* 3D 竖向翻页容器 (宽高比 2:3) */}
         <div className="relative z-10 w-[85vw] md:w-[50vw] max-w-[650px] aspect-[2/3] perspective-2000 my-4 md:my-8">
             {/* 书封底 (Vertical) */}
             <div className="absolute w-full h-full bg-[#fdfdfc] shadow-2xl flex flex-col overflow-hidden rounded-[2px] border border-stone-300">
                <div className="h-1/2 w-full border-b border-stone-200 relative bg-[#f7f6f4]"><div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-stone-300/40 to-transparent pointer-events-none"/></div>
                <div className="h-1/2 w-full border-t border-stone-200 relative bg-[#f7f6f4]"><div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-stone-300/40 to-transparent pointer-events-none"/></div>
             </div>

             {/* 页面渲染层 */}
             <div className="absolute left-[3%] right-[3%] top-1/2 h-[48%] z-20" style={{ transformStyle: 'preserve-3d' }}>
                 <div className="absolute inset-0 bg-[#f0eee9] flex flex-col items-center justify-center border border-stone-200">
                    <RotateCcw size={20} className="text-stone-400 mb-2"/>
                    <span className="font-serif text-stone-400 italic text-sm">Fin</span>
                 </div>
                 {landscapePairs.map((pair, index) => (
                     <LandscapePage key={pair.front.id} front={pair.front} back={pair.back} zIndex={landscapePairs.length - index}
                        flipped={index < landscapeIndex} onFlip={() => index < landscapeIndex ? setLandscapeIndex(Math.max(0, landscapeIndex - 1)) : setLandscapeIndex(landscapeIndex + 1)}
                        isEditing={isEditing} onUpdatePhoto={(p) => updatePhoto('landscape', p)} />
                 ))}
             </div>
             {/* 水平书脊线 */}
             <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-stone-300 z-30 opacity-40"></div>
         </div>

         {/* 翻页控制按钮 */}
         <div className="w-full max-w-xl px-6 flex justify-between items-center mt-6 md:mt-10 z-20">
             <button onClick={() => setLandscapeIndex(Math.max(0, landscapeIndex - 1))} className="group flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors">
                <div className="p-3 border border-stone-300 rounded-full group-hover:bg-white group-hover:shadow-lg transition-all"><ChevronUp size={20}/></div>
                <span className="hidden md:inline font-mono text-xs uppercase">Prev</span>
             </button>
             
             <div className="flex flex-col items-center">
                <span className="font-serif text-xl md:text-2xl">{landscapeIndex}</span>
                <div className="w-12 h-[1px] bg-stone-400 my-1"></div>
                <span className="font-mono text-xs text-stone-400">{landscapePairs.length}</span>
             </div>

             <button onClick={() => setLandscapeIndex(Math.min(landscapePairs.length, landscapeIndex + 1))} className="group flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors">
                <span className="hidden md:inline font-mono text-xs uppercase">Next</span>
                <div className="p-3 border border-stone-300 rounded-full group-hover:bg-white group-hover:shadow-lg transition-all"><ChevronDown size={20}/></div>
             </button>
         </div>
      </section>

      {/* ======================================================== */}
      {/* [区域 5] 底部页脚 (FOOTER) */}
      {/* 包含版权信息、重置按钮和二维码 */}
      {/* ======================================================== */}
      <footer className="bg-[#111] text-stone-400 py-16 px-6 md:px-12 border-t border-stone-800 relative overflow-hidden">
         <div className="absolute top-0 left-1/2 w-[1px] h-full bg-stone-800 hidden md:block opacity-30"></div>
         
         <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
             <div className="text-center md:text-right space-y-6">
                <div className="inline-block border-b border-stone-800 pb-2 mb-4">
                     <p className="text-white text-3xl md:text-4xl font-serif tracking-wide">{data.profile.name}</p>
                </div>
                <p className="text-xs md:text-sm opacity-50 uppercase tracking-[0.2em] font-mono leading-loose">
                    Photographer & Visual Artist<br/>
                    Based in Nowhere<br/>
                    © {new Date().getFullYear()} All Rights Reserved
                </p>
                <div className="mt-8 flex justify-center md:justify-end gap-6 text-sm font-medium">
                   {/* 重置数据按钮 (仅编辑模式) */}
                   {isEditing ? (
                     <button onClick={() => { if(confirm('Reset?')) { setData(resetData()); window.location.reload(); } }} className="text-rose-500 flex items-center gap-2 hover:text-rose-400 transition-colors"><RotateCcw size={14}/> Reset Data</button>
                   ) : <button onClick={() => setShowLogin(true)} className="flex items-center gap-2 hover:text-white transition-colors opacity-40 hover:opacity-100"><Lock size={14}/> Artist Login</button>}
                </div>
             </div>

             {/* 右侧：二维码展示区 */}
             <div className="flex flex-col items-center md:items-start justify-center gap-8">
                 <p className="font-mono text-xs uppercase tracking-widest text-stone-600 mb-2">Social Connections</p>
                 <div className="flex gap-8">
                     {/* 二维码 1 */}
                     <div className="group flex flex-col items-center gap-4">
                        <div className="w-32 h-32 bg-white p-2 cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]" onClick={() => setZoomQR(data.profile.qrCode1)}>
                           <img src={data.profile.qrCode1} alt="QR 1" className="w-full h-full object-contain" />
                        </div>
                        {isEditing ? <input value={data.profile.qrCode1} onChange={(e) => updateProfile('qrCode1', e.target.value)} className="w-32 bg-stone-900 border border-stone-700 text-[10px] p-2 text-stone-300 font-mono text-center"/> : 
                        <span className="text-[10px] uppercase tracking-widest flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity"><QrCode size={12}/> Instagram</span>}
                     </div>
                     {/* 二维码 2 */}
                     <div className="group flex flex-col items-center gap-4">
                        <div className="w-32 h-32 bg-white p-2 cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]" onClick={() => setZoomQR(data.profile.qrCode2)}>
                           <img src={data.profile.qrCode2} alt="QR 2" className="w-full h-full object-contain" />
                        </div>
                         {isEditing ? <input value={data.profile.qrCode2} onChange={(e) => updateProfile('qrCode2', e.target.value)} className="w-32 bg-stone-900 border border-stone-700 text-[10px] p-2 text-stone-300 font-mono text-center"/> : 
                         <span className="text-[10px] uppercase tracking-widest flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity"><QrCode size={12}/> WeChat</span>}
                     </div>
                 </div>
             </div>
         </div>
      </footer>

      {/* ======================================================== */}
      {/* 弹窗组件区 (MODALS) */}
      {/* ======================================================== */}
      
      {/* 1. 二维码放大弹窗 */}
      {zoomQR && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-6 cursor-pointer" onClick={() => setZoomQR(null)}>
            <div className="bg-white p-6 md:p-8 max-w-sm w-full animate-in fade-in zoom-in duration-300 shadow-2xl relative">
                <button className="absolute top-2 right-2 text-black/50 hover:text-black"><X size={20}/></button>
                <img src={zoomQR} alt="Zoomed QR" className="w-full h-auto" />
                <div className="text-center mt-6 space-y-2">
                    <p className="text-black font-serif text-lg tracking-wide">Scan Code</p>
                    <p className="text-stone-500 font-mono text-[10px] uppercase tracking-widest">Connect with Artist</p>
                </div>
            </div>
        </div>
      )}

      {/* 2. 编辑模式悬浮按钮 */}
      {isEditing && (
        <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-3 animate-in slide-in-from-bottom-10 duration-500">
           <div className="bg-amber-600 text-white px-5 py-2 rounded-full shadow-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 justify-center shadow-amber-900/30">
              <Edit3 size={12} /> Live Editing
           </div>
           <button onClick={logout} className="bg-stone-900 text-white px-8 py-4 rounded-full shadow-2xl hover:bg-black hover:scale-105 transition-all flex items-center justify-center gap-3 font-medium border border-stone-700">
             <Save size={18} /> Save Changes
           </button>
        </div>
      )}

      {/* 3. 管理员登录弹窗 */}
      {showLogin && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-500">
           <div className="bg-[#fdfdfc] shadow-2xl w-full max-w-sm p-10 relative border border-stone-200">
              <div className="absolute top-0 left-0 w-full h-1 bg-amber-600"></div>
              <button onClick={() => setShowLogin(false)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-900"><X size={20} /></button>
              
              <div className="text-center mb-8">
                <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">Atelier Access</h2>
                <p className="text-stone-400 text-xs font-mono uppercase tracking-widest">Restricted Area</p>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-4">
                 <div>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} 
                      className="w-full bg-stone-50 border border-stone-200 p-3 text-sm focus:border-amber-600 outline-none transition-colors placeholder-stone-400 font-mono" placeholder="IDENTIFIER" />
                 </div>
                 <div>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} 
                      className="w-full bg-stone-50 border border-stone-200 p-3 text-sm focus:border-amber-600 outline-none transition-colors placeholder-stone-400 font-mono" placeholder="PASSPHRASE" />
                 </div>
                 
                 {authError && <div className="text-rose-500 text-[10px] font-mono uppercase text-center">{authError}</div>}

                 <button type="submit" className="w-full bg-stone-900 text-white py-3 hover:bg-black transition-colors text-xs font-bold uppercase tracking-widest mt-2">
                    Authenticate
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
