/**
 * Live2DManager.ts
 * 
 * 专门用于管理 oh-my-live2d 在 Astro + SWUP 环境下的持久化、样式恢复及生命周期。
 * 采用单例模式，确保全局只有一个管理器实例。
 */

import type { Live2DConfig } from '../types/config';

export class Live2DManager {
  private static instance: Live2DManager;
  private oml2d: any = null;
  private config: Live2DConfig | null = null;
  private isInitialized = false;
  private isInitializing = false;
  private configSignature: string | null = null;
  private libraryStyles: string[] = [];
  private welcomeShown = false;
  private rootElement: HTMLElement | null = null;
  private currentExpressionIndex = -1;

  private constructor() {
    if (typeof window !== 'undefined') {
      // 尝试从 sessionStorage 恢复欢迎语状态，确保刷新页面也不重复触发
      this.welcomeShown = sessionStorage.getItem('oml2d_welcome_shown') === 'true';
      this.setupEventListeners();
    }
  }

  public static getInstance(): Live2DManager {
    if (typeof window === 'undefined') {
      if (!Live2DManager.instance) Live2DManager.instance = new Live2DManager();
      return Live2DManager.instance;
    }

    if (!(window as any).__OML2D_MANAGER__) {
      console.log('[OML2D] Creating new Manager instance');
      (window as any).__OML2D_MANAGER__ = new Live2DManager();
      (window as any).Live2DManager = Live2DManager; // 方便控制台调试
    } else {
      console.log('[OML2D] Reusing existing Manager instance');
    }
    return (window as any).__OML2D_MANAGER__;
  }

  /**
   * 初始化或复用 Live2D 实例
   */
  public async init(config: Live2DConfig, configStr: string): Promise<void> {
    if (typeof window === 'undefined') return;
    
    // 检查全局锁定，防止并发初始化
    if ((window as any).__OML2D_LOCK__) {
      console.log('[OML2D] Initialization locked, skipping.');
      return;
    }

    console.log('[OML2D] Init called. isInitialized:', this.isInitialized, 'isInitializing:', this.isInitializing);

    // 确保持久化根节点存在
    this.ensureRootContainer();

    // 如果实例已存在，直接复用（不再强依赖 isInitialized，防止事件丢失导致重复创建）
    if (this.oml2d) {
      console.log('[OML2D] Instance exists, handling transition.');
      if (!this.isInitialized) {
        console.warn('[OML2D] Instance exists but isInitialized was false. Marking as initialized.');
        this.isInitialized = true;
      }
      this.handleRouteTransition();
      return;
    }

    // 如果正在初始化，直接跳过
    if (this.isInitializing) {
      console.log('[OML2D] Already initializing, skipping.');
      return;
    }

    console.log('[OML2D] Starting full initialization');
    this.isInitializing = true;
    (window as any).__OML2D_LOCK__ = true;
    this.config = config;

    try {
      // 彻底清理旧的 DOM 节点，防止重复加载出现多个模型
      const oldElements = document.querySelectorAll('#oml2d-stage, .oml2d-stage, #oml2d-statusBar, #oml2d-menus, #oml2d-global-style');
      oldElements.forEach(el => el.remove());

      console.log('[OML2D] Importing oh-my-live2d...');
      const { loadOml2d } = await import('oh-my-live2d');
      
      this.configSignature = configStr;
      const processedConfig = this.preprocessConfig(config);
      
      this.oml2d = loadOml2d(processedConfig);

      console.log('[OML2D] Instance created, registering onHit');
      // 立即注册模型点击事件，不要等待 onLoad
      if (typeof this.oml2d.onHit === 'function') {
        this.oml2d.onHit((names: string[]) => {
          this.handleModelClick('PIXI', names);
        });
      } else {
        console.warn('[OML2D] onHit method not found on instance');
      }

      this.oml2d.onLoad((status: string) => {
        console.log('[OML2D] Library onLoad status:', status);
        this.isInitializing = false;
        (window as any).__OML2D_LOCK__ = false;
        if (status === 'success') {
          this.isInitialized = true;
          this.handleFirstLoadSuccess(config);
        }
      });

    } catch (error) {
      this.isInitializing = false;
      (window as any).__OML2D_LOCK__ = false;
      console.error('[OML2D] Initialization failed', error);
    }
  }

