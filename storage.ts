import { AppData, Photo } from './types';

const STORAGE_KEY = 'portfolio_data_v2';

// =========================================================================
// [中文备注 - 核心数据配置区]
// 这里是网页的"默认内容"。如果您想永久修改网页上显示的文字、图片或链接，
// 请直接修改下方的 DEFAULT_DATA 对象中的内容。
//
// 注意：如果您之前在网页上点击过"Save"保存，浏览器会优先读取本地缓存。
// 修改完这里代码后，请在网页底部点击 "Reset Data" 按钮，或清除浏览器缓存以加载新内容。
// =========================================================================

const DEFAULT_DATA: AppData = {
  // 1. 个人资料板块 (网页顶部信息)
  profile: {
    name: "Alex Lumière", // [修改] 您的名字 (显示在顶部大标题)
    title: "Visual Storyteller & Photographer", // [修改] 您的职业或头衔
    
    // [修改] 个人简介（支持长文本，介绍您的风格）
    bio: "Capturing the ephemeral moments of light and shadow. My work explores the silence between chaos and the beauty found in the mundane. Welcome to my visual diary.",
    
    // [修改] 头像图片链接 (可以是网络链接 https://... 或本地路径 /assets/avatar.jpg)
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
    
    socialLink: "instagram.com/alex.lumiere", // 社交链接文本(主要用于显示)
    
    // [修改] 底部二维码图片链接 1 (例如：微信二维码)
    qrCode1: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://instagram.com",
    
    // [修改] 底部二维码图片链接 2 (例如：Instagram二维码)
    qrCode2: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://weixin.qq.com"
  },
  
  // 2. 第一本相册数据（竖屏风格 - 适合人像/静物/海报）
  // 建议图片比例：2:3 (竖长方形)
  portraitPhotos: [
    { 
      id: 'p1', // 唯一ID，不要重复
      url: 'https://images.unsplash.com/photo-1515462277126-2dd0c162007a?q=80&w=800&auto=format&fit=crop', // [修改] 图片链接
      caption: 'Neon Rain', // [修改] 图片标题
      date: '2023' // [修改] 拍摄年份/日期
    },
    { id: 'p2', url: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=800&auto=format&fit=crop', caption: 'Space Station', date: '2023' },
    { id: 'p3', url: 'https://images.unsplash.com/photo-1520690214124-2405c5217036?q=80&w=800&auto=format&fit=crop', caption: 'Desert Mirage', date: '2024' },
    { id: 'p4', url: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=800&auto=format&fit=crop', caption: 'Red Temple', date: '2024' },
    { id: 'p5', url: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=800&auto=format&fit=crop', caption: 'Tokyo Night', date: '2024' },
    { id: 'p6', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop', caption: 'Silence', date: '2024' },
  ],

  // 3. 第二本相册数据（横屏风格 - 适合风景/建筑/宽幅画面）
  // 建议图片比例：3:2 (横长方形)
  landscapePhotos: [
    { 
      id: 'l1', 
      url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1000&auto=format&fit=crop', 
      caption: 'Highlands', 
      date: '2023' 
    },
    { id: 'l2', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop', caption: 'Valley Mist', date: '2023' },
    { id: 'l3', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop', caption: 'Yosemite Fall', date: '2024' },
    { id: 'l4', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000&auto=format&fit=crop', caption: 'Deep Woods', date: '2024' },
  ]
};

// =========================================================================
// 下方是数据加载逻辑，通常无需修改
// =========================================================================

export const loadData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load data", e);
  }
  return DEFAULT_DATA;
};

export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log("Data auto-saved");
  } catch (e) {
    console.error("Failed to save data", e);
  }
};

export const resetData = (): AppData => {
  localStorage.removeItem(STORAGE_KEY);
  return DEFAULT_DATA;
};