  /**
   * 预处理配置，禁用自动欢迎语并设置动态闲置提示
   */
  private preprocessConfig(config: Live2DConfig): any {
    // 深度克隆配置以避免修改原始对象
    const finalConfig = JSON.parse(JSON.stringify(config));
    
    // 彻底禁用库内置的欢迎语触发
    if (finalConfig.tips?.welcomeTips) {
      finalConfig.tips.welcomeTips.message = {};
    }

    // 设置动态闲置提示语
    if (finalConfig.tips?.idleTips) {
      finalConfig.tips.idleTips.message = () => {
        const period = this._getCurrentTimePeriod();
        const messageSource = config.tips?.idleTips?.message;
        
        if (messageSource && typeof messageSource === 'object' && !Array.isArray(messageSource)) {
          const pool = messageSource[period] || messageSource['morning'] || [];
          return Array.isArray(pool) ? pool[Math.floor(Math.random() * pool.length)] : pool;
        }
        
        // 回退到原始配置（如果是数组或字符串）
        const originalPool = finalConfig.tips.idleTips.message;
        return Array.isArray(originalPool) 
          ? originalPool[Math.floor(Math.random() * originalPool.length)] 
          : originalPool;
      };
    }
    
    // 设置父容器为持久化根节点
    finalConfig.parentElement = this.rootElement;

    // 处理自定义菜单项
    if (config.custom?.menu?.items) {
      finalConfig.menus = finalConfig.menus || {};
      finalConfig.menus.items = config.custom.menu.items.map(item => ({
        id: item.id,
        title: item.title,
        icon: item.icon,
        onClick: (oml2d: any) => {
          console.log('[OML2D] Menu item clicked:', item.action);
          if (item.action === 'rest') {
            // 优先使用 Fork 版本新增的 sleep 方法
            if (typeof oml2d.sleep === 'function') {
              oml2d.sleep();
              // 监听状态栏点击以恢复表情
              const originalClick = oml2d.statusBar.element.onclick;
              oml2d.setStatusBarClickEvent(() => {
                if (originalClick) originalClick();
                setTimeout(() => this.applyDefaultExpression(config), 1000);
              });
            } else {
              // 回退到手动实现
              const restMsg = oml2d.options?.statusBar?.restMessage || '看板娘打个盹，戳我唤醒~';
              oml2d.statusBarOpen(restMsg);
              oml2d.clearTips();
              oml2d.setStatusBarClickEvent(() => {
                oml2d.statusBarClose();
                oml2d.stageSlideIn();
                oml2d.statusBarClearEvents();
                setTimeout(() => this.applyDefaultExpression(config), 1000);
              });
              if (oml2d.stageSlideOut) oml2d.stageSlideOut();
            }
          } else if (item.action === 'cycle-expression') {
            this.cycleExpression(config);
          }
        }
      }));
    }
    
    // 移除自定义扩展字段，避免传给库报错
    delete finalConfig.custom;
    
    return finalConfig;
  }

  private lastClickTime = 0;

  /**
   * 统一处理点击事件
   */
  private handleModelClick(source: string, areas?: string[]): void {
    const now = Date.now();
    // 500ms 内防止重复触发
    if (now - this.lastClickTime < 500) return;
    this.lastClickTime = now;

    console.log(`[OML2D] Click detected from ${source}`, areas ? `areas: ${areas.join(', ')}` : '');
    const tip = this._getRandomTipByTime();
    this.setExpressionSafely('smile', tip);
  }

  /**
   * 注册 Canvas 点击事件（作为 PIXI hit 事件的补充/兜底）
   */
  private registerCanvasClick(): void {
    const canvas = document.getElementById('oml2d-canvas');
    if (canvas) {
      canvas.onclick = (event) => {
        event.stopPropagation();
        this.handleModelClick('DOM');
      };
      console.log('[OML2D] Canvas DOM click listener registered');
    }
  }

  /**
   * 首次加载成功后的处理
   */
  private handleFirstLoadSuccess(config: Live2DConfig): void {
    console.log('Live2DManager: First load success');
    
    // 1. 捕获样式
    setTimeout(() => this.captureLibraryStyles(), 500);
    
    // 2. 注入手动补丁样式
    this.injectManualStyles();
    
    // 3. 触发欢迎语（仅限首次）
    if (!this.welcomeShown) {
      this.showWelcomeMessageByTime();
      this.welcomeShown = true;
      sessionStorage.setItem('oml2d_welcome_shown', 'true');
    }

    // 4. 应用默认表情
    this.applyDefaultExpression(config);

    // 5. 启动 Idle Player
    if (this.oml2d.tips?.idlePlayer) {
      this.oml2d.tips.idlePlayer.start();
    }

    // 6. 注册点击事件
    this.registerCanvasClick();
  }

  /**
   * 应用默认表情
   */
  private applyDefaultExpression(config: Live2DConfig): void {
    const defaultExp = config.custom?.defaultExpression;
    if (defaultExp) {
      console.log('[OML2D] Applying default expression:', defaultExp);
      this.setExpressionSafely(defaultExp);
    }
  }

  /**
   * 循环切换表情
   */
  private cycleExpression(config: Live2DConfig): void {
    const expressions = config.custom?.expressions;
    if (!expressions || expressions.length === 0) return;

    this.currentExpressionIndex = (this.currentExpressionIndex + 1) % expressions.length;
    const exp = expressions[this.currentExpressionIndex];

    console.log('[OML2D] Setting expression:', exp.name);
    this.setExpressionSafely(exp.name, exp.tip);
  }

  /**
   * 安全地设置表情（兼容 v0.19.3 及 Fork 版本）
   */
  private setExpressionSafely(name: string, tip?: string): void {
    if (!this.oml2d) return;
    console.log('[OML2D] setExpressionSafely called:', { name, tip });

    try {
      // 优先使用 Fork 版本新增的顶层方法
      if (typeof this.oml2d.setExpression === 'function') {
        this.oml2d.setExpression(name);
      } else {
        // 回退到 v0.19.3 的原始路径
        const model = this.oml2d.models?.model;
        if (model && typeof model.expression === 'function') {
          model.expression(name);
        }
      }

      // 显示提示
      if (tip) {
        if (this.oml2d.tips?.notification) {
          this.oml2d.tips.notification(tip, 3000, 3);
        } else if (this.oml2d.tips?.show) {
          this.oml2d.tips.show(tip, 3000);
        } else if (this.oml2d.tipsMessage) {
          this.oml2d.tipsMessage(tip, 3000, 3);
        }
      }
    } catch (e) {
      console.error('[OML2D] Failed to set expression:', e);
    }
  }

  /**
   * 处理路由切换（SWUP / View Transitions）
   */
  private handleRouteTransition(): void {
    console.log(`[OML2D-V2-${new Date().getTime()}] Handling route transition`);
    
    // 1. 确保根容器在 body 中且可见
    this.ensureRootContainer();
    console.log('[OML2D] Root element state:', {
      exists: !!this.rootElement,
      id: this.rootElement?.id,
      isConnected: this.rootElement?.isConnected,
      parent: this.rootElement?.parentElement?.tagName
    });

    if (this.rootElement) {
      this.rootElement.style.display = 'block';
      if (!this.rootElement.isConnected) {
        console.log('[OML2D] Root element disconnected, re-attaching to body');
        document.body.appendChild(this.rootElement);
      }
    }

    // 2. 确保样式和图标存在（SWUP 可能会替换 head）
    this.restoreLibraryStyles();
    this.injectManualStyles();
    this.ensureIconsInjected();

    // 3. 使用库原生的 reMount 方法重新挂载
    if (this.oml2d && typeof this.oml2d.reMount === 'function') {
      console.log('[OML2D] Calling reMount with:', this.rootElement?.id);
      this.oml2d.reMount(this.rootElement);
    }

    // 4. 尝试触发 PIXI 调整大小
    if (this.oml2d.pixiApp?.resize) {
      console.log('[OML2D] Triggering resize');
      this.oml2d.pixiApp.resize();
      setTimeout(() => {
        console.log('[OML2D] Delayed resize');
        this.oml2d.pixiApp?.resize?.();
      }, 200);
    }

    // 5. 确保 Idle Player 运行
    const idlePlayer = this.oml2d?.tips?.idlePlayer;
    if (idlePlayer && !idlePlayer.timer) {
      idlePlayer.start();
    }

    // 6. 重新注册点击事件（Canvas 可能会被重新挂载）
    this.registerCanvasClick();
  }

  /**
   * 根据当前时间段显示对应的欢迎提示语
   */
  private showWelcomeMessageByTime(): void {
    if (!this.oml2d || !this.config) return;

    const period = this._getCurrentTimePeriod();
    const welcomeTips = this.config.tips?.welcomeTips?.message;
    
    let message = "欢迎来到我的博客！";
    if (welcomeTips && typeof welcomeTips === 'object' && !Array.isArray(welcomeTips)) {
      message = welcomeTips[period] || welcomeTips['morning'] || message;
    }

    this.setExpressionSafely('smile', message);
  }

  /**
   * 根据当前小时数获取时间段标识
   */
  private _getCurrentTimePeriod(): string {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) return 'weeHours';
    if (hour >= 5 && hour < 7) return 'daybreak';
    if (hour >= 7 && hour < 11) return 'morning';
    if (hour >= 11 && hour < 13) return 'noon';
    if (hour >= 13 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 19) return 'dusk';
    if (hour >= 19 && hour < 21) return 'night';
    return 'lateNight';
  }

  /**
   * 从当前时间段的提示池中随机获取一条提示语
   */
  private _getRandomTipByTime(): string {
    const period = this._getCurrentTimePeriod();
    const hitTips = this.config?.custom?.hitTips;
    
    if (hitTips && typeof hitTips === 'object') {
      const pool = hitTips[period] || hitTips['morning'] || [];
      if (Array.isArray(pool) && pool.length > 0) {
        return pool[Math.floor(Math.random() * pool.length)];
      }
    }
    
    return "你好呀~";
  }

  /**
   * 确保持久化根节点存在
   */
  private ensureRootContainer(): void {
    if (this.rootElement && this.rootElement.isConnected) return;

    let root = document.getElementById('live2d-persistent-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'live2d-persistent-root';
      document.body.appendChild(root);
    }
    this.rootElement = root;
  }

  /**
   * 捕获库生成的样式
   */
  private captureLibraryStyles(): void {
    const styles = document.querySelectorAll('style');
    const captured: string[] = [];
    for (const style of styles) {
      if (style.textContent && (style.textContent.includes('.oml2d-') || style.textContent.includes('#oml2d'))) {
        if (style.textContent.length > 50000) continue;
        captured.push(style.textContent);
      }
    }
    if (captured.length > 0) {
      this.libraryStyles = captured;
    }
  }

  /**
   * 恢复样式
   */
  private restoreLibraryStyles(): void {
    this.libraryStyles.forEach((css, index) => {
      const id = `oml2d-restored-style-${index}`;
      if (!document.getElementById(id)) {
        const style = document.createElement('style');
        style.id = id;
        style.textContent = css;
        document.head.appendChild(style);
      }
    });
  }

  /**
   * 注入手动补丁样式
   */
  private injectManualStyles(): void {
    const id = 'oml2d-manual-patch-style';
    if (document.getElementById(id)) return;

    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      .oml2d-icon, .svgfont {
        width: 1em !important; height: 1em !important;
        fill: currentColor !important; vertical-align: -0.15em !important;
        font-size: 24px !important; display: inline-block !important;
      }
      .oml2d-tips { transition: opacity 0.3s ease !important; }
      #oml2d-stage, #oml2d-canvas { pointer-events: auto !important; }
    `;
    document.head.appendChild(style);
  }

  /**
   * 恢复图标
   */
  private ensureIconsInjected(): void {
    // @ts-ignore
    const svgString = window._iconfont_svg_string_3847283;
    if (!svgString || document.getElementById('icon-rest')) return;

    const div = document.createElement('div');
    div.innerHTML = svgString;
    const svg = div.querySelector('svg');
    if (svg) {
      svg.style.display = 'none';
      document.body.insertBefore(svg, document.body.firstChild);
    }
  }

  /**
   * 设置事件监听
   */
  private setupEventListeners(): void {
    const refresh = () => {
      console.log('[OML2D] Route change detected, refreshing...');
      
      // 如果已经初始化，直接处理路由切换逻辑（现在是幂等的）
      if (this.oml2d && this.isInitialized) {
        this.handleRouteTransition();
        return;
      }

      // 否则尝试初始化
      const container = document.getElementById('live2d-container');
      if (container) {
        const config = JSON.parse(container.getAttribute('data-config') || '{}');
        const configStr = container.getAttribute('data-config') || '';
        this.init(config, configStr);
      }
    };

    // SWUP 事件
    document.addEventListener('swup:contentReplaced', refresh);
    
    // Astro View Transitions 事件
    document.addEventListener('astro:after-swap', refresh);

    // 复制提醒
    window.addEventListener('copy', () => {
      const copyTips = this.config?.tips?.copyTips;

      if (copyTips && this.oml2d?.tips?.notification) {
        const message = Array.isArray(copyTips.message) 
          ? copyTips.message[Math.floor(Math.random() * copyTips.message.length)]
          : (copyTips.message || '复制成功，引用请注明出处哦~');

        this.oml2d.tips.notification(message, copyTips.duration || 3000, copyTips.priority || 3);
      }
    });
  }
}
